module.exports =  {
        gruntfile: {
            files: 'Gruntfile.js',
            tasks: ['build']
        },
        'js': {
            files: [ 'src/js/**/*.js' ],
            tasks: ['jshint','requirejs:toolkit','jekyll:build']
        },
        'scss': {
            files: [ 'src/sass/**/*.scss'],
            tasks: ['compass', 'jekyll:build']
        },
        'jekyll': {
            files: [ '_includes/**/*', '_layouts/**/*', '_data/**/*', '*.html', '_config.yml', 'test/libraries/*.js','test/*' ],
            tasks: ['jekyll:build']
        },
        'specs': {
            files: ['test/specs/*.js','test/config.js'],
            tasks: ['jekyll:build'] //'jshint',
        }
};