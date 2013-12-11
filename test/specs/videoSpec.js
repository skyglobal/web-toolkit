function videoSpec(Video) {

    var describeSpec = 'Video module';

    var options = {
        token:"8D5B12D4-E1E6-48E8-AF24-F7B13050EE85",
        animationSpeed:0,
        freewheel:false //disable ads
    };

    var video = new Video($('#demo-video'), options),
        $container = $('#demo-video'),
        $wrapper, $overlay, $close,
        skyPlayCalled = false,
        callbackCalled = false;

    video.createWrapper();

    function updateElements() {
        $wrapper = $('#demo-video .video-wrapper');
        $overlay = $('#demo-video .video-overlay');
        $close = $wrapper.find('.close');
    }

    describe(describeSpec, function () {

        beforeEach(function () {
            callbackCalled = false;
            skyPlayCalled = false;
        });

        it('showCanvas will expand the video container', function () {
            expect($container.find('playing-video').length).to.equal(0);
            video.showCanvas(function () {
                callbackCalled = true;
            });
            updateElements();

            expect($container.find('.playing-video').length).to.equal(1);
            expect($wrapper.hasClass('playing-video')).to.equal(true);
            expect($wrapper.length).to.equal(1);
            expect($close.hasClass('active')).to.equal(true);
            expect(callbackCalled).to.equal(true);

        });

        it('hideCanvas will collapse the container and hide the video', function () {
            video.showCanvas(function () {
            });
            updateElements();
            video.hideCanvas();
            expect($close.hasClass('active')).to.equal(false);

            expect($overlay.attr('style')).to.contain("display: none;");
            expect($wrapper.hasClass('playing-video')).to.equal(false);
        });

        it('stop will stop the video', function () {
            window.sky = {
                html5player:{
                    close:function (blah) {
                        skyPlayCalled = true;
                    }
                }
            };
            video.stop();
            updateElements();
            expect(skyPlayCalled).to.equal(true);
            expect($wrapper.length).to.equal(0);
        });

        it('play will start the video', function (done) {
            window.sky = {
                html5player:{
                    play:function () {
                        skyPlayCalled = true;
                    }
                }
            };
            $.fn.sky_html5player = function (blah) {
            };
            Video.prototype.showCanvas = function (callback) {
                callback();
                callbackCalled = true;
            }
            video.play();
            expect(callbackCalled).to.equal(true);
            setTimeout(function () {
                expect(skyPlayCalled).to.equal(true);
                done();
            }, 1334)
        });
    });

    return describeSpec;
}

if (window.define) {
    define('specs/videoSpec', ['modules/video'], function (Video) {
        return videoSpec(Video);
    });
}