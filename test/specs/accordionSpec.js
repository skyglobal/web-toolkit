function accordionSpec() {

    var describeSpec = 'Accordion module should';

    describe(describeSpec, function () {

        var $first = $('.view-container').first();
        var $firstLink = $('.accordion-heading').first();
        var $firstContent = $('#first-accordion-content');
        var $last = $('.view-container').last();
        var $lastLink = $('.accordion-heading').last();

        turnOffAnimation('.view-container');

        function closeAllAccordians(){
            if (!$first.hasClass('toggle-hidden')){
                $firstLink.click();
                expect($first.hasClass('toggle-hidden')).to.equal(true);
            }
            if (!$last.hasClass('toggle-hidden')){
                $lastLink.click();
                expect($last.hasClass('toggle-hidden')).to.equal(true);
            }
        }

        afterEach(function(){
            closeAllAccordians();
        });

        it('be closed by default', function () {
            expect($('.view-container.toggle-hidden').length).to.equal(3);
        });

        it('open when clicked', function(){
            expect($first.hasClass('toggle-hidden')).to.equal(true);
            expect($first.parent().find('> a i').hasClass('rotate-180')).to.equal(false);
            $firstLink.click();
            expect($first.hasClass('toggle-hidden')).to.equal(false);
            expect($first.parent().find('> a i').hasClass('rotate-180')).to.equal(true);
            expect($last.hasClass('toggle-hidden')).to.equal(true);
        });

        it('open and close when a user clicks an accordion item twice', function () {
            $firstLink.click();
            expect($first.hasClass('toggle-hidden')).to.equal(false);
            $firstLink.click();
            expect($first.hasClass('toggle-hidden')).to.equal(true);
            expect($first.parent().find('> a i').hasClass('rotate-180')).to.equal(false);
        });

        it('be left open when clicking a different accordion item', function () {
            $firstLink.click();
            $lastLink.click();
            expect($first.hasClass('toggle-hidden')).to.equal(false);
            expect($last.hasClass('toggle-hidden')).to.equal(false);
            expect($last.parent().find('> a i').hasClass('rotate-180')).to.equal(true);
            $lastLink.click();
            expect($first.hasClass('toggle-hidden')).to.equal(false);
            expect($last.hasClass('toggle-hidden')).to.equal(true);
            expect($last.parent().find('> a i').hasClass('rotate-180')).to.equal(false);
        });

        it('open to the height of its content', function () {
            var css =$("<style type='text/css'> #first-accordion-content .accordion-content{ height: 600px; margin:10px 0; padding:8px; border:1px} </style>");
            css.appendTo("head");
            $firstContent.removeData('openHeight');

            $firstLink.click();
            expect($firstContent.height()).to.equal(600 + 20 + 16 + 2);

            css.remove();
        });
    });

    return describeSpec;

}

if (window.define) {
    define('specs/accordionSpec', ['components/accordion'], function () {
        return accordionSpec();
    });
}
