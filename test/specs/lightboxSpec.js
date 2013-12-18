function lightboxSpec(focus, lb){


        var $demo = $('#lightbox-demo-source').clone();
        var $links = $('#open-links-source').clone();
        $demo.attr('id','lightbox-demo');
        $links.attr('id','open-links');

        describe('Lightbox module', function() {

            beforeEach(function() {
                $('body').append($demo);
                $('body').append($links);
                $links.find('.lightbox-demo-link').removeAttr('tabindex');
                $links.find('.link-with-tab-index').attr('tabindex','101');
                $('#lightbox-demo').lightbox();
            });
            afterEach(function() {
                $('#lightbox-demo').remove();
                $('#open-links').remove();
                $('body').removeAttr('style');
            });

            var givenTheLargeLightBoxIsOpen = function() {
                $('#open-links .lightbox-demo-link').click();
                expect($('#lightbox-demo').hasClass('lightbox-open')).to.equal(true);
            };


            it('Displays a lightbox when a user clicks a text link', function() {
                // given
                expect($('#lightbox-demo').hasClass('lightbox-open')).to.equal(false);
                // when
                $('#open-links .lightbox-demo-link').click();
                // then
                expect($('#lightbox-demo').hasClass('lightbox-open')).to.equal(true);
            });


            it('Closes when the close icon is clicked', function(done) {
                givenTheLargeLightBoxIsOpen();
                // when
                $('#lightbox-demo .lightbox-close').click();
                // then
                setTimeout(function(){
                    expect($('#lightbox-demo').hasClass('lightbox-open')).to.equal(false);
                    done();
                },501);

            });


            it('Closes when the faded grey bit is clicked', function(done) {
                givenTheLargeLightBoxIsOpen();
                // when
                $('#lightbox-demo').click();
                // then
                setTimeout(function(){
                    expect($('#lightbox-demo').hasClass('lightbox-open')).to.equal(false);
                    done();
                },501);
            });


            it('Does NOT close when the lightbox itself is clicked', function() {
                givenTheLargeLightBoxIsOpen();
                // when
                $('#lightbox-demo .lightbox-content').click();
                // then
                expect($('#lightbox-demo').hasClass('lightbox-open')).to.equal(true);
            });


            it('Hides the double scrollbar from the body element', function(done) {
                givenTheLargeLightBoxIsOpen();
                // then
                expect($('body').is('[style]')).to.equal(true);
                expect($('body').css('overflow')).to.equal('hidden');
                // when
                $('#lightbox-demo .lightbox-close').click();
                // then
                setTimeout(function(){
                    expect($('body').is('[style]')).to.equal(false);
                    done();
                },501);
            });


            context('Focus Behaviour', function() {

                beforeEach(function() {
                    $('#spec-markup').show();
                });

                afterEach(function() {
                    $('#spec-markup').hide();
                });

                it('Gives focus to the close icon when opened', function() {
                    givenTheLargeLightBoxIsOpen();
                    // then
                    expect(document.activeElement.id).to.equal('close-button');
                });

                it('Returns focus back to the ORIGINATOR when closed', function(done) {
                    // given
                    givenTheLargeLightBoxIsOpen();
                    // when
                    $('#lightbox-demo .lightbox-close').click();
                    // then
                    setTimeout(function(){
                        expect(document.activeElement.className).to.equal('lightbox-demo-link');
                        done();
                    },501);
                });

                it("Sets the 'skycom-focus' class on the close icon if the ORIGINATOR had the 'focus' class.", function() {
                    // given
                    expect($('#lightbox-demo .lightbox-close').hasClass(focus.className)).to.equal(false);
                    $('#open-links .lightbox-demo-link').addClass(focus.className);
                    givenTheLargeLightBoxIsOpen();
                    // then
                    expect($('#lightbox-demo .lightbox-close').hasClass(focus.className)).to.equal(true);
                });

//				it('Constrains the tab focus to the lightbox', function() {
//					givenTheLargeLightBoxIsOpen();
//                    expect(document.activeElement.id).to.equal('close-button');
//
//					// then
//					$.tabNext();
//					expect(document.activeElement.id).to.equal('lightboxInput');
//					$.tabNext();	// tab to link
//					$.tabNext();	// tab to link
//					$.tabNext();	// tab should loop back to close icon
//                    expect(document.activeElement.id).to.equal('close-button');
//				});
                it('disables tabbing of page elements', function(done) {
                    expect($('#open-links .lightbox-demo-link').attr('tabindex')).to.equal(undefined);
                    expect($('#open-links .link-with-tab-index').attr('tabindex')).to.equal('101');
                    givenTheLargeLightBoxIsOpen();
                    expect($('#open-links .lightbox-demo-link').attr('tabindex')).to.equal('-1');
                    expect($('#open-links .link-with-tab-index').attr('tabindex')).to.equal('-1');
                    $('#lightbox-demo .lightbox-close').click();
                    setTimeout(function(){
                        expect($('#open-links .lightbox-demo-link').attr('tabindex')).to.equal(undefined);
                        expect($('#open-links .link-with-tab-index').attr('tabindex')).to.equal('101');
                        done();
                    },501);
                });
            });
        });
        mocha.run();

}

if (window.define) {
    define('specs/lightboxSpec', ['utils/focus','components/lightbox'], function (focus, lb) {
        return lightboxSpec(focus, lb);
    })
}
