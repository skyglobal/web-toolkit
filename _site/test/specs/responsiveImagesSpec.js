function responsiveImagesSpec(event) {

    var describeSpec = 'Responsive Images';

    if (!event){//needed for running test in demo page
        event = toolkit.event;
    }

    describe(describeSpec, function () {
        var origMatchMedia;

        before(function() {
            origMatchMedia = window.matchMedia;
        });

        after(function() {
            window.matchMedia = origMatchMedia;
        });

        it('shows a desktop image in desktop view and then changes to mobile on resize if the media query matches', function () {
            if(window.outerWidth > 0) { //doesnt work in gruntcli for some reason
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
    define('specs/responsiveImagesSpec', ['utils/event'], function (event) {
        return responsiveImagesSpec(event);
    });
}