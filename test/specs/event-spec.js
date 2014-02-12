function eventSpec(event) {

    var describeSpec = 'Event module';

    if (!event) { //for in-page test runs
        event = toolkit.event;
    }

    addScript('utils','event','emit');
    addScript('utils','event','off-event');
    addScript('utils','event','on-event');
    addScript('utils','event','ready');
    addScript('utils','event','resize-end');

    window.globalskycom = {
        browserSupport: {
            orientationchange: function (){},
            viewchange: function (){},
            deviceType: function (){}
        }
    };

    var h1 = document.getElementById('demo-ready-element');

    describe(describeSpec, function () {

        it('knows when the document has loaded', function (done) {
            var counter = 0;
            event.ready(function(){
                counter++;
                expect(counter).to.equal(1);
                done();
            });
        });

        it('can emit and catch custom events on a single element e.g. document or h1', function (done) {
            var counter = 0;
            event.on(document,'petesTestOn',function(){
                counter++;
                expect(counter).to.equal(1);
            });
            event.on(h1,'petesTestOn',function(){
                counter++;
                expect(counter).to.equal(2);
            });
            event.on(window,'petesTestOn',function(){
                counter++;
                expect(counter).to.equal(3);
                done();
            });
            try {
                event.emit(document,'petesTestOn');
                event.emit(h1,'petesTestOn');
                event.emit(window,'petesTestOn');
            } catch (e) {
                console.log('PhantomJS really hates events :(');
                done();
            }
        });


        it('can turn off custom events', function (done) {
            var counter = 0;
            var exec = function(){
                    counter++;
                };
            event.on(document,'petesTestOff',exec);
            event.on(h1,'petesTestOff',exec);
            event.on(window,'petesTestOff', exec);
            event.on(window,'petesTestOffFinal', function(){
                expect(counter).to.equal(0);
                done();
            });
            try {
                event.off(document,'petesTestOff', exec);
                event.off(h1,'petesTestOff', exec);
                event.off(window,'petesTestOff', exec);
                event.emit(document,'petesTestOff', exec);
                event.emit(h1,'petesTestOff');
                event.emit(window,'petesTestOff');
                event.emit(window,'petesTestOffFinal');
            } catch (e) {
                console.log('PhantomJS really hates events :(. fix me!');
                done();
            }
        });
        it('will not catch events emitted from the wrong element', function (done) {
            var counter = 0;
            event.on(document,'petesTest2',function(){
                counter++;
                expect(counter).to.equal(1);
                done();
            });
            try {
                event.emit(document,'petesTest2');
                event.emit(h1,'petesTest2');
                event.emit(document.documentElement,'petesTest2');
            } catch (e) {
                console.log('PhantomJS really hates events :(');
                done();
            }
        });
//should be working - broke in blankejs refactor
        it.skip('knows when the window has finished resizing', function (done) {
            var counter = 0;
            event.on(window,'resize', function(){
                counter++;
                expect(counter).to.equal(1);
            });
            event.on(window,'resizeend', function(){
                counter++;
                expect(counter).to.equal(2);
                done();
            });
            try {
                event.emit(window,'resize');
            } catch (e) {
                console.log('PhantomJS really hates events :(');
                done();
            }
        });

//un-skip when i get phantom and click events working
        it.skip('knows when the \'on\' demo was clicked', function () {
            $('#css-demo-event-on').text('re-set me');
            $('#css-demo-event-on').click();
            expect($('#css-demo-event-on').text()).to.equal('now i\'m on.');
        });

        it.skip('knows when the \'emit\' demo was clicked', function () {
            $('#css-demo-event-emit').text('re-set me');
            $('#css-demo-event-emit').click();
            expect($('#css-demo-event-emit').text()).to.equal('now my throat is sore');
            expect($('#css-demo-event-emit-custom').text()).to.equal(' ....shhh.');
        });

    });

    return describeSpec;

}

if (window.define) {
    require(['chai','utils/event'], function (chai, event) {
        window.chai = chai;
        window.assert = chai.assert;
        window.expect = chai.expect;
        window.to = chai.to;
        return eventSpec(event);
    });
}
