module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            'toolkit': {
                files: [ 'js/**/*.js',
                         'sass/**/*.scss'
                ],
                tasks: ['compass','jshint','requirejs']
            }
        },
        clean: {
            toolkit: ['scripts']
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
        requirejs:{
            toolkit: {
                options: {
                    optimize: grunt.option('beautify') ? "none" : "uglify2",
                    preserveLicenseComments: false,
                    baseUrl: "js",
                    dir: "scripts",
                    removeCombined: true,
                    generateSourceMaps: true,
                    modules:[{
                        name: 'toolkit'
                    },
                    {
                        name: 'wiki'
                    }]
                }
            }
        },
        mocha: {
            all: {
                src: (function() {
                    var pattern = grunt.option('pattern') || '[A-Z]*';
                    return ['test/jsUnit/' + pattern + '.html'];
                }()),
                options: {
                    run: false,
                    log: false // Set to true to see console.log() output on the terminal
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha');

    grunt.registerTask('default', ['clean', 'compass','jshint', 'requirejs']);
    grunt.registerTask('test', ['mocha']);
    grunt.registerTask('hint', ['jshint']);
};