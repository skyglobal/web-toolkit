requirejs.config({
    baseUrl: '../../grunt/js/',
    paths: {
        mocha: '../../test/vendor/mocha',
        chai: '../../test/vendor/chai',
        smoax: '../../test/vendor/smoax'
    },
    shim: {
        smoax: {
            exports: 'Smoax'
        }
    },
    urlArgs: 'v=' + new Date().getTime()
});