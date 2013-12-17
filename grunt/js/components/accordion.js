/*global jQuery:false */
if (typeof toolkit==='undefined') toolkit={};
toolkit.accordion = (function ($, toggle) {
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
            toolkit.toggle({$elClicked:$heading});
        }
    };

    $.fn.accordion = function() {
        return this.each(function() {
            var accordion = new Accordion($(this));
        });
    };

    return Accordion;
})(jQuery, toolkit.toggle);

if (typeof window.define === "function" && window.define.amd) {
    define('components/accordion', ['utils/toggle'], function(toggle) {
        return toolkit.accordion;
    });
}
