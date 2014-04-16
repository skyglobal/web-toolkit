function accordionSpec() {

    var describeSpec = 'Accordion module should';

    var fixtures = {
        accordion: document.getElementsByClassName('accordion')[0].outerHTML
    };
    addScript('components','accordion','default');

    describe(describeSpec, function () {

        var $first = $('.view-container').first();
        var $firstLink = $('.accordion-heading').first();
        var $firstContent = $('#first-accordion-content');
        var $last = $('.view-container').last();
        var $lastLink = $('.accordion-heading').last();
        var $lastContent = $('#fourth-accordion-content');

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

        before(function(){
            turnOffAnimation('.view-container');
        });
        after(function(){
            turnOffAnimation(false);
        });

        afterEach(function(){
            closeAllAccordians();
        });

        it('be closed by default', function () {
            expect($('.view-container.toggle-hidden').length).to.equal(4);
//            screenshot('accordion', 'default', $first.closest('.sub-section'));
        });

        it('open when clicked', function(done){
            expect($first.hasClass('toggle-hidden')).to.equal(true);
            expect($first.parent().find('> a i').hasClass('rotate-180')).to.equal(false);
            $firstLink.click();
            expect($first.hasClass('toggle-hidden')).to.equal(false);
            expect($first.parent().find('> a i').hasClass('rotate-180')).to.equal(true);
            expect($last.hasClass('toggle-hidden')).to.equal(true);
            setTimeout(function() {
//                screenshot('accordion', 'open', $first.closest('.sub-section'));
                done();
            }, 1000);
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

        it('allow images inside of the content area and display these without cropping', function(done){
            $lastLink.click();
            setTimeout(function(){
                expect($('#fourth-accordion-content').height()).to.equal(20 + 340 + 16 + 2);
                done();
            }, 1000);
        })

        it('open to the height of its content', function (done) {
            var css =$("<style type='text/css'> #first-accordion-content .accordion-content{ height: 600px; margin:10px 0; padding:8px; border:1px} </style>");
            css.appendTo("head");
            $firstContent.removeData('openHeight');

            $firstLink.click();
            setTimeout(function(){
                expect($firstContent.height()).to.equal(600 + 20 + 16 + 2);
                css.remove();
                $firstContent.removeData('openHeight');
                done();
            },250);
        });
        it('close to the height of zero', function (done) {
            var css =$("<style type='text/css'> #first-accordion-content .accordion-content{ height: 600px; margin:10px 0; padding:8px; border:1px} </style>");
            css.appendTo("head");
            $firstContent.removeData('openHeight');

            $firstLink.click();
            setTimeout(function(){
                $firstLink.click();
                setTimeout(function(){
                    expect($firstContent.height()).to.equal(0);
                    css.remove();
                    $firstContent.removeData('openHeight');
                    done();
                },250);
            },25);
        });
    });

    return describeSpec;

}

if (window.define) {
    define('specs/accordion-spec', ['components/accordion'], function () {
        return accordionSpec();
    });
}
