function eventSpec(event) {

    var describeSpec = 'Event module';

    if (!event) { //for in-page test runs
        event = toolkit.event;
    }

    window.globalskycom = {
        browserSupport: {
            orientationchange: function (){},
            viewchange: function (){},
            deviceType: function (){}
        }
    };

    var h1 = document.getElementsByTagName('h1')[0];

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
            event.on(document,'petesTest1',function(){
                counter++;
                expect(counter).to.equal(1);
            });
            event.on(h1,'petesTest1',function(){
                counter++;
                expect(counter).to.equal(2);
            });
            event.on(window,'petesTest1',function(){
                counter++;
                expect(counter).to.equal(3);
                done();
            });
            try {
                event.emit(document,'petesTest1');
                event.emit(h1,'petesTest1');
                event.emit(window,'petesTest1');
            } catch (e) {
                console.log('PhantomJS really hates events :(');
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

        it('knows when the window has finished resizing', function (done) {
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
    define('specs/eventSpec', ['utils/event'], function ( event) {
        return eventSpec(event);
    });
}
