function responsiveImagesSpec(responsiveImages, event) {

    var describeSpec = 'Responsive Images';

    if (!event){//needed for running test in demo page
        event = toolkit.event;
    }

    var fixtures = {
        'demo-responsive-images': document.getElementById('demo-responsive-images').outerHTML
    };

    addScript('utils','responsive-images','using');

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
                console.log('grunt cli doent like responsive images. fix me.');
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
    define('specs/responsive-images-spec', ['utils/responsive-images','utils/event'], function (responsiveImages, event) {
        return responsiveImagesSpec(responsiveImages, event);
    });
}