requirejs.config({
    baseUrl: 'dist/scripts/',
    paths: {
        mocha: '../../test/libraries/mocha',
        chai: '../../test/libraries/chai',
        runner: '../../test/runner',
        specs: '../../test/specs/'
    },
    urlArgs: 'v=' + new Date().getTime()
});


require(['chai'], function(chai) {

    // PhantomJS had some problem if should is set as a global variable and was timing out
    // window.should = should
    window.chai = chai;
    window.assert = chai.assert;
    window.expect = chai.expect;
    window.to = chai.to;

    mocha.setup('bdd');
    mocha.setup({ignoreLeaks: true}); //otherwise mocha complains about jquery and moment being globals
});



window.turnOffAnimation = function(selector){
    var offTime = '10ms'; //can't be zero as we still need the 'end' events to fire.
    if (selector){
        $("<style type='text/css' class='turnOffAnimation'> body " + selector + "{ transition-duration:" + offTime + "!important;-webkit-transition-duration:" + offTime + "!important; -webkit-animation-duration: " + offTime + "!important;animation-duration:" + offTime + "!important;} </style>").appendTo("head");
    } else {
        $('.turnOffAnimation').remove();
    }
};