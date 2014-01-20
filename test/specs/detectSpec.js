function detectSpec(detect, event) {

    var describeSpec = 'Detect module can use JS and HTML to know';

    if (!detect) { //for in page test runs
        event = toolkit.event;
        detect = toolkit.detect;
    }

    window.globalskycom = {
        browserSupport: {
            orientationchange: function (){},
            viewchange: function (){},
            deviceType: function (){}
        }
    };

    function resize(){
        try{ //phantomJS doent understand this :(
            event.emit(window,'resize');
        } catch (e) {
            detect.updateDetectionStates();
        }
    }

    describe(describeSpec, function () {

        it('when you are in desktop view', function () {
            var css =$("<style type='text/css'> html:after{ content:'desktop'} </style>");
            css.appendTo("head");
            resize();
            expect(detect.view()).to.equal('desktop');
            expect(detect.view('desktop')).to.equal(true);
            expect($('html').hasClass('desktop-view')).to.equal(true);
            expect($('html').hasClass('mobile-view')).to.equal(false);
            css.remove();
        });

        it('when you are in mobile view', function () {
            var css =$("<style type='text/css'> html:after{ content:'mobile'} </style>");
            css.appendTo("head");
            resize();
            expect(detect.view()).to.equal('mobile');
            expect(detect.view('mobile')).to.equal(true);
            expect($('html').hasClass('mobile-view')).to.equal(true);
            expect($('html').hasClass('desktop-view')).to.equal(false);
            css.remove();
        });

        it('when you are not a touch device', function () {
            delete window.ontouchstart;
            resize();
            expect(detect.touch()).to.equal(false);
            expect($('html').hasClass('no-touch')).to.equal(true);
            expect($('html').hasClass('touch-device')).to.equal(false);
        });

        it('when you are a touch device', function () {
            window.ontouchstart = true;
            resize();
            if (window.ontouchstart){ //doesnt work in grunt cli for some reason
                expect(detect.touch()).to.equal(true);
                expect($('html').hasClass('no-touch')).to.equal(false);
                expect($('html').hasClass('touch-device')).to.equal(true);
                delete window.ontouchstart;
            }
        });

        it('your orientation is landscape', function () {
            var css =$("<style type='text/css'> html:before{ content:'landscape'} </style>");
            css.appendTo("head");
            resize();
            expect(detect.orientation('landscape')).to.equal(true);
            expect(detect.orientation()).to.equal('landscape');
            expect($('html').hasClass('landscape')).to.equal(true);
            expect($('html').hasClass('portrait')).to.equal(false);
            css.remove();
        });

        it('your orientation is portrait', function () {
            var css =$("<style type='text/css'> html:before{ content:'portrait'} </style>");
            css.appendTo("head");
            resize();
            expect(detect.orientation('portrait')).to.equal(true);
            expect(detect.orientation()).to.equal('portrait');
            expect($('html').hasClass('landscape')).to.equal(false);
            expect($('html').hasClass('portrait')).to.equal(true);
            css.remove();
        });

        it('that a css property is supported', function () {
            expect(detect.css('transition')).to.equal(true);
            expect(detect.css('support3D')).to.equal(true);
        });

        it('that a css property is not supported', function () {
            expect(detect.css('nonExistantCss')).to.equal(false);

        });

        it('when pseduo classes are supported', function(){
            expect(detect.pseudo()).to.equal(true);
        });

        it('when pseduo classes are not supported', function(){
            var css =$("<style type='text/css'> *:before{ display:none!important;} </style>");
            css.appendTo("head");
            expect(detect.pseudo()).to.equal(false);
            css.remove();
        });

        it('what is in the contents of a pseudo class', function(){
            expect(detect.pseudo(document.documentElement,'before', 'content')).not.to.equal('rock on');
            expect(detect.pseudo(document.documentElement,'before', 'content')).not.to.equal(null);
            expect(detect.pseudo(document.documentElement,'after', 'content')).not.to.equal('rock on some more');

            var before,after;
            before=$("<style type='text/css'> html:before{ content:'rock on';} </style>");
            before.appendTo("head");
            after=$("<style type='text/css'> html:after{ content:'rock on some more';} </style>");
            after.appendTo("head");

            expect(detect.pseudo(document.documentElement,'before', 'content')).to.equal('rock on');
            expect(detect.pseudo(document.documentElement,'after', 'content')).to.equal('rock on some more');

            before.remove();
            after.remove();
        });
    });

    return describeSpec;

}

if (window.define) {
    define('specs/detectSpec', ['utils/detect', 'utils/event'], function (detect, event) {
        return detectSpec(detect, event);
    });
}
