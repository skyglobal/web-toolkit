module.exports = function(grunt){
    var pkg = grunt.file.readJSON('package.json');
    return {
        options: {
            banner: '/*! ' + pkg.name + ' - v' + pkg.version + ' - ' +
                grunt.template.today("yyyy-mm-dd") + ' */\n'
        },
        uglify: {
            files: {
                'dist/scripts/toolkit.min.js': ['dist/toolkit/scripts/toolkit.js']
            }
        },
        beauty: {
            options:{
              beautify: true,
              mangle: false,
              compress: false
            },
            files: {
                'dist/scripts/toolkit.js': ['dist/toolkit/scripts/toolkit.js']
            }
        }
    };
};
