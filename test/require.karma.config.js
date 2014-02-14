var tests = [];
for (var file in window.__karma__.files) {
    if (/spec\.js$/.test(file)) {
        tests.push(file);
    }
}

window.turnOffAnimation = function(selector){
    var offTime = '10ms'; //can't be zero as we still need the 'end' events to fire.
    if (selector){
        $("<style type='text/css' class='turnOffAnimation'> body " + selector + "{ transition-duration:" + offTime + "!important;-webkit-transition-duration:" + offTime + "!important; -webkit-animation-duration: " + offTime + "!important;animation-duration:" + offTime + "!important;} </style>").appendTo("head");
    } else {
        $('.turnOffAnimation').remove();
    }
};
window.testCount = 0;
window.testFeature = '';
window.addCSS = function(item){
    var css = document.createElement('link');
    css.rel = "stylesheet";
    css.href = 'base/_site/dist/stylesheets/' + item + '.css';
    document.head.appendChild(css);
};

window.addFixture = function(route, feature, item){
//    var script = document.createElement('script');
    var path = '_site/_includes/' + route + '/' + feature + '/' + item ;
//    script.src = 'base/' + path + '.js';
//    document.head.appendChild(script);
//    if (window.testCount === 0){
//        document.body.innerHTML = '';
//        clearBody = false;
//    }
//    if (window.__html__){ //sort out karma
        document.body.innerHTML += window.__html__[path + '.html'];
//    }
//    if (window.testFeature != route +'/' + feature){
//        testCount++;
//        window.testFeature = route +'/' + feature;
//        console.log(testCount, ': adding scripts for ' + testFeature);
//    }
};

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: 'base/grunt/js',

    paths: {
        'chai': '../../test/libraries/chai',
        'jquery': '../../test/libraries/jquery-2.0.3'
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done loading specs and everything
    callback: window.__karma__.start
});