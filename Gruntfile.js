module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            'toolkit': {
                files: [ 'grunt/js/**/*.js',
                         'grunt/sass/**/*.scss'
                ],
                tasks: ['compass','jshint','requirejs']
            }
        },
        clean: {
            toolkit: ['dist/images','dist/scripts','dist/stylesheets'],
            fonts: ['dist/fonts']
        },
        jshint: {
            toolkit: ['grunt/js/modules/*.js',
                      'grunt/js/utils/*.js'],
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
                    sassDir: 'grunt/sass/',
                    cssDir: 'dist/stylesheets/',
                    raw: 'http_path = "../"; generated_images_path = "dist/images/"; sprite_load_path = "grunt/"',
                    outputStyle: grunt.option('beautify') ? "expanded" : "compressed" ,
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
                    baseUrl: "grunt/js",
                    dir: "dist/scripts",
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
        },
        webfont: {
            icons: {
                src: 'grunt/fonts/*.svg',
                dest: 'dist/fonts',
                destCss: 'dist/fonts',
                options: {
                    font: 'skycons',
                    template:'grunt/fonts/template/skycon-template.css',
                    htmlDemoTemplate:'grunt/fonts/template/skycon-template.html',
                    htmlDemo: true,
                    destHtml: '_includes',
                    hashes: false
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
    grunt.loadNpmTasks('grunt-webfont'); //https://github.com/sapegin/grunt-webfont

    grunt.registerTask('default', ['clean:toolkit', 'compass', 'jshint', 'requirejs']);
    grunt.registerTask('fonts', ['clean:fonts', 'webfont']);
    grunt.registerTask('test', ['mocha']);
    grunt.registerTask('hint', ['jshint']);
};