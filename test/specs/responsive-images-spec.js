function responsiveImagesSpec(responsiveImages, event) {

    var describeSpec = 'Responsive Images';

    if (!event){//needed for running test in demo page
        event = skyComponents.event;
    }

    var fixtures = {
        'demo-responsive-images': document.getElementById('demo-responsive-images').outerHTML
    };

    addScript('utils','responsive-images','using');

    describe(describeSpec, function () {

        var origMatchMedia;

        before(function() {
            var container = document.getElementById('demo-responsive-images');
            toolkit.responsiveImages.init(container);
            if (!window.PHANTOMJS) {
                origMatchMedia = window.matchMedia;
            }
        });

        after(function() {
            if (window.PHANTOMJS) {
                console.log(JSON.stringify({
                    action: 'viewportSize',
                    width: '960',
                    height: '960'
                }));
            } else {
                window.matchMedia = origMatchMedia;
            }
        });

        it('shows a desktop image in desktop view', function () {
            // a test for PhantomJS where width can be specified through a special console log listener that PhantomJS has
            if (window.PHANTOMJS) {
                console.log(JSON.stringify({
                    action: 'viewportSize',
                    width: '960',
                    height: '960'
                }));
                event.emit(window, 'resizeend');
                if (!window.blanket) {
                    expect($('#demo-responsive-images').find('img').attr('src')).to.contain('beckham.jpg');
                }
            }
        });

        it('shows a mobile image in mobile view', function () {
            // a test for PhantomJS where width can be specified through a special console log listener that PhantomJS has
            if (window.PHANTOMJS) {
                console.log(JSON.stringify({
                    action: 'viewportSize',
                    width: '480',
                    height: '960'
                }));
                event.emit(window, 'resizeend');
                if (!window.blanket) {
                    expect($('#demo-responsive-images').find('img').attr('src')).to.contain('davinci-mobile.jpg');
                }
            }
        });

        it('shows a desktop image in desktop view and then changes to mobile on resize if the media query matches', function () {
            // a test for actual browsers where width needs to be mocked through modifying the matchMedia function
            if (!window.PHANTOMJS) {
                window.matchMedia = function() { return { matches: false }; };
                event.emit(window, 'resizeend');
                expect($('#demo-responsive-images').find('img').attr('src')).to.contain('beckham.jpg');
                window.matchMedia = function() { return { matches: true }; };
                event.emit(window, 'resizeend');
                expect($('#demo-responsive-images').find('img').attr('src')).to.contain('davinci-mobile.jpg');
            }
        });

    });

    return describeSpec;
}

if (window.define) {
    define('specs/responsive-images-spec', ['utils/responsive-images','bower_components/bskyb-core/dist/scripts/core.requirejs'], function (responsiveImages, core) {
        return responsiveImagesSpec(responsiveImages, core.event);
    });
}
