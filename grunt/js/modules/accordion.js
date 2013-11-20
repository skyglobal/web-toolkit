/*jshint strict: true */
/*global jQuery:false */
if (typeof toolkit==='undefined') toolkit={};
toolkit.accordion = (function ($) {
    'use strict';

    $(".accordion").on("click", ".accordion-heading", function (event) {
        event.preventDefault();

        var $currentAccordionContent,
            $accordionHeading;

        if ($(event.target).hasClass('icon')) {
            $currentAccordionContent = $($(event.target).closest('.accordion-heading').attr('href'));
            $accordionHeading = $(event.target).closest('.accordion-heading');
        } else {
            $currentAccordionContent = $($(event.target).attr('href'));
            $accordionHeading = $(event.target);
        }

        if ($currentAccordionContent.hasClass('open')) {
            $accordionHeading.removeClass('open');
            $currentAccordionContent.removeClass('open');

            setTimeout(function() {
                // guard against rapid clicks that re-open the accordion
                if ($currentAccordionContent.hasClass('accordion-visible') && !$currentAccordionContent.hasClass('open')) {
                    $currentAccordionContent.removeClass('accordion-visible');
                    $currentAccordionContent.addClass('accordion-invisible');
                }
            }, 500);
        } else {
            //add open class to accordion_content that corresponds to this
            $accordionHeading.addClass('open');
            $currentAccordionContent.addClass('open');

            $currentAccordionContent.addClass('accordion-visible');
            $currentAccordionContent.removeClass('accordion-invisible');
        }
    });
})(jQuery);
if (typeof window.define === "function" && window.define.amd) {
    define('modules/accordion', [], function() {
        'use strict';

        return toolkit.accordion;
    });
}