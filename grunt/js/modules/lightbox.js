/*global jQuery:false */
if (typeof toolkit==='undefined') toolkit={};
toolkit.lightbox = (function ($) {
    "use strict";

	var scrollbarWidth;

    console.info("Fo' shizzle my nizzle, da lightbox is here!");

	function Lightbox($element){
		this.$container = $element;
		this.$closeIcon = $element.find('.lightbox-close');
		this.bindEvents();
	}

	scrollbarWidth = function() {
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

	Lightbox.prototype = {
		bindEvents: function() {
			// bind the grey faded bits
			this.$container.on("click", this.close.bind(this));

			// bind the close icon
			this.$closeIcon.on("click", this.close.bind(this));

			// bind all lightbox open links
			var lightboxId = this.$container.attr('id');
			$('[data-skyLightbox=#' + lightboxId + ']').on("click", this.open.bind(this));

			// prevent clicks on the lightbox from closing it
			this.$container.find('.lightbox-content').on("click", function(e) {
				return false;
			}.bind(this));
		},

		open: function(event, $target) {
			// event doesn't exist if called manually
			if (event) {
				event.preventDefault();
				this.$originator = $(event.target);
			}

			if ($target) {
				this.$originator = $target;
			}

			// hide the scrollbar on the body ('cos we don't want the user to scroll that any more) and replace the
			// space it took up with a (dynamically calculated) padding. If we don't, the grid resizes itself to take
			// up the newly available space and the page content jumps around.
			$('body').css( {
				'overflow':		'hidden',
				'padding-right': scrollbarWidth + 'px'
			});

			// show the lightbox
			this.$container.addClass('lightbox-open');

			// move the focus to the close icon
			this.$closeIcon[0].focus();

			// if we were navigated by the keybaord, propogate that focus class to the lightbox
			if (this.$originator.hasClass('skycom-focus')) {
				this.$closeIcon.addClass('skycom-focus');
			}

			// remove tabbing for all elements and re-enable for elements in the lightbox
			$('a, input, select, textarea, button, *[tabindex]').each(hideTabIndex);
			this.$container.find('*[tabindex]').each(restoreTabIndex);
		},

		close: function(event) {
			event.preventDefault();

			// hide the lightbox
			this.$container.removeClass('lightbox-open');

			// move the focus back to the element that opened the lightbox
			// defend against not passing in the 'originator' in the show() method
			if (this.$originator) {
				this.$originator.focus();
			}

			// remove our inline stying for the scrollbar fudge
			$('body').removeAttr('style');

			// restore all tabbing
			$('*[tabindex]').each(restoreTabIndex);
		}
	};

	$.fn.skyLightbox = function() {
		return this.each(function() {
			var lightbox = new Lightbox($(this));
		});
	};

    return {
		show: function(lightbox, originator) {
			var lbox = new Lightbox($(lightbox));
			lbox.open.bind(lbox)(false, $(originator));
		}
	};

})(jQuery);
