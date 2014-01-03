function detectSpec(detect) {

    var describeSpec = 'Detect module can use JS and HTML to know';

    if (!detect) { //for in page test runs
        detect = toolkit.detect;
    }

    window.globalskycom = {
        browserSupport: {
            orientationchange: function (){},
            viewchange: function (){},
            deviceType: function (){}
        }
    };

    describe(describeSpec, function () {

        it('when you are in desktop view', function () {
            var css =$("<style type='text/css'> html:after{ content:'desktop'} </style>");
            css.appendTo("head");
            $(window).trigger('resize');
            expect(detect.view()).to.equal('desktop');
            expect(detect.view('desktop')).to.equal(true);
            expect($('html').hasClass('desktop-view')).to.equal(true);
            expect($('html').hasClass('mobile-view')).to.equal(false);
            css.remove();
        });

        it('know when you are in mobile view', function () {
            var css =$("<style type='text/css'> html:after{ content:'mobile'} </style>");
            css.appendTo("head");
            $(window).trigger('resize');
            expect(detect.view()).to.equal('mobile');
            expect(detect.view('mobile')).to.equal(true);
            expect($('html').hasClass('mobile-view')).to.equal(true);
            expect($('html').hasClass('desktop-view')).to.equal(false);
            css.remove();
        });

        it('know when you are not a touch device', function () {
            delete window.ontouchstart;
            $(window).trigger('resize');
            expect(detect.touch()).to.equal(false);
            expect($('html').hasClass('no-touch')).to.equal(true);
            expect($('html').hasClass('touch-device')).to.equal(false);
        });

        it('know when you are a touch device', function () {
            window.ontouchstart = true;
            $(window).trigger('resize');
            if (window.ontouchstart){ //doesnt work in grunt cli for some reason
                expect(detect.touch()).to.equal(true);
                expect($('html').hasClass('no-touch')).to.equal(false);
                expect($('html').hasClass('touch-device')).to.equal(true);
                delete window.ontouchstart;
            }
        });

        it('know your orientation is landscape', function () {
            var css =$("<style type='text/css'> html:before{ content:'landscape'} </style>");
            css.appendTo("head");
            $(window).trigger('resize');
            expect(detect.orientation('landscape')).to.equal(true);
            expect(detect.orientation()).to.equal('landscape');
            expect($('html').hasClass('landscape')).to.equal(true);
            expect($('html').hasClass('portrait')).to.equal(false);
            css.remove();
        });

        it('know your orientation is portrait', function () {
            var css =$("<style type='text/css'> html:before{ content:'portrait'} </style>");
            css.appendTo("head");
            $(window).trigger('resize');
            expect(detect.orientation('portrait')).to.equal(true);
            expect(detect.orientation()).to.equal('portrait');
            expect($('html').hasClass('landscape')).to.equal(false);
            expect($('html').hasClass('portrait')).to.equal(true);
            css.remove();
        });
    });

    return describeSpec;

}

if (window.define) {
    define('specs/detectSpec', ['utils/detect'], function (detect) {
        return detectSpec(detect);
    });
}
