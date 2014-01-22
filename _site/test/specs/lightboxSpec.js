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

    $("<style type='text/css'> body .lightbox{ -webkit-animation-duration: 0s!important;animation-duration:0!important;} </style>").appendTo("head");

    describe(describeSpec, function () {

        afterEach(function (done) {
            close(done);
        });

        function openLightboxWithHash(){
            hash.change($('#lightbox-demo-link').attr('href').replace('#','').replace('!',''));
        }

        function openLightboxWithClick(){
            $('#lightbox-demo-link').click();
        }
        function openCallbacksLightboxWithClick(){
            $('#lightbox-demo-link-with-callbacks').click();
        }

        function close(done) {
            $('#lightbox-demo, #lightbox-ajax-demo, #lightbox-small-demo, #lightbox-demo-with-callbacks').closest('.lightbox').click();
            setTimeout(function () {
                done();
            }, 500);
        }

        it('will be displayed when a user clicks a lightbox link', function () {
            // given
            expect($('#lightbox-demo').closest('.lightbox').hasClass('lightbox-open')).to.equal(false);

            // when
            openLightboxWithClick();
            // then
            expect($('#lightbox-demo').closest('.lightbox').attr('class') ).to.contain('lightbox-open');
            expect($('#lightbox-demo').closest('.lightbox > .skycom-container > *').attr('class')).to.contain('skycom-10');
            expect($('#lightbox-demo').closest('.lightbox > .skycom-container > *').attr('class')).to.contain('skycom-offset1');
        });

        it('will be displayed when a user loads a page with lightbox id in it', function (done) {
            // given
            expect($('#lightbox-demo').closest('.lightbox').hasClass('lightbox-open')).to.equal(false);
            // when
            openLightboxWithHash();
            // then
            setTimeout(function(){
                expect($('#lightbox-demo').closest('.lightbox').attr('class')).to.contain('lightbox-open');
                expect($('#lightbox-demo').closest('.lightbox > .skycom-container > *').attr('class')).to.contain('skycom-10');
                expect($('#lightbox-demo').closest('.lightbox > .skycom-container > *').attr('class')).to.contain('skycom-offset1');
                done();
            },5);
        });

        it('can be small', function (done) {
            // given
            expect($('#lightbox-demo').closest('.lightbox').hasClass('lightbox-open')).to.equal(false);
            // when
            hash.change($('#lightbox-small-demo-link').attr('href').replace('#','').replace('!',''));
            // then
            setTimeout(function(){
                expect($('#lightbox-small-demo').closest('.lightbox').attr('class') ).to.contain('lightbox-open');
                expect($('#lightbox-small-demo').closest('.lightbox > .skycom-container > *').attr('class')).to.contain('skycom-5');
                expect($('#lightbox-small-demo').closest('.lightbox > .skycom-container > *').attr('class')).to.contain('skycom-offset3');
                done();
            },5);
        });

        it('closes when the close icon is clicked', function (done) {
            openLightboxWithClick();
            // when
            $("#lightbox-demo").prev('.lightbox-close').click();
            // then
            setTimeout(function () {
                expect($('#lightbox-demo').closest('.lightbox').hasClass('lightbox-open')).to.equal(false);
                done();
            }, 500);

        });

        it('can specify the colour of the close button', function (done) {
            $(".ajax-lightbox").click();
            setTimeout(function () {
                expect( $("#lightbox-ajax-demo").prev('.lightbox-close').attr('class') ).to.contain('black');
                expect( $("#lightbox-ajax-demo").prev('.lightbox-close').attr('class') ).to.not.contain('white');
                $("#ajax-lightbox-content").closest('.lightbox').click();
                done();
            }, 500);
        });

        it('has a default close button colour of white', function (done) {
            openLightboxWithClick();
            setTimeout(function () {
                expect( $("#lightbox-demo").prev('.lightbox-close').attr('class') ).to.contain('white');
                expect( $("#lightbox-demo").prev('.lightbox-close').attr('class') ).to.not.contain('black');
                $("#lightbox-content").closest('.lightbox').click();
                done();
            }, 500);
        });

        it('closes when the faded background is clicked', function (done) {
            openLightboxWithClick();
            // when
            $('#lightbox-demo').closest('.lightbox').click();
            // then
            setTimeout(function () {
                expect($('#lightbox-demo').closest('.lightbox').hasClass('lightbox-open')).to.equal(false);
                done();
            }, 501);
        });


        it('does NOT close when the lightbox itself is clicked', function () {
            openLightboxWithClick();
            // when
            $('#lightbox-demo.lightbox-content').click();
            // then
            expect($('#lightbox-demo').closest('.lightbox').hasClass('lightbox-open')).to.equal(true);
        });


        it('hides the double scrollbar from the body element', function (done) {
            openLightboxWithClick();
            // then
            expect($('body').is('[style]')).to.equal(true);
            expect($('body').css('overflow')).to.equal('hidden');
            // when
            $("#lightbox-demo").prev('.lightbox-close').click();
            // then
            setTimeout(function () {
                expect($('body').is('[style]')).to.equal(false);
                done();
            }, 501);
        });

        it('executes a given function before the lightbox is shown (onShow)', function (done) {
            var onShowCount = 0;
            var handler = function(){
                onShowCount ++;
                expect(onShowCount).to.equal(1);
                done();
            };
            $('#lightbox-demo-with-callbacks').one('my-lightbox-opened', handler);
            openCallbacksLightboxWithClick();
        });

        it('executes a given function after the lightbox is closes (onClose)', function (done) {
            var onCloseCount = 0;
            var handler = function(){
                onCloseCount ++;
                expect(onCloseCount).to.equal(1);
                done();
            };
            $('#lightbox-demo-with-callbacks').one('my-lightbox-closed', handler);
            openCallbacksLightboxWithClick();
            $("#lightbox-demo-with-callbacks").prev('.lightbox-close').click();
        });


        context('accessibility features', function () {

            it('gives focus to the close icon when opened', function () {
                openLightboxWithClick();
                // then
                expect($(document.activeElement).hasClass('lightbox-close')).to.equal(true);
            });

            it('gives focus back to the lightbox link when closed', function (done) {
                // given
                openLightboxWithClick();
                // when
                $("#lightbox-demo").prev('.lightbox-close').click();
                // then
                setTimeout(function () {
                    expect(document.activeElement.id).to.equal('lightbox-demo-link');
                    done();
                }, 501);
            });

            it("highlights the close button in blue if the lightbox link is highlighted in blue", function () {
                // given
                expect($("#lightbox-demo").prev('.lightbox-close').hasClass(focus.className)).to.equal(false);
                $('#lightbox-demo-link').addClass(focus.className);
                openLightboxWithClick();
                // then
                expect($("#lightbox-demo").prev('.lightbox-close').hasClass(focus.className)).to.equal(true);
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
                $('#lightbox-demo-link').removeAttr('tabindex data-tabindex');
                $('#lightbox-demo-link-with-callbacks').removeAttr('data-tabindex').attr('tabindex','101');
                openLightboxWithClick();
                expect($('#lightbox-demo-link').attr('tabindex')).to.equal('-1');
                expect($('#lightbox-demo-link-with-callbacks').attr('tabindex')).to.equal('-1');
                $("#lightbox-demo").prev('.lightbox-close').click();
                setTimeout(function () {
                    expect($('#lightbox-demo-link').attr('tabindex')).to.equal(undefined);
                    expect($('#lightbox-demo-link-with-callbacks').attr('tabindex')).to.equal('101');
                    done();
                }, 501);
            });
        });

        context("Ajax", function() {

            it("should load content via Ajax when the href doesn't start with a hash", function(done) {
                $(".ajax-lightbox").click();
                setTimeout(function () {
                    expect( $("#lightbox-ajax-demo h1").text() ).to.equal("Ajaxed header");
                    $("#ajax-lightbox-content").closest('.lightbox').click();
                    done();
                }, 500);

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