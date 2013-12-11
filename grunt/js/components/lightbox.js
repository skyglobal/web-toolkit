/*global jQuery:false */
if (typeof toolkit==='undefined') toolkit={};
toolkit.lightbox = (function ($, keyboardFocus, hash) {
    "use strict";
	var scrollbarWidth = function() {
        var scrollDiv = document.createElement("div"),
            scrollbarWidth;
        scrollDiv.className = "lightbox-scrollbar-measure";
        document.body.appendChild(scrollDiv);
        scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    }();

	function hideTabIndex(index, element) {
		var $element = $(element);
		// Note that if tabindex is 'undefined', data-tabindex does not get set
		$element.attr('data-tabindex', $element.attr('tabindex'));
		$element.attr('tabindex', -1);
	}

	function restoreTabIndex(index, element) {
		var $element = $(element);
		if ($element.attr('data-tabindex')) {
			$element.attr('tabindex', $element.attr('data-tabindex'));
			$element.removeAttr('data-tabindex');
		} else {
			// if the element didn't have a data-tabindex, then it did not define a tabindex
			$element.removeAttr('tabindex');
		}
	}

    function Lightbox(id, $originator, options){
        var $element = $('#' + id.replace('lightbox/',''));

        this.id = id;
        this.$container = ($element.hasClass('lightbox')) ? $element : $element.parents('.lightbox');
        this.$contents = (this.$container.length) ? this.$container.find('.lightbox-content') : $element ;
        this.$closeIcon = this.$container.find('.lightbox-close');
        this.$originator = $originator;

        if (!this.$container.length){
            this.create();
            this.bindEvents();
        }
        this.onShowCallback = options.onShow;
    }

	Lightbox.prototype = {
		bindEvents: function() {
            hash.register([this.id],this.open.bind(this) );

            this.$container.on("click", this.close.bind(this));
			this.$closeIcon.on("click", this.close.bind(this));
			this.$contents.on("click", function(e) { return false; });
		},

        create: function(){
            var $contents = this.$contents;
            var $parent = this.$contents.parent();
            var lightboxDiv = document.createElement('div');
            var container = document.createElement('div');
            var $close = $('<a class="internal-link lightbox-close skycon-close" href="#!"><span class="speak">Close</span></a>');

            lightboxDiv.className = 'lightbox';
            container.className = 'skycom-container lightbox-container clearfix';
            $contents.addClass('lightbox-content skycom-10 skycom-offset1').attr('role','dialog');
            $contents.prepend($close);

            $(container).append($contents);
            $(lightboxDiv).append($(container));
            $parent.append($(lightboxDiv));

            this.$container = $(lightboxDiv);
            this.$closeIcon = $close;
        },

		open: function() {
            if (this.onShowCallback){
                this.onShowCallback();
            }

			// hide the scrollbar on the body
			$('body').css( {
				'overflow':		'hidden',
				'padding-right': scrollbarWidth + 'px'
			});

			this.$container.addClass('lightbox-open');

			// if we were navigated by the keybaord, propogate that focus class to the lightbox
			if (this.$originator.hasClass(keyboardFocus.className)) {
                keyboardFocus.apply(this.$closeIcon[0]);
			}else{
                this.$closeIcon[0].focus();
            }

			// remove tabbing for all elements and re-enable for elements in the lightbox
			$('a, input, select, textarea, button, *[tabindex]').each(hideTabIndex);
			this.$container.find('*[tabindex]').each(restoreTabIndex);
		},

		close: function(event) {
			event.preventDefault();
            if (this.$container.hasClass('lightbox-closing')) { return ; }

            this.$container.addClass('lightbox-closing');

            // really really hode the lightbox once the 0.5 sec animation has finished
            var cont = this.$container;
            var orig = this.$originator;

            window.setTimeout(function() {
                cont.removeClass('lightbox-open');
                cont.removeClass('lightbox-closing');

                // move the focus back to the element that opened the lightbox
                // defend against not passing in the 'originator' in the show() method
                if (orig) {
                    orig.focus();
                }

                // remove our inline stying for the scrollbar fudge
                $('body').removeAttr('style');

                // restore all tabbing
                $('*[tabindex]').each(restoreTabIndex);
            }, 500);

            hash.remove();
		}
	};

	$.fn.lightbox = function(options) {
		return this.each(function() {
			var lb = new Lightbox($(this).attr('href').replace('#!',''),$(this), options);
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