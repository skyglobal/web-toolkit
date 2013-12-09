require(['modules/accordion'],function(){

    describe('Accordion module', function() {

        it('Accordion content should be closed by default', function() {
            expect($('.view-container.toggle-hidden').length).to.equal(3);
        });

        it('Accordion content should open and close when a user clicks an accordion item twice', function() {
            expect($('.view-container').first().hasClass('toggle-hidden')).to.equal(true);
            $('.accordion-heading').first().click();
            expect($('.view-container').first().hasClass('toggle-hidden')).to.equal(false);
            $('.accordion-heading').last().click();
            expect($('.view-container').last().hasClass('toggle-hidden')).to.equal(false);
            $('.accordion-heading').first().click();
            expect($('.view-container').first().hasClass('toggle-hidden')).to.equal(true);
            expect($('.view-container').last().hasClass('toggle-hidden')).to.equal(false);
        });
    });
    mocha.run();
});