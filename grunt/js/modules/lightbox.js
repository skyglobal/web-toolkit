/*global jQuery:false */
if (typeof toolkit==='undefined') toolkit={};
toolkit.lightbox = (function ($) {
    "use strict";

    console.info("Fo' shizzle my nizzle, da lightbox is here!");

	function Lightbox($element){
		this.$container = $element;
		this.$closeIcon = $element.find('.lightbox-close');
		this.bindEvents();
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

		open: function(e) {
			e.preventDefault();
			this.$originator = $(e.target);
			this.$container.addClass('lightbox-open');
			$('body').addClass('lightbox-active');
			this.$closeIcon[0].focus();
			if (this.$originator.hasClass('skycom-focus')) {
				this.$closeIcon.addClass('skycom-focus');
			}
		},

		close: function(e) {
			e.preventDefault();
			this.$container.removeClass('lightbox-open');
			$('body').removeClass('lightbox-active');
			this.$originator.focus();
		}
	};

	$.fn.skyLightbox = function() {
		return this.each(function() {
			var lightbox = new Lightbox($(this));
		});
	};

    return Lightbox;
})(jQuery);
