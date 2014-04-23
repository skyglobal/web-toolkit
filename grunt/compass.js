module.exports = function(grunt) {
    return {
        toolkit: {
            options: {
                config: 'app/src/sass/config.rb',
                sassDir: 'app/src/sass/',
                cssDir: 'dist/stylesheets/',
                outputStyle: grunt.option('beautify') ? "expanded" : "compressed" ,
                noLineComments: true,
                trace: true
            }
        }
    };
};
