module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            'toolkit': {
                files: [ 'js/modules/*.js',
                         'js/utils/*.js',
                         'sass/**/*.scss'
                ],
                tasks: ['compass','jshint','uglify']
            }
        },
        clean: {
            toolkit: ['js/toolkit.*']
        },
        jshint: {
            toolkit: ['js/modules/*.js',
                      'js/utils/*.js'],
            others: ['Gruntfile.js'],
            options: {
                "globals": {
                    document: false,
                    window: false,
                    console: false,
                    setTimeout: false,
                    clearTimeout: false,
                    setInterval: false,
                    clearInterval: false
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'sass/',
                    cssDir: 'stylesheets/',
                    outputStyle: 'compressed',
                    noLineComments: true,
                    trace: true
                }
            }
        },
        uglify: {
            toolkit: {
                options: {
                    sourceMap: 'js/toolkit.js.map',
                    sourceMapRoot: '../',
                    sourceMappingURL: 'toolkit.js.map',
                    sourceMapPrefix: 1
                },
                files: {
                    'js/toolkit.js': [
                        'js/modules/*.js',
                        'js/utils/*.js'
                    ]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['clean', 'compass','jshint', 'uglify']);
    grunt.registerTask('hint', ['jshint']);
};