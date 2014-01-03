function accordionSpec() {

    var describeSpec = 'Accordion module';

    describe(describeSpec, function () {

        it('Accordion content should be closed by default', function () {
            expect($('.view-container.toggle-hidden').length).to.equal(3);
        });

        it('Accordion content should open and close when a user clicks an accordion item twice', function () {
            var $first = $('.view-container').first();
            var $firstLink = $('.accordion-heading').first();
            var $last = $('.view-container').last();
            var $lastLink = $('.accordion-heading').last();
            expect($first.hasClass('toggle-hidden')).to.equal(true);
            expect($first.parent().find('> a i').hasClass('rotate-180')).to.equal(false);
            $firstLink.click();
            expect($first.hasClass('toggle-hidden')).to.equal(false);
            expect($first.parent().find('> a i').hasClass('rotate-180')).to.equal(true);
            expect($last.hasClass('toggle-hidden')).to.equal(true);
            $lastLink.click();
            expect($last.hasClass('toggle-hidden')).to.equal(false);
            expect($first.parent().find('> a i').hasClass('rotate-180')).to.equal(true);
            $firstLink.click();
            expect($first.hasClass('toggle-hidden')).to.equal(true);
            expect($first.parent().find('> a i').hasClass('rotate-180')).to.equal(false);
            expect($last.hasClass('toggle-hidden')).to.equal(false);
        });
    });

    return describeSpec;

}

if (window.define) {
    define('specs/accordionSpec', ['components/accordion'], function () {
        return accordionSpec();
    });
}
