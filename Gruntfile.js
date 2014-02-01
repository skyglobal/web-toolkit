module.exports = function(grunt) {

    var cli = grunt.cli;

    cli.optlist.beautify = {
        "short": "B",
        info: "Set beautify on",
        type: String
    };

    grunt.initConfig({
        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint']
            },
            'js': {
                files: [ 'grunt/js/**/*.js' ],
                tasks: ['jshint','requirejs','jekyll:build']
            },
            'scss': {
                files: [ 'grunt/sass/**/*.scss'],
                tasks: ['compass', 'jekyll:build']
            },
            'jekyll': {
                files: [ '_includes/**/*', '_layouts/**/*', '*.html', '_config.yml', 'test/libraries/*.js','test/*' ],
                tasks: ['jekyll:build']
            },
            'specs': {
                files: ['test/specs/*.js','test/config.js'],
                tasks: ['jekyll:build'] //'jshint',
            }
        },
        clean: {
            toolkit: ['dist/images','dist/scripts','dist/stylesheets'],
            js: ['dist/scripts'],
            css: ['dist/images','dist/stylesheets'],
            fonts: ['grunt/fonts/min','dist/fonts']
        },
        jshint: {
            toolkit: ['Gruntfile.js',
                      'grunt/js/components/*.js',
                      'grunt/js/utils/*.js',
                      'grunt/js/demo/*.js'],
//        'test/specs/**/*.js',
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
        },
        requirejs:{
            toolkit: {
                options: {
                    optimize: grunt.option('beautify') ? "none" : "uglify2",
                    preserveLicenseComments: false,
                    baseUrl: "grunt/js",
                    dir: "dist/scripts",
                    removeCombined: true,
                    generateSourceMaps: false,
                    modules:[{
                        name: 'toolkit'
                    },{
                        name: 'demo'
                    },{
                        name: 'changes'
                    },{
                        name: 'testIFrame'
                    }]
                }
            }
        },
        webfont: {
            icons: {
                src: 'grunt/fonts/min/*.svg',
                dest: 'dist/fonts',
                destCss: 'dist/fonts',
                options: {
                    font : 'skycons',
                    template : 'grunt/fonts/template/skycon-template.css',
                    htmlDemoTemplate : 'grunt/fonts/template/skycon-template.html',
                    htmlDemo : true,
//                    engine : 'node',
                    destHtml : '_includes/baseStyles/icons',
                    hashes : false,
                    embed : true
                }
            }
        },
        svgmin: {                       // Task
            options: {                  // Configuration that will be passed directly to SVGO
                plugins: [{
                    removeViewBox: false,
                    removeUselessStrokeAndFill: true,
                    removeEmptyAttrs: true
                }]
            },
            fonts: {                         // Target
                files: [{                   // Dictionary of files
                    expand: true,           // Enable dynamic expansion.
                    cwd: 'static/font-svgs/',    // Src matches are relative to this path.
                    src: ['*.svg'],      // Actual pattern(s) to match.
                    dest: 'grunt/fonts/min/', // Destination path prefix.
                    ext: '.svg'         // Dest filepaths will have this extension.
                }]
            },
            icons: {                         // Target
                files: [{                   // Dictionary of files
                    expand: true,           // Enable dynamic expansion.
                    cwd: 'grunt/svgs/orig/',    // Src matches are relative to this path.
                    src: ['*.svg'],      // Actual pattern(s) to match.
                    dest: 'grunt/svgs/min/', // Destination path prefix.
                    ext: '.svg'         // Dest filepaths will have this extension.
                }]
            }
        },

        grunticon: {
            colourSVG: {
                options: {
                    src: "grunt/svgs/min",
                    dest: "dist/svgs/"
                }
            }
        },

        mocha: {
            all: {
                src: (function() {
                    var pattern = grunt.option('pattern') || '[A-Z]*';
                    return ['_site/test.html'];
                }()),
                options: {
                    run: false,
                    log: true // Set to true to see console.log() output on the terminal
                }
            }
        },

        blanket_mocha: {

            all : ['_site/test.html'],
            options : {
                threshold : 70, // <- percetage of files that have to pass coverage rules
                globalThreshold : 80, // <- coverage rule
                log : true
            }
        },

        jekyll: {                            // Task
            options: {                          // Universal options
                bundleExec: true,
                config: '_config.yml'
            },
            build:{
                options: {
                    watch: false,
                    serve: false
                }
            },
            run:{
                options: {
                    watch: true,
                    serve: true
                }
            }
        }
    });

    // Loading dependencies
    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) {
            grunt.loadNpmTasks(key);
        }
    }

//    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['clean:toolkit', 'compass:toolkit', 'jshint', 'requirejs']);
    grunt.registerTask('spy', ['clean:toolkit', 'compass:toolkit', 'jshint', 'requirejs', 'jekyll:build', 'watch']);
    grunt.registerTask('sloppy', ['clean:toolkit', 'compass:toolkit', 'requirejs', 'watch']);
    grunt.registerTask('fonts', ['clean:css', 'clean:fonts', 'svgmin:fonts', 'webfont', 'compass:toolkit']);
    grunt.registerTask('svgs', ['svgmin:icons', 'grunticon']);
    grunt.registerTask('test', ['blanket_mocha']);
};