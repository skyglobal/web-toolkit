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
                files: [ '_includes/**/*', '_layouts/**/*', '*.html', '_config.yml' ],
                tasks: ['jekyll:build']
            },
            'specs': {
                files: ['test/specs/*.js','test/config.js'],
                tasks: ['jshint','jekyll:build']
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
                      'grunt/js/demo/*.js',
                      'test/specs/**/*.js'],
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
                    reporter: 'Spec',
                    run: false,
                    log: false // Set to true to see console.log() output on the terminal
                }
            }
        },

        screenshot_diff: {
            files: ['screenshot/'],
            options: {
                outputFormat: 'json' // or html
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

    grunt.registerTask('screenshot_verify_diff', 'Verify that the screenshots have no changes.', function() {
        var diffs = grunt.file.readJSON('screenshot/v2-v1-diff.json');
        var verified = true;
        diffs.forEach(function(diff) {
            if (!diff.equal) {
                grunt.log.warn('Test screenshot ' + diff.file_a + ' is different to verified screenshot ' + diff.file_b);
                verified = false;
            }
        });
        if (!verified) {
            grunt.log.error('Please verify the screenshot differences and \'grunt screenshot_replace\', or fix the bugs :-)');
        }
        return verified;
    });

    grunt.registerTask('screenshot_verify_new', 'Verify that there are no new screenshots.', function() {
        var verified = true;
        var files = grunt.file.expand('screenshot/*-v2.*');
        if (!grunt.file.exists('screenshot/v2-v1-diff.json')) {
            files.each(function(file) {
                grunt.log.error('Test screenshot ' + file + ' is new');
                verified = false;
            });
        } else {
            var diffs = grunt.file.readJSON('screenshot/v2-v1-diff.json');
            files.forEach(function(file) {
                found = false;
                diffs.forEach(function(diff) {
                    if ('screenshot/' + diff.file_b === file.toString()) {
                        found = true;
                    }
                });
                if (!found) {
                    grunt.log.error('Test screenshot ' + files[j] + ' is new');
                    verified = false;
                }
            });
        }
        if (!verified) {
            grunt.log.error('Please verify the new screenshots and \'grunt screenshot_add\'');
        }
        return verified;
    });

    grunt.registerTask('screenshot_replace', 'Replace the screenshots.', function() {
        var replaced = false;
        var diffs = grunt.file.readJSON('screenshot/v2-v1-diff.json');
        diffs.forEach(function(diff) {
            if (!diff.equal) {
                grunt.file.copy('screenshot/' + diff.file_b, 'screenshot/' + diff.file_a);
                replaced = true;
                grunt.log.ok('Test screenshot ' + diff.file_b + ' is now the verified screenshot ' + diff.file_a);
            }
        });
        if (replaced) {
            grunt.log.ok('Old screenshots replaced.');
        }
    });

    grunt.registerTask('screenshot_add', 'Add new screenshots.', function() {
        var added = false;
        var files = grunt.file.expand('screenshot/*-v2.*');
        if (!grunt.file.exists('screenshot/v2-v1-diff.json')) {
            files.forEach(function(file) {
                var filename = file.toString().replace(/-v2/, '-v1');
                grunt.file.copy(file, filename);
                grunt.log.ok('Test screenshot ' + file + ' is now the verified screenshot ' + filename);
                added = true;
            });
        } else {
            var diffs = grunt.file.readJSON('screenshot/v2-v1-diff.json');
            files.forEach(function(file) {
                found = false;
                diffs.forEach(function(diff) {
                    if ('screenshot/' + diff.file_b === file.toString()) {
                        found = true;
                    }
                });
                if (!found) {
                    var filename = file.toString().replace(/-v2/, '-v1');
                    grunt.file.copy(file, filename);
                    grunt.log.ok('Test screenshot ' + file + ' is now the verified screenshot ' + filename);
                    added = true;
                }
            });
        }
        if (added) {
            grunt.log.ok('New screenshots added.');
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
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-grunticon');
    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-screenshot-diff');

    grunt.registerTask('default', ['clean:toolkit', 'compass:toolkit', 'jshint', 'requirejs']);
    grunt.registerTask('spy', ['clean:toolkit', 'compass:toolkit', 'jshint', 'requirejs', 'jekyll:build', 'watch']);
    grunt.registerTask('sloppy', ['clean:toolkit', 'compass:toolkit', 'requirejs', 'watch']);
    grunt.registerTask('fonts', ['clean:css', 'clean:fonts', 'svgmin:fonts', 'webfont', 'compass:toolkit']);
    grunt.registerTask('svgs', ['svgmin:icons', 'grunticon']);
    grunt.registerTask('screenshot', ['screenshot_diff', 'screenshot_verify_new', 'screenshot_verify_diff']);
    grunt.registerTask('test', ['mocha', 'screenshot']);
};
