module.exports = function(grunt){
    var pkg = grunt.file.readJSON('package.json');
    return {
        options: {
            banner: '/*! ' + pkg.name + ' - v' + pkg.version + ' - ' +
                grunt.template.today("yyyy-mm-dd") + ' */\n'
        },
        min: {
            files: {
                'dist/scripts/toolkit.min.js': ['dist/scripts/toolkit/main.js']
            }
        },
        beauty: {
            options:{
              beautify: true,
              mangle: false,
              compress: false
            },
            files: {
                'dist/scripts/toolkit.js': ['dist/scripts/toolkit/main.js']
            }
        }
    };
};
