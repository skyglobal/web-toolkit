/*jshint strict: true */
/*global jQuery:false */

if (typeof toolkit==='undefined') toolkit={};
toolkit.form = (function ($) {
    "use strict";

    function isSafari() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari')!=-1){
            return (ua.indexOf('chrome') === -1);
        }
        return false;
    }

    function getValue($el){
        var $radiosWithSameName = null;
        return ($el.is('[type=checkbox]')) ?
            $el.is(':checked') : ($el.is('[type=radio]') ?
            // Cache all radio buttons (in the same form) with the same name as this one
            ($radiosWithSameName = $el.parents('form')
                // **TODO: escape the radio buttons' name before using it in the jQuery selector
                .find('input[name="' + $el.attr('name') + '"]'))
                .filter(':checked')
                .length > 0 : $el.val());
    }

    function InvalidInputHelper(input, options) {
        if (options.emptyText){
            input.setCustomValidity(options.defaultText);
        }

        function changeOrInput() {
            if (input.value === "") {
                if (options.emptyText){
                    input.setCustomValidity(options.emptyText);
                }
            } else {
                input.setCustomValidity("");
            }
        }

        function invalid() {
            if (input.value === "") {
                if (options.emptyText){
                    input.setCustomValidity(options.emptyText);
                }
            } else if (options.invalidText) {
                input.setCustomValidity(options.invalidText);
            }
        }

        input.addEventListener("change", changeOrInput);
        input.addEventListener("input", changeOrInput);
        input.addEventListener("invalid", invalid);
    }

    var useCustomFormErrors =  (!('required' in document.createElement('input')) ||
                                !('pattern' in document.createElement('input')) || isSafari());
    var canCustomerHTML5Message = ('setCustomValidity' in document.createElement('input'));

    function Validation($container) {
        this.$container = $container;
        this.$requiredInputs = $container.find('input[required]');
        this.$patternInputs = $container.find('input[pattern]');
        this.errors = [];
        this.hasError = false;
        this.customiseHTML5Messages();
        this.bindEvents();
    }

    Validation.prototype = {
        bindEvents: function() {
            var validation = this;
            //feature detect the required attribute
            if (useCustomFormErrors) {
                validation.$container.on("submit", function(e) {
                    validation.validate(e);
                });
            }
        },

        customiseHTML5Messages: function(){
            if (!canCustomerHTML5Message) return;
            this.$container.find('.feedback[data-for]').each(function(){
                var el = document.getElementById($(this).attr('data-for'));
                new InvalidInputHelper(el, {invalidText: this.innerText || this.innerHTML});
            });
        },

        addErrorMessageToInput: function($input) {
            var inputId     = $input.attr('id'),
                $descriptor = this.$container.find('label.descriptor[for=' + inputId + ']'),
                $feedbacks  = this.$container.find('.feedback[data-for=' + inputId + ']');

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
                $feedbacks  = this.$container.find('.feedback[data-for=' + inputId + ']');

            if ($input.hasClass('form-error')) {
                $input.removeClass('form-error');
                $input.next('.skycon-warning').remove();
            }
            $feedbacks.addClass('hidden');
        },

        createErrorsAtTop: function() {
            var errorHtml = '<div id="feedback-list-container" class="row" aria-live="polite"><p><i class="form-error skycon-warning"></i>Please correct the highlighted fields below:</p><ul class="feedback-list">',
                i;

            for (i = 0; i < this.errors.length; i++) {
                errorHtml += '<li class="form-error">' + this.errors[i].text() + '</li>';
            }

            errorHtml += '</ul></div>';

            this.$container.prepend(errorHtml);
            // scroll to the top of the forms
            window.location.href = window.location.href.split('#')[0] + '#feedback-list-container';
        },

        resetErrors: function() {
            this.hasError = false;
            this.errors = [];
            this.$container.find('#feedback-list-container').remove();
        },

        validateRequired: function (index, input) {
            var $input = $(input),
                validation = this;
            if ($input.val() === '') {
                validation.addErrorMessageToInput($input);
            } else {
                validation.removeErrorsFromInput($input);
            }
        },

        validatePattern: function (index, input) {
            var $input = $(input),
                validation = this,
                pattern = $input.attr('pattern'),
                re = new RegExp('^(?:' + pattern + ')$'),
                value = getValue($input);
            if (value && !re.test(value)) {
                validation.addErrorMessageToInput($input);
            } else {
                validation.removeErrorsFromInput($input);
            }
        },

        validate: function(e) {
            var validation = this;
            validation.resetErrors();

            this.$requiredInputs.each(this.validateRequired.bind(validation));
            this.$patternInputs.each(this.validatePattern.bind(validation));

            // create list of error messages at the top of the form if there has been any errors
            if (validation.hasError) {
                e.preventDefault();
                validation.createErrorsAtTop();
            }
        }

    };

    $.fn.validation = function() {
        return this.each(function() {
            var validation = new Validation($(this));
        });
    };
    $('.sky-form').validation();

    return Validation;

})(jQuery);

if (typeof window.define === "function" && window.define.amd) {
    define('modules/validation', [], function() {
        'use strict';
        return toolkit.validation;
    });
}