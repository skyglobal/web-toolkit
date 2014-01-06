function responsiveImagesSpec() {

    var describeSpec = 'Responsive Images';

    describe(describeSpec, function () {

        it('shows a desktop image in desktop view and then changes to mobile on resize if the media query matches', function () {
            window.matchMedia = function() { return { matches: false }; };
            $(window).trigger('skycom.resizeend');
            expect($('#demo-responsive-images').find('img').attr('src')).to.contain('beckham.jpg');
            window.matchMedia = function() { return { matches: true }; };
            $(window).trigger('skycom.resizeend');
            expect($('#demo-responsive-images').find('img').attr('src')).to.contain('davinci-mobile.jpg');

        });


    });

    return describeSpec;
}

if (window.define) {
    define('specs/responsiveImagesSpec', function () {
        return responsiveImagesSpec();
    });
}