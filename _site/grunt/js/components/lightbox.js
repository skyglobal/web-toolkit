/*global jQuery:false */
//todo: add 'flip' option for if a picture is clicked.
if (typeof toolkit==='undefined') toolkit={};
toolkit.lightbox = (function ($, keyboardFocus, hash, event, detect) {
    "use strict";
	var scrollbarWidth,
        classes = {
            main: 'lightbox',
            closing: 'lightbox-closing',
            content: 'lightbox-content',
            closeButton: 'lightbox-close',
            open: 'lightbox-open',
            large: 'skycom-10 skycom-offset1',
            small: 'skycom-5 skycom-offset3'
        },
        getSrollbarWidth = function() {//cant self execute if toolkit.js is in the head as document.body doesnt exist yet
            var scrollDiv = document.createElement("div");
            scrollDiv.className = "lightbox-scrollbar-measure";
            document.body.appendChild(scrollDiv);
            scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            return scrollbarWidth;
        },
        html = {
            waitingForAjax: '<div style="margin:0 auto;width: 150px;"><div class="spinner-blue"><p>Please wait...</p></div></div>',
            closeButton: '<a class="internal-link ' + classes.closeButton + ' skycon-close" href="#!"><span class="speak">Close</span></a>',
            container: '<div class="skycom-container lightbox-container clearfix"></div>',
            contents: '<div class="' + classes.content + '" role="dialog"></div>',
            lightboxWrapper: '<div class="' + classes.main + '"></div>'
        },
        defaults = {
            size: 'large',
            closeButtonColour: 'white'
        };

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
            hash.register(restfulHash, this.open.bind(this));
        },

        getRestfulHash: function(){
            if (this.isAjaxRequest){
                this.restfulHash = '#!' + (this.href.split('#!')[1]);
            } else {
                this.restfulHash = this.href;
            }
            return this.restfulHash;
        },

        getAjaxContent: function() {
            var lightbox = this;
            var $spinner = $( html.waitingForAjax );
            lightbox.$contents.append($spinner);

            $.get(lightbox.href).done(function(data) {
                lightbox.$lightboxLink.attr('href', lightbox.restfulHash);
                lightbox.href = lightbox.restfulHash;
                hash.change(hash.cleanHash(lightbox.href));
                $spinner.remove();
                lightbox.populate(null,data);
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
            event.on(this.$container[0], 'animationend', lightbox.onClose.bind(lightbox));
		},

        populate: function(e, data){
            data = data || $('#' + hash.cleanHash(this.restfulHash.replace(/\//g,'-'))).removeClass('hidden');
            if (data.length>0) {
                this.$container.find('.' + classes.content).append(data);
            } else {
                if (e && e.preventDefault){ e.preventDefault(); }
                this.getAjaxContent();
            }
        },

        create: function(){
            var $lightboxDiv = $(html.lightboxWrapper),
                $contents = $(html.contents),
                $container = $(html.container),
                $close = $(html.closeButton).addClass(this.options.closeButtonColour);

            this.$contents = $contents;
            $contents.attr('aria-labelledby',this.$lightboxLink.id).attr('role','dialog').addClass(classes[this.options.size]);
            $contents.prepend($close);
            $container.append($contents);
            $lightboxDiv.append($container);

            $('body').append($lightboxDiv);

            this.$container = $lightboxDiv;
        },

		open: function(e) {
            if (!this.$container){
                this.create();
                this.populate(e);
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

		},

		close: function() {
            var lightbox = this;
            if (this.$container.hasClass(classes.closing)) { return ; }

            if (!detect.css('animation')){
                setTimeout(lightbox.onClose.bind(lightbox),500);
            }

            this.$container.addClass(classes.closing);
            hash.remove();
        },

        onClose: function(){
            var lightbox = this;
            if (!lightbox.$container.hasClass(classes.closing)) { return; }
            lightbox.$container.removeClass(classes.open + ' ' + classes.closing);
            focusOnLightboxLink(lightbox.$lightboxLink);
            showBodyScrollBar();
            enablePageTabbing($('body'));
            if (lightbox.options.onClose){
                lightbox.options.onClose();
            }
        }


	};

	$.fn.lightbox = function(options) {
		return this.each(function() {
			var lb = new Lightbox( this, options);
		});
	};

});

if (typeof window.define === "function" && window.define.amd) {
    define('components/lightbox',
            ['utils/focus',
            'utils/hashManager',
            'utils/event',
            'utils/detect'
            ], function(focus, hash, event, detect) {
        'use strict';
        return toolkit.lightbox(jQuery, focus, hash, event, detect);
    });
} else {
    toolkit.lightbox = toolkit.lightbox(jQuery, toolkit.focus, toolkit.hashManager, toolkit.event, toolkit.detect);
}