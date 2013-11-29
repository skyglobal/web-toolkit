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

    var useCustomFormErrors =  (!('required' in document.createElement('input')) || isSafari());

    function Form($form) {
        this.$form = $form;
        this.$requiredInputs = $form.find('input[required]');
        this.errors = [];
        this.hasError = false;

        this.bindEvents();
    }

    Form.prototype = {
        bindEvents: function() {
            var form = this;
            //feature detect the required attribute
            if (useCustomFormErrors) {
                this.$form.submit(function(e) {
                    form.validate(e);
                });
            }
        },

        addErrorMessageToInput: function($input) {
            var inputId     = $input.attr('id'),
                $descriptor = this.$form.find('label.descriptor[for=' + inputId + ']'),
                $feedbacks  = this.$form.find('.feedback[data-for=' + inputId + ']');

            this.hasError = true;

            if ($feedbacks.length > 0) {
                $feedbacks.removeClass('hidden');
            } else {
                //create a feedback if one does not exist
                $feedbacks = $('<span class="form-error feedback" data-for="' + $input.attr('id') + '">' + $descriptor.text() + ' is required</span>').insertAfter($input);
            }

            if (!$input.hasClass('form-error')) {
                $input.addClass('form-error');
                $('<i class="form-error skycon-warning"></i>').insertAfter($input);
            }

            this.errors.push($feedbacks.first());
        },

        removeErrorsFromInput: function($input) {
            var inputId     = $input.attr('id'),
                $feedbacks  = this.$form.find('.feedback[data-for=' + inputId + ']');

            if ($input.hasClass('form-error')) {
                $input.removeClass('form-error');
                $input.next('.skycon-warning').remove();
            }
            $feedbacks.addClass('hidden');
        },

        createErrorsAtTop: function() {
            var errorHtml = '<div id="feedback-list-container" class="row" aria-live="polite"><p><i class="form-error skycon-warning"></i>Please correct the highlighted fields below:</p>',
                label,
                i;

            errorHtml += '<ul class="feedback-list">';

            for (i = 0; i < this.errors.length; i++) {
                errorHtml += '<li class="form-error">' + this.errors[i].text() + '</li>';
            }

            errorHtml += '</ul></div>';

            this.$form.closest('form').prepend(errorHtml);
            // scroll to the top of the forms
            window.location.href = window.location.href.split('#')[0] + '#feedback-list-container';
        },

        resetErrors: function() {
            this.hasError = false;
            this.errors = [];
            this.$form.find('#feedback-list-container').remove();
        },

        validate: function(e) {
            var $form = $(e.currentTarget),
                form = this;

            form.resetErrors();

            this.$requiredInputs.each(function (index, input) {
                var $input = $(input);
                if ($input.val() === '') {
                    form.addErrorMessageToInput($input);
                } else {
                    form.removeErrorsFromInput($input);
                }
            });

            // create list of error messages at the top of the form if there has been any errors
            if (form.hasError) {
                e.preventDefault();
                form.createErrorsAtTop();
            }
        }

    };
    $.fn.form = function() {
        return this.each(function() {
            var form = new Form($(this));
        });
    };

    $('.sky-form').form();

})(jQuery);

if (typeof window.define === "function" && window.define.amd) {
    define('modules/form', [], function() {
        'use strict';
        return toolkit.form;
    });
}