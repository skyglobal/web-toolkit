/*global jQuery:false */
if (typeof toolkit==='undefined') toolkit={};
toolkit.lightbox = (function ($, keyboardFocus, hash) {
    "use strict";
	var scrollbarWidth,
        lightboxId = 1,
        classes = {
            main: 'lightbox',
            closing: 'lightbox-closing',
            content: 'lightbox-content',
            closeButton: 'lightbox-close',
            open: 'lightbox-open'
        },
        getSrollbarWidth = function() {
            //cant self execute if toolkit.js is in the head as document.body doesnt exist yet
            var scrollDiv = document.createElement("div");
            scrollDiv.className = "lightbox-scrollbar-measure";
            document.body.appendChild(scrollDiv);
            scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            return scrollbarWidth;
        },
        html = {
            waitingForAjax: '<div class="spinner-blue"><p>Please wait...</p></div>',
            closeButton: '<a class="internal-link ' + classes.closeButton + ' skycon-close" href="#!"><span class="speak">Close</span></a>',
            container: '<div class="skycom-container lightbox-container clearfix"></div>',
            contents: '<div class="' + classes.content + ' skycom-10 skycom-offset1" role="dialog"></div>',
            lightboxWrapper: '<div class="' + classes.main + '"></div>'
        },
        defaults = {
            closeButtonColour: 'white'
        };

    function nextLightboxId() {
        return lightboxId++;
    }

	function disableElementTabbing(index, element) {
		var $element = $(element);
		$element.attr('data-tabindex', $element.attr('tabindex'));
		$element.attr('tabindex', -1);
	}
    function enableElementTabIndex(index, element) {
        var $element = $(element);
        if ($element.attr('data-tabindex')) {
            $element.attr('tabindex', $element.attr('data-tabindex'));
            $element.removeAttr('data-tabindex');
        } else {
            $element.removeAttr('tabindex');
        }
    }

    function disablePageTabbing(){
        $('a, input, select, textarea, button, *[tabindex]').each(disableElementTabbing);
    }
    function enablePageTabbing($container){
        $container.find('*[tabindex]').each(enableElementTabIndex);
    }

    function focusOnLightboxLink(link){
        if (!link) { return; }
        link.focus();
    }
    function focusOnCloseButton($lightboxLink, $closeIcon){
        if ($lightboxLink.hasClass(keyboardFocus.className)) {
            keyboardFocus.apply($closeIcon[0]);
        }else{
            $closeIcon[0].focus();
        }
    }

    function hideBodyScrollBar(){
        $('body').css( {
            'overflow':		'hidden',
            'padding-right': (scrollbarWidth || getSrollbarWidth()) + 'px'
        });
    }
    function showBodyScrollBar(){
        $('body').removeAttr('style');
    }

    function Lightbox( lightboxLink, options){
        this.$lightboxLink = $(lightboxLink);
        this.href = this.$lightboxLink.attr('href');
        this.options = $.extend( {}, defaults, options) ;
        this.init();
    }

	Lightbox.prototype = {

        init: function() {
            this.isAjaxRequest = (this.href.substring(0,1) !== '#');
            var restfulHash = this.getRestfulHash();
            this.$lightboxLink.on("click", this.open.bind(this));
            hash.register([restfulHash],this.open.bind(this));
        },

        getRestfulHash: function(){
            if (this.isAjaxRequest){
                this.restfulHash = '#!' + (this.options.restfulHash || 'lightbox/lightbox-' + nextLightboxId());
            } else {
                this.restfulHash = this.href;
            }
            return this.restfulHash;
        },

        getAjaxContent: function() {
            var lightbox = this;
            var $spinner = $( html.waitingForAjax );
            lightbox.$container.append($spinner);

            $.get(lightbox.href).done(function(data) {
                lightbox.$lightboxLink.attr('href', lightbox.restfulHash);
                lightbox.href = lightbox.restfulHash;
                hash.change(hash.cleanHash(lightbox.href));
                lightbox.isAjaxRequest = false;
                $spinner.remove();
                lightbox.$container.find('.' + classes.content).append(data);
            });

            return false;

        },

        bindEvents: function() {
            var lightbox = this;

            this.$container.on('click', function(e) {
                var $target = $(e.target);

                if ($target.hasClass(classes.closeButton) ) {
                    e.preventDefault();
                    lightbox.close();
                }
                if ($target.closest('.' + classes.content).length) {
                    return false;
                }

                lightbox.close();
            });

		},

        create: function(){
            var $parent,
                $contents = $('#' + this.restfulHash.replace('#!lightbox/','')),
                $lightboxDiv = $(html.lightboxWrapper),
                $container = $(html.container),
                $close = $(html.closeButton).addClass(this.options.closeButtonColour);

            if (!$contents.length){
                $contents = $(html.contents);
                $parent = $('body').append($contents);
            }

            $parent = $contents.parent();
            $contents.attr('aria-labelledby',this.$lightboxLink.id);
            $contents.prepend($close);
            $container.append($contents);
            $lightboxDiv.append($container);
            $parent.append($lightboxDiv);

            this.$container = $lightboxDiv;
        },

		open: function(e) {
            if (!this.$container){
                this.create();
                this.bindEvents();
            }
            if (this.$container.hasClass(classes.open)) { return ; }
            if (this.options.onShow){
                this.options.onShow();
            }
            hideBodyScrollBar();

            this.$container.addClass(classes.open);

            focusOnCloseButton(this.$lightboxLink, this.$container.find('.' + classes.closeButton));
            disablePageTabbing();
            enablePageTabbing(this.$container);

            if (this.isAjaxRequest) {
                if (e){ e.preventDefault(); }
                this.getAjaxContent();
            }
		},

		close: function(event) {
            var lightbox = this;
            if (this.$container.hasClass(classes.closing)) { return ; }

            this.$container.addClass(classes.closing);
            hash.remove();

            window.setTimeout(function() {
                lightbox.$container.removeClass(classes.open + ' ' + classes.closing);
                focusOnLightboxLink(lightbox.$lightboxLink);
                showBodyScrollBar();
                enablePageTabbing($('body'));
                if (lightbox.options.onClose){
                    lightbox.options.onClose();
                }

            }, 500);
		}
	};

	$.fn.lightbox = function(options) {
		return this.each(function() {
			var lb = new Lightbox( this, options);
		});
	};

});

if (typeof window.define === "function" && window.define.amd) {
    define('components/lightbox', ['utils/focus', 'utils/hashManager'], function(focus, hash) {
        'use strict';
        return toolkit.lightbox(jQuery, focus, hash);
    });
} else {
    toolkit.lightbox = toolkit.lightbox(jQuery, toolkit.focus, toolkit.hashManager);
}