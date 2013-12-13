function lightboxSpec(lightbox, focus, hash) {

    var describeSpec = 'Lightbox';

    if (!focus || !hash){ //needed for running test in demo page
        focus = toolkit.focus;
        hash = toolkit.hashManager;
    }

    var $demo = $('#lightbox-demo-source').clone();
    var $links = $('#open-links-source').clone();
    $demo.attr('id', 'lightbox-demo');
    $links.attr('id', 'open-links');

    $("<style type='text/css'> body .lightbox.lightbox-open{ -webkit-animation-duration: 0s;animation-duration:0;} </style>").appendTo("head");

    function openLightbox(){
        hash.change($('#lightbox-demo-link').attr('href').replace('#','').replace('!',''));
    }

    describe(describeSpec, function () {

        afterEach(function (done) {
            close(done);
        });

        function givenTheLightBoxIsOpen() {
            openLightbox();
            expect($('#lightbox-demo').closest('.lightbox').hasClass('lightbox-open')).to.equal(true);
        }

        function close(done) {

            $('.lightbox-open').click();
            setTimeout(function () {
                done();
            }, 500);
        }

        it('will be displayed when a user clicks a lightbox link', function () {
            // given
            expect($('#lightbox-demo').closest('.lightbox').hasClass('lightbox-open')).to.equal(false);
            // when
            openLightbox();
            // then
            expect($('#lightbox-demo').closest('.lightbox').hasClass('lightbox-open')).to.equal(true);

        });


        it('closes when the close icon is clicked', function (done) {
            givenTheLightBoxIsOpen();
            // when
            $('#lightbox-demo .lightbox-close').click();
            // then
            setTimeout(function () {
                expect($('#lightbox-demo').closest('.lightbox').hasClass('lightbox-open')).to.equal(false);
                done();
            }, 501);

        });


        it('closes when the faded background is clicked', function (done) {
            givenTheLightBoxIsOpen();
            // when
            $('#lightbox-demo').click();
            // then
            setTimeout(function () {
                expect($('#lightbox-demo').closest('.lightbox').hasClass('lightbox-open')).to.equal(false);
                done();
            }, 501);
        });


        it('does NOT close when the lightbox itself is clicked', function () {
            givenTheLightBoxIsOpen();
            // when
            $('#lightbox-demo .lightbox-content').click();
            // then
            expect($('#lightbox-demo').closest('.lightbox').hasClass('lightbox-open')).to.equal(true);
        });


        it('hides the double scrollbar from the body element', function (done) {
            givenTheLightBoxIsOpen();
            // then
            expect($('body').is('[style]')).to.equal(true);
            expect($('body').css('overflow')).to.equal('hidden');
            // when
            $('#lightbox-demo .lightbox-close').click();
            // then
            setTimeout(function () {
                expect($('body').is('[style]')).to.equal(false);
                done();
            }, 501);
        });

        it('automatically pauses carousels on the page', function () {
            //todo
        });
        it('executes a given function before the lightbox is shown (onShow)', function () {
            //todo
        });
        it('executes a given function after the lightbox is closes (onClose)', function () {
            //todo
        });


        context('accessibility features', function () {

            it('gives focus to the close icon when opened', function () {
                givenTheLightBoxIsOpen();
                // then
                expect($(document.activeElement).hasClass('lightbox-close')).to.equal(true);
            });

            it('gives focus back to the lightbox link when closed', function (done) {
                // given
                givenTheLightBoxIsOpen();
                // when
                $('#lightbox-demo .lightbox-close').click();
                // then
                setTimeout(function () {
                    expect(document.activeElement.id).to.equal('lightbox-demo-link');
                    done();
                }, 501);
            });

            it("highlights the close button in blue if the lightbox link is highlighted in blue", function () {
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
            it('disables tabbing of page elements', function (done) {
                expect($('#lightbox-demo-link').attr('tabindex')).to.equal(undefined);
                expect($('#lightbox-demo-tabbable-link').attr('tabindex')).to.equal('101');
                givenTheLightBoxIsOpen();
                expect($('#lightbox-demo-link').attr('tabindex')).to.equal('-1');
                expect($('#lightbox-demo-tabbable-link').attr('tabindex')).to.equal('-1');
                $('#lightbox-demo .lightbox-close').click();
                setTimeout(function () {
                    expect($('#lightbox-demo-link').attr('tabindex')).to.equal(undefined);
                    expect($('#lightbox-demo-tabbable-link').attr('tabindex')).to.equal('101');
                    done();
                }, 501);
            });
        });
    });

    return describeSpec;
}

if (window.define) {
    define('specs/lightboxSpec', ['components/lightbox', 'utils/focus', 'utils/hashManager'],
        function (lightbox, focus, hash) {
            return lightboxSpec(lightbox, focus, hash);
        }
    );
}