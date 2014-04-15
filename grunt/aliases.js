module.exports = {
    "dev-build": ['clean:toolkit', 'compass:toolkit', 'requirejs:toolkit', 'uglify', 'jekyll:build'],

    //  standard build tasks that lints your JS
    "build": ['jshint', 'version_sync', 'dev-build'],
    "serve": ['build','connect:app', 'open:app', 'watch'],

    //  misc tasks
    "fonts": ['clean:css', 'clean:fonts', 'svgmin:fonts', 'webfont', 'compass:toolkit'],
    "svgs": ['svgmin:icons', 'grunticon'],

    //  testing tasks
    "test-with-coverage": ['blanket_mocha'],
    "test-without-coverage": ['mocha'],
    "test-cross-browser": ['jekyll:build','connect:cross-browser', 'exec:browserstack'],
    "test-cross-browser-live": ['jekyll:build','connect:cross-browser', 'exec:browserstack-live'],

    //  alias
    "server": ['serve'],
    "test": ['build', 'test-without-coverage', 'test-with-coverage'],
    "default": ['build']
};
