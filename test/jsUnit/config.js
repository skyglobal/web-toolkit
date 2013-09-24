requirejs.config({
    baseUrl: '../../grunt/js/',
    paths: {
        mocha: '../../test/jsUnit/vendor/mocha',
        chai: '../../test/jsUnit/vendor/chai',
        smoax: '../../test/jsUnit/vendor/smoax'
    },
    shim: {
        smoax: {
            exports: 'Smoax'
        }
    },
    urlArgs: 'v=' + new Date().getTime()
});