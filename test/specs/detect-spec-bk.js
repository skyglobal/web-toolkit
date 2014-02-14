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
    document.body.innerHTML += window.__html__['utils/detect/css.html'];
    document.body.innerHTML += window.__html__['utils/detect/orientation.html'];
    document.body.innerHTML += window.__html__['utils/detect/touch.html'];
    document.body.innerHTML += window.__html__['utils/detect/view.html'];

    function updateDetectCSS(){
        var demoTransition = document.getElementById('css-demo-transition');
        var demo3D = document.getElementById('css-demo-support3D');
        var demoTransform = document.getElementById('css-demo-transform');
        var returnTransform = document.getElementById('css-demo-return-transform');

        var transition = detect.css('transition');
        var support3D = detect.css('support3D');
        var transform = detect.css('transform');

        demoTransition.innerHTML = transition;
        demo3D.innerHTML = support3D;
        demoTransform.innerHTML = transform;

        returnTransform.innerHTML = detect.css(demoTransition, 'transition');
    }
    function updateOrientation(){
        var orientation = detect.orientation();
        var isPortrait = detect.orientation('portrait');
        var isLandscape = detect.orientation('landscape');
        $('#orientation-demo').text(orientation);
        $('#orientation-demo-is-landscape').text(isLandscape);
        $('#orientation-demo-is-portrait').text(isPortrait);
    }
    function updateView(){
        var view = detect.view();
        var desktop = detect.view('desktop');
        var mobile = detect.view('mobile');
        $('#view-demo').text(view);
        $('#view-demo-is-desktop').text(desktop);
        $('#view-demo-is-mobile').text(mobile);
    }
    function resize(){
        detect.updateDetectionStates();
    }
    updateOrientation();
    updateDetectCSS();
    updateView();
    $(window).on('resize',function(){updateView();});
    $(window).on('resize',function(){updateOrientation();});

    var touch = detect.touch();
    $('#touch-demo').text(touch);

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

        it.skip('when you are not a touch device', function () {//doesnt work in phantom
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
    define(['chai','utils/detect'], function (chai, detect) {
        window.chai = chai;
        window.assert = chai.assert;
        window.expect = chai.expect;
        window.to = chai.to;
        return detectSpec(detect, event);
    });
}
