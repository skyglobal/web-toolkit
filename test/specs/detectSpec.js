function detectSpec(detect) {

    var describeSpec = 'Detect module';

    if (!detect) { //for in page test runs
        detect = toolkit.detect;
    }

    describe(describeSpec, function () {

        it('should know when you are in desktop view', function () {
            var css =$("<style type='text/css'> html:after{ content:'desktop'} </style>");
            css.appendTo("head");
            expect(detect.view()).to.equal('desktop');
            expect(detect.view('desktop')).to.equal(true);
            css.remove();
        });

        it('should know when you are in mobile view', function () {
            var css =$("<style type='text/css'> html:after{ content:'mobile'} </style>");
            css.appendTo("head");
            expect(detect.view()).to.equal('mobile');
            expect(detect.view('mobile')).to.equal(true);
            css.remove();
        });

        it('should know when you are not a touch device', function () {
            delete window.ontouchstart;
            expect(detect.touch()).to.equal(false);
        });

        it('should know when you are a touch device', function () {
            window.ontouchstart = true;
            if (window.ontouchstart){ //doesnt work in grunt cli for some reason
                expect(detect.touch()).to.equal(true);
                delete window.ontouchstart;
            }
        });

        it('should know your orientation is landscape', function () {
            expect(detect.orientation('landscape')).to.equal(true);
            expect(detect.orientation()).to.equal('landscape');
        });

        it('should know your orientation is portrait', function () {
            var css =$("<style type='text/css'> html:before{ content:'portrait'} </style>");
            css.appendTo("head");
            expect(detect.orientation('portrait')).to.equal(true);
            expect(detect.orientation()).to.equal('portrait');
            css.remove();
        });
    });

    return describeSpec;

}

if (window.define) {
    define('specs/detectSpec', ['utils/detect'], function (detect) {
        return detectSpec(detect);
    })
}
