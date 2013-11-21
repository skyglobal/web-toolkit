/*global jQuery:false */
if (typeof toolkit==='undefined') toolkit={};
toolkit.accordion = (function ($) {
    "use strict";

    function Accordion($element){
        this.$container = $element;
        this.$headings = $element.find('.accordion-heading');

        this.bindEvents();
    }

    Accordion.prototype = {
        bindEvents:function(){
            this.$headings.on("click",this.toggleContent.bind(this));
        },
        toggleContent:function(e){
            e.preventDefault();
            var $heading = $(e.currentTarget);
            var content = $heading.attr('href');
            toolkit.toggle({$elClicked: $heading});
        }
    };

    $.fn.accordion = function() {
        return this.each(function() {
            var accordion = new Accordion($(this));
        });
    };

    return Accordion;
})(jQuery);

if (typeof window.define === "function" && window.define.amd) {
    define('modules/accordion', [], function() {
        return toolkit.accordion;
    });
}