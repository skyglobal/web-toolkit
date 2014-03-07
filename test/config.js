window.environment = 'test';

window.turnOffAnimation = function(selector){
    var offTime = '10ms'; //can't be zero as we still need the 'end' events to fire.
    if (selector){
        $("<style type='text/css' class='turnOffAnimation'> body " + selector + "{ transition-duration:" + offTime + "!important;-webkit-transition-duration:" + offTime + "!important; -webkit-animation-duration: " + offTime + "!important;animation-duration:" + offTime + "!important;} </style>").appendTo("head");
    } else {
        $('.turnOffAnimation').remove();
    }
};

window.addScript = function(route, feature, item){
    var script = document.createElement('script');
    script.src = '_includes/' + route + '/' + feature + '/' + item + '.js';
    document.head.appendChild(script);
};

window.chai = chai;
window.assert = chai.assert;
window.expect = chai.expect;
window.to = chai.to;

// change PhantomJS to a reasonable resolution
console.log(JSON.stringify({
    action: 'viewportSize',
    width: '960',
    height: '960'
}));

// screenshotting function for in tests
window.screenshot = function(component, aspect, container) {
//    todo: should container be $container if its a jQuery element?
//    todo: log if container can not be found instead of calling getBoundingClientRect on undefined?

    // de-jQuery container
//    todo: if you dont want a jQuery element, don't accept one.
    container = container.first ? container[0] : container;

    // we communicate with PhantomJS through their listener of console.log
    console.log(JSON.stringify({
        action: 'render',
        filename: 'screenshots/' + component + '-' + aspect + '-v2.png',
        clipRect: container.getBoundingClientRect()
    }));
};

mocha.setup({ignoreLeaks: true});
mocha.ui('bdd');