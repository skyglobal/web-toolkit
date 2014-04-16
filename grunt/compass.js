module.exports = function(grunt) {
    return {
        toolkit: {
            options: {
                config: 'src/sass/config.rb',
                sassDir: 'src/sass/',
                cssDir: 'dist/stylesheets/',
                outputStyle: grunt.option('beautify') ? "expanded" : "compressed" ,
                noLineComments: true,
                trace: true
            }
        }
    };
};