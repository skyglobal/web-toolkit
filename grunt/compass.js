module.exports = function(grunt) {
    return {
        toolkit: {
            options: {
                config: 'app/src/sass/config.rb',
                sassDir: 'app/src/sass/',
                cssDir: 'dist/stylesheets/',
                imagesDir: 'app/src/icon/',
                outputStyle: grunt.option('beautify') ? "expanded" : "compressed" ,
                noLineComments: true,
                trace: true,
                bundleExec: true,
                relativeAssets: true,
                importPath: ['bower_components']
            }
        }
    };
};
