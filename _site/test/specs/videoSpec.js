function videoSpec(Video) {

    var describeSpec = 'Video module';

    var $container = $('#demo-video'),
        $wrapper, $overlay, $close;

    if (!window.sky){ //needed for grunt test.
        window.sky = { html5player : { close: function(){}, play: function(){}}};
        $.fn.sky_html5player = function(){};
    }

    function updateElements() {
        $wrapper = $('#demo-video .video-wrapper');
        $overlay = $('#demo-video .video-overlay');
        $close = $wrapper.find('.close');
    }

    describe(describeSpec, function () {

        beforeEach(function () {
            $.fx.off = true; //todo: change this for css animation
            updateElements();
        });

        afterEach(function(){
            $('#demo-video .close.active').click();
            $.fx.off = false; //todo: change this for css animation
        });

        it('will play the video when play is clicked', function () {
            expect($wrapper.length).to.equal(0);
            expect($overlay.length).to.equal(0);
            $('#demo-video .play-video ').click();
            updateElements();
            expect($wrapper.hasClass('playing-video')).to.equal(true);
            expect($container.find('.playing-video').length).to.equal(1);
            expect($wrapper.length).to.equal(1);
            expect($overlay.length).to.equal(1);

            expect($close.hasClass('active')).to.equal(true);
        });

        it('will stop + fade out when the close button is clicked', function () {
            expect($container.find('playing-video').length).to.equal(0);
            $('#demo-video .play-video ').click();
            updateElements();
            $('#demo-video .close.active').click();
            updateElements();
            expect($wrapper.length).to.equal(0);
            expect($overlay.length).to.equal(0);
        });

        it('will stop + fade out when the video finishes', function () {
            expect($container.find('playing-video').length).to.equal(0);
            $('#demo-video .play-video ').click();
            updateElements();
            $('video').trigger('ended');
            expect($container.find('playing-video').length).to.equal(0);
        });

    });

    return describeSpec;
}

if (window.define) {
    define('specs/videoSpec', ['components/video'], function (Video) {
        return videoSpec(Video);
    });
}