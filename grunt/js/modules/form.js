/*jshint strict: true */
/*global jQuery:false */

if (typeof toolkit==='undefined') toolkit={};
toolkit.form = (function ($) {

    "use strict";


    function isSafari() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari')!=-1){
            if(ua.indexOf('chrome')  > -1){
                return false;
            }else{
                return true;
            }
        }
        return false;
    }

    //feature detect the required attribute

    if (!('required' in document.createElement('input')) || isSafari()) {

        $('.sky-form').submit(function(event) {

            var hasError = false,
                errors = [];


            $('#feedback-list-container').remove();

            $('input[required]').each(function (index, input) {
                var inputId     = $(input).attr('id'),
                    $descriptor = $('label.descriptor[for=' + inputId + ']'),
                    $feedbacks  = $('label.feedback[for=' + inputId + ']');

                if ($(input).val() === '') {
                    hasError = true;

                    $descriptor.addClass('form-error');

                    if ($feedbacks.length > 0) {
                        $feedbacks.removeClass('hidden');
                    } else {
                        //create a feedback if one does not exist
                        $feedbacks = $('<label class="form-error feedback" for="' + $(input).attr('id') + '">' + $descriptor.text() + ' is required</label>').insertAfter($(input));
                    }

                    if (!$(input).hasClass('form-error')) {
                        $(input).addClass('form-error');
                        $('<span class="form-error skycon-warning"></span>').insertAfter($(input));
                    }

                    errors.push($feedbacks.first());

                } else {
                    if ($(input).hasClass('form-error')) {
                        $(input).removeClass('form-error');
                        $(input).next('.skycon-warning').remove();
                    }
                    $descriptor.removeClass('form-error');
                    $feedbacks.addClass('hidden');
                }
            });

            // create list of error messages at the top of the form if there has been any errors
            if (hasError) {
                event.preventDefault();

                var errorHtml = '<div id="feedback-list-container" class="row" aria-live="polite"><p><span class="form-error skycon-warning"></span>Please correct the highlighted fields below:</p>',
                    label,
                    i;

                errorHtml += '<ul class="feedback-list">';

                for (i = 0; i < errors.length; i++) {
//                    label     = '<label for="' + errors[i].attr("for") + '" class="form-error">' + errors[i].text() + '</label>';
//                    errorHtml += '<li>' + label + '</li>';
                    errorHtml += '<li class="form-error">' + errors[i].text() + '</li>';
                }

                errorHtml += '</ul></div>';

                $(event.currentTarget).closest('form').prepend(errorHtml);

                // scroll to the top of the forms
                window.location.href = window.location.href.split('#')[0] + '#feedback-list-container';
            }
        });
    }

})(jQuery);

if (typeof window.define === "function" && window.define.amd) {
    define('modules/form', [], function() {
        'use strict';

        return toolkit.form;
    });
}