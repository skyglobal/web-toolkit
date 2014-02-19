module.exports = function(grunt){
    return {
        "dev-build": ['clean:toolkit', 'compass:toolkit', 'requirejs:toolkit', 'jekyll:build'],
        "dev-spy": ['dev-build', 'watch'],

        //  standard build tasks that lints your JS
        "build": ['jshint', 'dev-build'],
        "spy": ['jshint', 'dev-spy'],

        //  misc tasks
        "fonts": ['clean:css', 'clean:fonts', 'svgmin:fonts', 'webfont', 'compass:toolkit'],
        "svgs": ['svgmin:icons', 'grunticon'],

        //  testing tasks
        "test-with-coverage": ['requirejs:beautify','jekyll:build', 'blanket_mocha'],
        "test-without-coverage": ['requirejs:uglify','jekyll:build', 'mocha'],
        "test-cross-browser": ['jekyll:build','connect', 'exec:browserstack'],
        "test-cross-browser-live": ['jekyll:build','connect', 'exec:browserstack-live'],

        //  alias
        "test": ['test-with-coverage'],
        "default": ['build']
    }
};