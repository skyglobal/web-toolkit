define( 'specs/lightboxSpec',
    ['modules/lightbox', 'utils/focus'],
    function(lightbox, focus){

        var $demo = $('#lightbox-demo-source').clone();
        var $links = $('#open-links-source').clone();
        $demo.attr('id','lightbox-demo');
        $links.attr('id','open-links');

        $("<style type='text/css'> body .lightbox.lightbox-open{ -webkit-animation-duration: 0s;animation-duration:0;} </style>").appendTo("head");

        describe('Lightbox module', function() {

            afterEach(function(done) {
                close(done);
            });

            function givenTheLightBoxIsOpen() {
                $('#lightbox-demo-link').click();
                expect($('#lightbox-demo').hasClass('lightbox-open')).to.equal(true);
            }

            function close(done){

                $('.lightbox-open').click();
                setTimeout(function(){
                    done();
                },500);
            }


            it('Displays a lightbox when a user clicks a text link', function() {
                // given
                expect($('#lightbox-demo').hasClass('lightbox-open')).to.equal(false);
                // when
                $('#lightbox-demo-link').click();
                // then
                expect($('#lightbox-demo').hasClass('lightbox-open')).to.equal(true);

            });


            it('Closes when the close icon is clicked', function(done) {
                givenTheLightBoxIsOpen();
                // when
                $('#lightbox-demo .lightbox-close').click();
                // then
                setTimeout(function(){
                    expect($('#lightbox-demo').hasClass('lightbox-open')).to.equal(false);
                    done();
                },501);

            });


            it('Closes when the faded grey bit is clicked', function(done) {
                givenTheLightBoxIsOpen();
                // when
                $('#lightbox-demo').click();
                // then
                setTimeout(function(){
                    expect($('#lightbox-demo').hasClass('lightbox-open')).to.equal(false);
                    done();
                },501);
            });


            it('Does NOT close when the lightbox itself is clicked', function() {
                givenTheLightBoxIsOpen();
                // when
                $('#lightbox-demo .lightbox-content').click();
                // then
                expect($('#lightbox-demo').hasClass('lightbox-open')).to.equal(true);
            });


            it('Hides the double scrollbar from the body element', function(done) {
                givenTheLightBoxIsOpen();
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

                it('Gives focus to the close icon when opened', function() {
                    givenTheLightBoxIsOpen();
                    // then
                    expect($(document.activeElement).hasClass('lightbox-close')).to.equal(true);
                });

                it('Returns focus back to the ORIGINATOR when closed', function(done) {
                    // given
                    givenTheLightBoxIsOpen();
                    // when
                    $('#lightbox-demo .lightbox-close').click();
                    // then
                    setTimeout(function(){
                        expect(document.activeElement.id).to.equal('lightbox-demo-link');
                        done();
                    },501);
                });

                it("Sets the 'has-focus' class on the close icon if the ORIGINATOR had the 'focus' class.", function() {
                    // given
                    expect($('#lightbox-demo .lightbox-close').hasClass(focus.className)).to.equal(false);
                    $('#lightbox-demo-link').addClass(focus.className);
                    givenTheLightBoxIsOpen();
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
                    expect($('#lightbox-demo-link').attr('tabindex')).to.equal(undefined);
                    expect($('#lightbox-demo-tabbable-link').attr('tabindex')).to.equal('101');
                    givenTheLightBoxIsOpen();
                    expect($('#lightbox-demo-link').attr('tabindex')).to.equal('-1');
                    expect($('#lightbox-demo-tabbable-link').attr('tabindex')).to.equal('-1');
                    $('#lightbox-demo .lightbox-close').click();
                    setTimeout(function(){
                        expect($('#lightbox-demo-link').attr('tabindex')).to.equal(undefined);
                        expect($('#lightbox-demo-tabbable-link').attr('tabindex')).to.equal('101');
                        done();
                    },501);
                });
            });
        });
});