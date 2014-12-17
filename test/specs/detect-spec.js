function detectSpec(detect, event) {

    var describeSpec = 'Detect module can use JS and HTML to know';

    if (!detect) { //for in page test runs
        event = toolkit.event;
        detect = toolkit.detect;
    }

    window.globalskycom = {
        browserSupport: {
            orientationchange: function () {
            },
            viewchange: function () {
            },
            deviceType: function () {
            }
        }
    };
    addScript('utils', 'detect', 'css');
    addScript('utils', 'detect', 'touch');

    function resize() {
        try { //phantomJS doent understand this :(
            console.log('phantomJS doent understand this emit.resize. fix me.');
            event.emit(window, 'resize');
        } catch (e) {
            detect.updateDetectionStates();
        }
    }

    describe(describeSpec, function () {


        it('elementVisibleBottom should return false, when bottom of an element is not visible', function () {

            var element = {
                offsetHeight: 10000,
                getBoundingClientRect: function () {
                    return {
                        top: 100000,
                        left: 100000
                    };
                }
            }

            expect(detect.elementVisibleBottom(element)).to.equal(false);
        });

        it('elementVisibleBottom should return true, when bottom of an element is visible', function () {

            var elementTwo = {
                offsetHeight: -1000,
                getBoundingClientRect: function () {
                    return {
                        top: 2,
                        left: 3
                    };
                }
            }

            expect(detect.elementVisibleBottom(elementTwo)).to.equal(true);
        });


        it('elementVisibleRight should return false, when right of an element is not visible', function () {

            var element = {
                offsetWidth: 10000,
                getBoundingClientRect: function () {
                    return {
                        top: 100000,
                        left: 100000
                    };
                }
            }

            expect(detect.elementVisibleRight(element)).to.equal(false);
        });

        it('elementVisibleRight should return true, when right of an element is visible', function () {

            var elementTwo = {
                offsetWidth: -1000,
                getBoundingClientRect: function () {
                    return {
                        top: 2,
                        left: 3
                    };
                }
            };

            expect(detect.elementVisibleRight(elementTwo)).to.equal(true);
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
            if (window.ontouchstart) { //doesnt work in grunt cli for some reason
                expect(detect.touch()).to.equal(true);
                expect($('html').hasClass('no-touch')).to.equal(false);
                expect($('html').hasClass('touch-device')).to.equal(true);
                delete window.ontouchstart;
            }
        });

        it('that a css property is supported', function () {
            expect(detect.css('transition')).to.equal(true);
            expect(detect.css('translate3d')).to.equal(true);
        });

        it('that a css property is not supported', function () {
            expect(detect.css('nonExistantCss')).to.equal(false);

        });


    });

    return describeSpec;

}

if (window.define) {
    define('specs/detect-spec', ['bower_components/bskyb-detect/dist/js/detect.requirejs', 'utils/event'], function (detect, event) {
        return detectSpec(detect, event);
    });
}
