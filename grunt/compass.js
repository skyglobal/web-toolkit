module.exports = function(grunt) {
    return {
        toolkit: {
            options: {
                config: 'grunt/sass/config.rb',
                sassDir: 'grunt/sass/',
                cssDir: 'dist/stylesheets/',
                outputStyle: grunt.option('beautify') ? "expanded" : "compressed" ,
                noLineComments: true,
                trace: true
            }
        }
    };
};