/*jshint strict: true */
/*global jQuery:false */

if (typeof toolkit==='undefined') toolkit={};
toolkit.form = (function ($) {

    "use strict";

    $('.form-submit').click(function(event) {

        var hasError = false,
            errors = [];


        $('#feedback-list-container').remove();

        $('input.required').each(function (index, input) {
            var inputId    = $(input).attr('id'),
                $descriptor = $('label.descriptor[for=' + inputId + ']'),
                $feedbacks = $('label.feedback[for=' + inputId + ']');

            // exit gracefully if we can't find a required form field
//            if (!$descriptor.length || !$feedbacks.length) {
//                return;
//            }

            if ($(input).val() === '') {
                hasError = true;
                $(input).addClass('form-error');
                $descriptor.addClass('form-error');
                $feedbacks.removeClass('hidden');
                errors.push($feedbacks.first());

            } else {
                $(input).removeClass('form-error');
                $descriptor.removeClass('form-error');
                $feedbacks.addClass('hidden');
            }
        });

        // turn error message on if there has been an error
        if (hasError) {
            event.preventDefault();

            var errorHtml = '<div id="feedback-list-container" class="row"><p><span class="form-error skycon-warning"></span>Please correct the highlighted fields below before submitting again.</p>',
                label,
                i;

            errorHtml += '<ul class="feedback-list">';

            for (i = 0; i < errors.length; i++) {
                label     = '<label for="' + errors[i].attr("for") + '" class="form-error">' + errors[i].text() + '</label>';
                errorHtml += '<li>' + label + '</li>';
            }

            errorHtml += '</ul></div>';

            $(event.currentTarget).closest('form').prepend(errorHtml);

            // scroll to the top of the forms
            window.location.href = window.location.href.split('#')[0] + '#feedback-list-container';
        }
    });

})(jQuery);

if (typeof window.define === "function" && window.define.amd) {
    define('modules/form', [], function() {
        'use strict';

        return toolkit.form;
    });
}