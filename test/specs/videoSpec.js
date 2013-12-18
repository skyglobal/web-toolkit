function videoSpec(share){



    require(['components/video'],function(Video){
        var options = {
            token:"8D5B12D4-E1E6-48E8-AF24-F7B13050EE85",
            animationSpeed: 0,
            freewheel:false //disable ads
        };
        $('#spec-markup').show();
        var video = new Video($('.video'), options);
        video.createWrapper();

        describe('Video module', function() {

            it('showCanvas will expand the video container', function(){
                var ratio = $('.video').width() / $('.video').height();
                var $container = $('.video'),
                    $wrapper = $('.video .video-wrapper'),
                    $close = $wrapper.find('.close'),
                    callbackCalled = false;

                video.showCanvas(function() {
                    callbackCalled = true;
                });
                expect($wrapper.attr('class')).to.contain('playing-video');
                expect($wrapper.length).to.equal(1);
                expect($close.attr('class')).to.contain("active");
                expect(callbackCalled).to.be.true;

            });

            it('hideCanvas will collapse the container and hide the video', function(){
                var $container = $('.video'),
                    $wrapper = $('.video .video-wrapper'),
                    $overlay = $('.video .video-overlay'),
                    $close = $wrapper.find('.close'),
                    callbackCalled = false, ratio;
                video.showCanvas(function() {});
                video.hideCanvas();
                expect($close.attr('class')).to.not.include("active");
                expect($overlay.attr('style')).to.contain("display: none;");
                expect($wrapper.attr('class')).to.not.include("playing-video");
            });

            it('stop will stop the video', function(){
                var $container = $('.video'),
                    $wrapper = $('.video .video-wrapper'),
                    $overlay = $('.video .video-overlay'),
                    $close = $wrapper.find('.close'),
                    callbackCalled = false, skyPlayCalled = false, ratio;
                sky =  {
                    html5player: {
                        close: function(blah) {
                            skyPlayCalled = true;
                        }
                    }
                }
                video.stop();
                expect(skyPlayCalled).to.be.true;
                expect($wrapper.length).to.equal(0);
            });

            it('play will start the video', function(done){
                var $container = $('.video'),
                    $wrapper = $('.video .video-wrapper'),
                    $overlay = $('.video .video-overlay'),
                    $close = $wrapper.find('.close'),
                    callbackCalled = false, skyPlayCalled = false;
                sky =  {
                    html5player: {
                        play: function() {
                            skyPlayCalled = true;
                        }
                    }
                }
                $.fn.sky_html5player = function(blah) {};
                Video.prototype.showCanvas = function(callback) { callback(); callbackCalled = true}
                video.play();
                expect(callbackCalled).to.be.true;
                setTimeout(function() {
                    expect(skyPlayCalled).to.be.true;
                    done();
                },1334)
            });

        });
        mocha.run();
    });
}

if (window.define) {
    define('specs/videoSpec', ['components/video'], function (video) {
        return videoSpec(video);
    })
}
