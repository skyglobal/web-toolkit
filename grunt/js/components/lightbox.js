/*global jQuery:false */
if (typeof toolkit==='undefined') toolkit={};
toolkit.lightbox = (function ($, keyboardFocus, hash) {
    "use strict";
	var scrollbarWidth,
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
        };

    var html = {
        waitingForAjax: '<div class="lightbox-content"><div class="skycom-container"><div class="skycom-12"><div class="spinner-blue"><p>Please wait...</p></div></div></div></div>',
        closeButton: '<a class="internal-link ' + classes.closeButton + ' skycon-close" href="#!"><span class="speak">Close</span></a>',
        container: '<div class="skycom-container lightbox-container clearfix"></div>',
        lightboxWrapper: '<div class="' + classes.main + '"></div>'
    };

    var defaults = {
        sizingClasses: 'skycom-10 skycom-offset1'
    };

    var lightboxId = 1;

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
        this.init(options);
    }

	Lightbox.prototype = {

        init: function(options) {
            if (options){
                this.onShow = options.onShow;
                this.onClose = options.onClose;
            }

            if (this.href.substring(0,1) === '#') {
                this.setup();
            }
            else {
                this.$lightboxLink.on("click", this.setupAjax.bind(this));
            }
        },

        setup: function() {
            var $element = $('#' + this.href.replace('#!lightbox/',''));

            this.$container = ($element.hasClass(classes.main)) ? $element : $element.closest('.' + classes.main);
            this.$contents = (this.$container.length) ? this.$container.find('.' + classes.content) : $element ;

            if (!this.$container.length){
                this.create();
                this.bindEvents();
            }
        },

        setupAjax: function() {
            var lightbox = this;
            this.isAjax = true;
            var promise;
            var url = lightbox.$lightboxLink.attr('href');
            var lightboxId = 'lightbox-' + nextLightboxId();
            var $content = $( html.waitingForAjax ).attr('id', lightboxId );

            $("body").append($content);
            lightbox.href = '#!lightbox/' + lightboxId;
            lightbox.$lightboxLink.attr('href', this.href);
            lightbox.$lightboxLink.off('click');
            lightbox.setup();
            hash.change( this.href );

            promise = $.get(url);

            promise.done(function(data) {
                lightbox.$contents.html(data);
                lightbox.$contents.prepend(html.closeButton);
            });

            return false;

        },

        bindEvents: function() {
            var lightbox = this;

            //this.$lightboxLink.on("click", this.open.bind(this));
            hash.register([this.href],this.open.bind(this) );
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
            var $contents = this.$contents,
                $parent = this.$contents.parent(),
                $lightboxDiv = $(html.lightboxWrapper),
                $container = $(html.container),
                $close = $(html.closeButton);

            $contents.addClass(classes.content + ' ' + this.options.sizingClasses).attr('role','dialog');
            $contents.prepend($close);

            $container.append($contents);
            $lightboxDiv.append($container);
            $parent.append($lightboxDiv);

            this.$container = $lightboxDiv;
        },

		open: function() {
            console.log("open called");
            if (this.$container.hasClass(classes.open)) { return ; }
            if (this.onShow){
                this.onShow();
            }
            hideBodyScrollBar();

            this.$container.addClass(classes.open);

            focusOnCloseButton(this.$lightboxLink, this.$container.find('.' + classes.closeButton));
            disablePageTabbing();
            enablePageTabbing(this.$container);
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
                if (lightbox.onClose){
                    lightbox.onClose();
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