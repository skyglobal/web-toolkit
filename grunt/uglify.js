module.exports = function(grunt){
    var pkg = grunt.file.readJSON('package.json');
    return {
        options: {
            banner: '/*! ' + pkg.name + ' - v' + pkg.version + ' - ' +
                grunt.template.today("yyyy-mm-dd") + ' */\n'
        },
        min: {
            files: {
                'dist/scripts/toolkit.js': ['dist/scripts/toolkit/main.js'],
                'dist/scripts/demo.js': ['dist/scripts/demo/main.js'],
                'dist/scripts/tests.js': ['dist/scripts/tests/main.js'],
                'dist/scripts/changes.js': ['dist/scripts/changes/main.js']
            }
        },
        beauty: {
            options:{
              beautify: true,
              mangle: false,
              compress: false
            },
            files: {
                'dist/scripts/toolkit.js': ['dist/scripts/toolkit/main.js'],
                'dist/scripts/demo.js': ['dist/scripts/demo/main.js'],
                'dist/scripts/tests.js': ['dist/scripts/tests/main.js'],
                'dist/scripts/changes.js': ['dist/scripts/changes/main.js']
            }
        }
    };
};
