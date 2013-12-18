function carouselSpec(){

    describe('Carousel module', function() {

        $('#hero').skycom_carousel({carousel: {autoplay:false, onPlayDelay: 0, interval: 0}});
        $('#empty-hero').skycom_carousel({carousel: {autoplay:true, onPlayDelay: 0, interval: 100}});

        it('Creates the controls', function() {
            expect($('.skycom-carousel').children('.indicators').find('.container span').length).to.equal(3);
            expect($('.skycom-carousel').children('.actions').find('a.previous').length).to.equal(1);
            expect($('.skycom-carousel').children('.actions').find('a.next').length).to.equal(1);
            expect($('.skycom-carousel').children('.actions').find('a.play').length).to.equal(1);
            expect($('.skycom-carousel').children('.actions').find('a.pause').length).to.equal(1);
        });

        it('Doesnt create controls if there is only one slide', function(done) {
            expect($('.skycom-empty-carousel').children('.indicators span').length).to.equal(0);
            expect($('.skycom-empty-carousel').children('.actions').find('a.previous').length).to.equal(0);
            expect($('.skycom-empty-carousel').children('.actions').find('a.next').length).to.equal(0);
            expect($('.skycom-empty-carousel').children('.actions').find('a.play').length).to.equal(0);
            expect($('.skycom-empty-carousel').children('.actions').find('a.pause').length).to.equal(0);
            setTimeout(function() {
                expect($('.skycom-empty-carousel .skycom-carousel-container.animate').length).to.equal(0);
                expect($('.skycom-empty-carousel .skycom-carousel-container')[0].style.cssText).to.equal("");
                done();
            }, 110);
        });

        it('Doesnt create terms link if its not needed', function() {
            expect($('.skycom-empty-carousel').children('.terms-link').length).to.equal(0);
            expect($('.skycom-empty-carousel').next('.terms-content').length).to.equal(0);
        });

        it('Does create terms link if its needed', function() {
            expect($('.skycom-carousel').children('.terms-link').length).to.equal(1);
            expect($('.skycom-carousel').next('.terms-content').length).to.equal(1);
            expect($('.skycom-carousel').next('.terms-content').text()).to.equal('');
            $('.skycom-carousel').children('.terms-link').click();
            expect($('.skycom-carousel').next('.terms-content').text()).to.equal('These are some terms and conditions');
        });

        it('play and pause triggers work', function(){
            $('#hero').trigger('play');
            expect($('.skycom-carousel.paused').length).to.equal(0);
            $('#hero').trigger('pause');
            expect($('.skycom-carousel.paused').length).to.equal(1);
        });

        it('play and pause buttons work', function(){
            $('.skycom-carousel').children('.actions').find('a.play').click();
            expect($('.skycom-carousel.paused').length).to.equal(0);
            $('.skycom-carousel').children('.actions').find('a.pause').click();
            expect($('.skycom-carousel.paused').length).to.equal(1);
        });

        it('indicator buttons dont do anything if it is the current active tile already', function(done){
            var $activeSlide;
            $activeSlide = $('#hero').find('.skycom-carousel-container > .active')
            expect($activeSlide.index()).to.equal(0);
            $('.skycom-carousel').find('.indicators .container span').eq(0).click();
            $activeSlide = $('#hero').find('.skycom-carousel-container > .active')
            setTimeout(function() {
                expect($activeSlide.index()).to.equal(0);
                done()
            }, 10)
        });
        it('indicator buttons work', function(done){
            var $activeSlide;
            $activeSlide = $('#hero').find('.skycom-carousel-container > .active')
            expect($activeSlide.index()).to.equal(0);
            $('.skycom-carousel').find('.indicators .container span').eq(2).click();
            setTimeout(function() {
                $activeSlide = $('#hero').find('.skycom-carousel-container > .active')
                expect($activeSlide.index()).to.equal(2);
                done()
            }, 100)
        });


        it('only the first slide can be tabbed', function(done){
            $('.skycom-carousel').find('.indicators .container span').eq(0).click();
            setTimeout(function() {
                var $activeSlide = $('#hero').find('.skycom-carousel-container > .active'),
                    $otherSlides = $('#hero').find('.skycom-carousel-container > :not(.active)');

                expect($activeSlide.index()).to.equal(0);
                expect($activeSlide.find('a').length).to.equal(1);
                expect($otherSlides.find('a').length).to.equal(2);
                expect($otherSlides.find('a[tabindex=-1]').length).to.equal(2);
                done();
            }, 100);

        });

        it('after pressing next, only the active slide can be tabbed', function(done){
            $('.skycom-carousel').children('.actions').find('a.next').click();
            setTimeout(function() {

                var $activeSlide = $('#hero').find('.skycom-carousel-container > .active'),
                    $otherSlides = $('#hero').find('.skycom-carousel-container > :not(.active)');

                expect($activeSlide.index()).to.equal(1);
                expect($activeSlide.find('a').length).to.equal(1);
                expect($otherSlides.find('a').length).to.equal(2);
                expect($otherSlides.find('a[tabindex=-1]').length).to.equal(2);
                done();
            }, 100);

        });

        it('after pressing previous, only the active slide can be tabbed', function(done){
            $('.skycom-carousel').children('.actions').find('a.previous').click();
            setTimeout(function() {

                var $activeSlide = $('#hero').find('.skycom-carousel-container > .active'),
                    $otherSlides = $('#hero').find('.skycom-carousel-container > :not(.active)');

                expect($activeSlide.index()).to.equal(0);
                expect($activeSlide.find('a').length).to.equal(1);
                expect($otherSlides.find('a').length).to.equal(2);
                expect($otherSlides.find('a[tabindex=-1]').length).to.equal(2);
                done();
            }, 100);
        });

        var checkActiveSlide = function(expectedSlide) {
            var $activeSlide = $('#hero').find('.skycom-carousel-container > .active');
            expect($activeSlide.index()).to.equal(expectedSlide);
        };

        var checkActiveSlideAfterAction = function(action, startExpectedSlide, endExpectedSlide, time, done) {
            setTimeout(function() {
                checkActiveSlide(startExpectedSlide);
                action();
                setTimeout(function() {
                    checkActiveSlide(endExpectedSlide);
                    if (done) done();
                }, 50);
            }, time);
        };

        it('carousel is never ending', function(done){
            $('.skycom-carousel').find('.indicators .container span').eq(2).click();
            $('.skycom-carousel').children('.actions').find('a.next').click();

            checkActiveSlideAfterAction(function() {
                $('.skycom-carousel').find('.indicators .container span').eq(0).click();
                $('.skycom-carousel').children('.actions').find('a.previous').click();
            }, 0, 2, 100, done);
        });

        it('re-renders markup and behaves correctly when slide is added to carousel', function() {
            $('.hero-tile').first().clone().appendTo('.skycom-carousel-container');
            expect($('.indicators .container span').length).to.equal(3);
            $('#hero').trigger('refresh');
            expect($('.indicators .container span').length).to.equal(4);
        });

        it('defaults to slide zero if refreshing to anything weird', function(done) {
            checkActiveSlideAfterAction(function() {$('#hero').trigger('refresh', 0);}, 2, 0, 0);
            checkActiveSlideAfterAction(function() {$('#hero').trigger('refresh', -1);}, 0, 0, 100);
            checkActiveSlideAfterAction(function() {$('#hero').trigger('refresh', undefined);}, 0, 0, 200);
            checkActiveSlideAfterAction(function() {$('#hero').trigger('refresh', 'hello');}, 0, 0, 300, done);
        });

        it('defaults to slide maximum if index is too big', function(done) {
            checkActiveSlideAfterAction(function() {$('#hero').trigger('refresh', 666);}, 0, 3, 0, done);
        });

        it('can refresh onto any slide', function(done) {
            checkActiveSlideAfterAction(function() {$('#hero').trigger('refresh', 1);}, 3, 1, 0);
            checkActiveSlideAfterAction(function() {$('#hero').trigger('refresh', 3);}, 1, 3, 100);
            checkActiveSlideAfterAction(function() {$('#hero').trigger('refresh', 2);}, 3, 2, 200);
            checkActiveSlideAfterAction(function() {$('#hero').trigger('refresh', 2);}, 2, 2, 300);
            checkActiveSlideAfterAction(function() {$('#hero').trigger('refresh', 0);}, 2, 0, 400, done);
        });
    });
    mocha.run();
}

if (window.define) {
    define('specs/carouselSpec', ['components/carousel'], function () {
        return carouselSpec();
    })
}
