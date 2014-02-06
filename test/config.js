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

mocha.setup({ignoreLeaks: true});
mocha.setup('bdd');