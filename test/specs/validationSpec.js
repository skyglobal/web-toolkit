function validationSpec(validation) {

    var describeSpec = 'Validation module';

    function isSafari() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') != -1) {
            return (ua.indexOf('chrome') === -1);
        }
        return false;
    }

    describe(describeSpec, function () {

        beforeEach(function () {
            $('#input-one').val('');
            $('#input-two').val('');
            $('#input-three').val('');
            $('input.required').removeClass('form-error');
            $('.feedback').addClass('hidden');
            $('#feedback-list-container').remove();
        });
        /*
         //    TEST WILL ONLY RUN IN A BROWSER THAT DOES NOT SUPPORT THE REQUIRED ATTRIBUTE
         //    Try IE9 or IE8 or Safari

         if (!('required' in document.createElement('input')) || isSafari()) {

         it('should display error message if a user does not fill in a mandatory input', function () {
         expect($("#input-one").hasClass("form-error")).to.equal(false);
         expect($("#input-one-feedback").first().hasClass("hidden")).to.equal(true);
         expect($(".feedback-list li").length).to.equal(0);

         $('.form-submit').click();

         expect($("#input-one").hasClass("form-error")).to.equal(true);
         expect($("#input-one-feedback").first().hasClass("hidden")).to.equal(false);
         expect($(".feedback-list li").length).to.equal(2);
         expect($(".feedback-list li").first().text()).to.equal('Please enter something into the first input');

         $('#input-one').val('something');
         $('.form-submit').click();

         expect($("#input-one").hasClass("form-error")).to.equal(false);
         expect($("#input-one-feedback").first().hasClass("hidden")).to.equal(true);
         expect($(".feedback-list li").length).to.equal(1);
         expect($(".feedback-list li").first().text()).to.not.equal('Please enter something into the first input');
         });

         it('should not display an error message if a user does not fill in a non mandatory input', function () {
         expect($("#input-two").hasClass("form-error")).to.equal(false);
         expect($("#input-two-feedback").hasClass("hidden")).to.equal(true);
         expect($(".feedback-list li").length).to.equal(0);

         $('.form-submit').click();

         expect($("#input-two").hasClass("form-error")).to.equal(false);
         expect($("#input-two-feedback").hasClass("hidden")).to.equal(true);
         expect($(".feedback-list li").length).to.equal(2);
         expect($(".feedback-list li").eq(1).text()).to.not.equal('Please enter something into the second input');
         });

         it('should display a generic error message if no feedback label is provided', function () {
         expect($("#input-two").hasClass("form-error")).to.equal(false);
         expect($("#input-two-feedback").hasClass("hidden")).to.equal(true);
         expect($(".feedback-list li").length).to.equal(0);

         $('.form-submit').click();

         expect($("#input-two").hasClass("form-error")).to.equal(false);
         expect($("#input-two-feedback").hasClass("hidden")).to.equal(true);
         expect($(".feedback-list li").length).to.equal(2);
         expect($(".feedback-list li").eq(1).text()).to.equal('Mandatory Input with no Feedback is required');
         });
         }

         */
    });

    return describeSpec;
}

if (window.define) {
    define('specs/validationSpec', ['utils/validation'], function (validation) {
            return validationSpec(validation);
        });
}