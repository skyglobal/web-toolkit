function carouselSpec() {

    var describeSpec = 'Carousel module';

    globalskycom = {
        browserSupport:{
            isMobile:function () {
                return false;
            },
            orientationchange: function(){
                // noop
            },
            viewchange: function(){
                // noop
            }
        }
    };

    var fixtures = {
        hero: document.getElementById('hero').outerHTML,
        'empty-hero': document.getElementById('empty-hero').outerHTML,
        'hero-skinny': document.getElementById('hero-skinny').outerHTML
    };
    addScript('components','carousel','default');
    addScript('components','carousel','single-slide');
    addScript('components','carousel','skinny');

    describe(describeSpec, function () {

        beforeEach(function() {
            $('#hero-skinny').trigger('goto', 0);
        });

        var checkActiveSlide = function (expectedSlide) {
            var $activeSlide = $('#hero').find('.skycom-carousel-container > .active');
            expect($activeSlide.index()).to.equal(expectedSlide);
        };

        var checkActiveSlideAfterAction = function (action, startExpectedSlide, endExpectedSlide, time, done) {
            setTimeout(function () {
                checkActiveSlide(startExpectedSlide);
                action();
                setTimeout(function () {
                    checkActiveSlide(endExpectedSlide);
                    if (done) done();
                }, 50);
            }, time);
        };

        it('carousel is never ending', function (done) {
            $('#hero').find('.indicators .container span').eq(2).click();
            $('#hero').children('.actions').find('a.next').click();

            checkActiveSlideAfterAction(function () {
                $('#hero').find('.indicators .container span').eq(0).click();
                $('#hero').children('.actions').find('a.previous').click();
            }, 0, 2, 100, done);
        });


        describe('will be created correctly when initialised', function () {

            it('with indicators, previous, next, play and pause controls', function () {
                expect($('#hero').find('.indicators span').length).to.equal(3);
                expect($('#hero').children('.actions').find('a.previous').length).to.equal(1);
                expect($('#hero').children('.actions').find('a.next').length).to.equal(1);
                expect($('#hero').children('.actions').find('a.play').length).to.equal(1);
                expect($('#hero').children('.actions').find('a.pause').length).to.equal(1);
            });

            it('with no controls if there is only one slide', function (done) {
                expect($('#empty-hero').children('.indicators span').length).to.equal(0);
                expect($('#empty-hero').children('.actions').find('a.previous').length).to.equal(0);
                expect($('#empty-hero').children('.actions').find('a.next').length).to.equal(0);
                expect($('#empty-hero').children('.actions').find('a.play').length).to.equal(0);
                expect($('#empty-hero').children('.actions').find('a.pause').length).to.equal(0);
                setTimeout(function () {
                    expect($('#empty-hero .skycom-carousel-container.animate').length).to.equal(0);
                    expect($('#empty-hero .skycom-carousel-container')[0].style.cssText).to.equal("");
                    done();
                }, 110);
            });

            it('without a \'show terms\' link if its not needed', function () {
                $('#hero-skinny').trigger('goto', 0);
                expect($('#hero-skinny').children('.terms-link:visible').length).to.equal(0);
                expect($('#hero-skinny').next('.terms-content:visible').length).to.equal(0);
            });

            it('with a \'show terms\' link if its needed', function () {
                $('#hero').trigger('goto', 0);
                expect($('#hero').children('.terms-link').length).to.equal(1);
                expect($('#hero').next('.terms-content').length).to.equal(1);
                expect($('#hero').next('.terms-content').text()).to.equal('');
                $('#hero').children('.terms-link').click();
                expect($('#hero').next('.terms-content').text().trim()).to.equal('These are some terms and conditions');
            });

            describe('and all controls work, ', function(){

                it('play and pause triggers work', function () {
                    $('#hero').trigger('play');
                    expect($('#hero.skycom-carousel.paused').length).to.equal(0);
                    $('#hero').trigger('pause');
                    expect($('#hero.skycom-carousel.paused').length).to.equal(1);
                });

                it('play and pause buttons work', function () {
                    $('#hero').children('.actions').find('a.play').click();
                    expect($('#hero.paused').length).to.equal(0);
                    $('#hero').children('.actions').find('a.pause').click();
                    expect($('#hero.paused').length).to.equal(1);
                });

                it('indicator controls wont change the slide when clicking the active slide indicator', function (done) {
                    $('#hero').trigger('goto', 0);
                    setTimeout(function() {
                        var $activeSlide;
                        $activeSlide = $('#hero').find('.skycom-carousel-container > .active');
                        expect($activeSlide.index()).to.equal(0);
                        $('#hero').find('.indicators .container span').eq(0).click();
                        setTimeout(function () {
                            $activeSlide = $('#hero').find('.skycom-carousel-container > .active');
                            expect($activeSlide.index()).to.equal(0);
                            done();
                        }, 100);
                    }, 100);
                });

                it('indicator controls change slide', function (done) {
                    $('#hero').trigger('goto', 0);
                    setTimeout(function() {
                        var $activeSlide;
                        $activeSlide = $('#hero').find('.skycom-carousel-container > .active');
                        expect($activeSlide.index()).to.equal(0);
                        $('#hero').find('.indicators .container span').eq(2).click();
                        setTimeout(function () {
                            $activeSlide = $('#hero').find('.skycom-carousel-container > .active');
                            expect($activeSlide.index()).to.equal(2);
                            done();
                        }, 100);
                    }, 100);
                });

                it('clicking the image will go to the headline link', function(done){
                    $('#hero').trigger('goto', 2);
                    location.hash = '';
                    setTimeout(function() {
                        $('#hero').find('.skycom-carousel-container > .active .shade').click();
                        expect(location.hash).to.equal('#!avengers1');
                        done();
                    },100);
                });

                it('hovering anywhere on the slide will underline the title and tagline', function () {
                    var $slide  = $('#hero').find('.skycom-carousel-container > .active');
                    var $link = $slide.find('figcaption a');
                    $slide.trigger('mouseenter');
                    expect($link.hasClass('hover')).to.be.true;
                    $slide.trigger('mouseleave')
                    expect($link.hasClass('hover')).to.be.false;
                });
            });
        });


        describe('is accessible because', function () {

            it('only the first slide can be tabbed', function (done) {
                $('#hero').find('.indicators span').eq(0).click();
                setTimeout(function () {
                    var $activeSlide = $('#hero').find('.skycom-carousel-container > .active'),
                        $otherSlides = $('#hero').find('.skycom-carousel-container > :not(.active)');

                    expect($activeSlide.index()).to.equal(0);
                    expect($activeSlide.find('a').length).to.equal(2);
                    expect($otherSlides.find('a').length).to.equal(3);
                    expect($activeSlide.find('a[tabindex=-1]').length).to.equal(0);
                    expect($otherSlides.find('a[tabindex=-1]').length).to.equal(3);
                    done();
                }, 100);

            });

            it('after pressing next, only the active slide can be tabbed', function (done) {
                $('#hero').find('.indicators span').eq(0).click();
                $('#hero').children('.actions').find('a.next').click();
                setTimeout(function () {

                    var $activeSlide = $('#hero').find('.skycom-carousel-container > .active'),
                        $otherSlides = $('#hero').find('.skycom-carousel-container > :not(.active)');

                    expect($activeSlide.index()).to.equal(1);
                    expect($activeSlide.find('a').length).to.equal(2);
                    expect($otherSlides.find('a').length).to.equal(3);
                    expect($activeSlide.find('a[tabindex=-1]').length).to.equal(0);
                    expect($otherSlides.find('a[tabindex=-1]').length).to.equal(3);
                    done();
                }, 100);

            });

            it('after pressing previous, only the active slide can be tabbed', function (done) {
                $('#hero').find('.indicators span').eq(0).click();
                $('#hero').children('.actions').find('a.previous').click();
                setTimeout(function () {

                    var $activeSlide = $('#hero').find('.skycom-carousel-container > .active'),
                        $otherSlides = $('#hero').find('.skycom-carousel-container > :not(.active)');

                    expect($activeSlide.index()).to.equal(2);
                    expect($activeSlide.find('a').length).to.equal(1);
                    expect($otherSlides.find('a').length).to.equal(4);
                    expect($activeSlide.find('a[tabindex=-1]').length).to.equal(0);
                    expect($otherSlides.find('a[tabindex=-1]').length).to.equal(4);
                    done();
                }, 100);
            });

        });

        describe('can handle having slides changed on the fly', function () {

            it('re-renders markup and behaves correctly when slide is added to carousel', function () {
                $('#hero').trigger('play');
                $('#hero .skycom-carousel-container > div').first().clone().appendTo('#hero .skycom-carousel-container');
                expect($('#hero .indicators span').length).to.equal(3);
                expect($('#hero.skycom-carousel.paused').length).to.equal(0);
                $('#hero').trigger('refresh');
                expect($('#hero.skycom-carousel.paused').length).to.equal(0);
                expect($('#hero .indicators span').length).to.equal(4);
            });

            it('defaults to slide zero if refreshing to anything weird', function (done) {
                checkActiveSlideAfterAction(function () {
                    $('#hero').trigger('refresh', 0);
                }, 2, 0, 0);
                checkActiveSlideAfterAction(function () {
                    $('#hero').trigger('refresh', -1);
                }, 0, 0, 100);
                checkActiveSlideAfterAction(function () {
                    $('#hero').trigger('refresh', undefined);
                }, 0, 0, 200);
                checkActiveSlideAfterAction(function () {
                    $('#hero').trigger('refresh', 'hello');
                }, 0, 0, 300, done);
            });

            it('defaults to slide maximum if index is too big', function (done) {
                checkActiveSlideAfterAction(function () {
                    $('#hero').trigger('refresh', 666);
                }, 0, 3, 0, done);
            });

            it('can refresh onto any slide', function (done) {
                checkActiveSlideAfterAction(function () {
                    $('#hero').trigger('refresh', 1);
                }, 3, 1, 0);
                checkActiveSlideAfterAction(function () {
                    $('#hero').trigger('refresh', 3);
                }, 1, 3, 100);
                checkActiveSlideAfterAction(function () {
                    $('#hero').trigger('refresh', 2);
                }, 3, 2, 200);
                checkActiveSlideAfterAction(function () {
                    $('#hero').trigger('refresh', 2);
                }, 2, 2, 300);
                checkActiveSlideAfterAction(function () {
                    $('#hero').trigger('refresh', 0);
                }, 2, 0, 400, done);
            });
        });

    });

    return describeSpec;
}

if (window.define) {
    define('specs/carousel-spec', ['components/carousel'], function () {
        return carouselSpec();
    });
}