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

	console.info("width: " + scrollbarWidth);

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

		open: function(e) {
			e.preventDefault();
			this.$originator = $(e.target);

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
		},

		close: function(e) {
			e.preventDefault();

			// hide the lightbox
			this.$container.removeClass('lightbox-open');

			// move the focus back to the element that opened the lightbox
			this.$originator.focus();

			// remove our inline stying for the scrollbar fudge
			$('body').removeAttr('style');
		}
	};

	$.fn.skyLightbox = function() {
		return this.each(function() {
			var lightbox = new Lightbox($(this));
		});
	};

    return Lightbox;
})(jQuery);
