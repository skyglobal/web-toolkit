module.exports =  {
        gruntfile: {
            files: 'Gruntfile.js',
            tasks: ['build']
        },
        'js': {
            files: [ 'app/src/js/**/*.js' ],
            tasks: ['jshint','requirejs:toolkit','jekyll:build']
        },
        'scss': {
            files: [ 'app/src/sass/**/*.scss'],
            tasks: ['compass', 'jekyll:build']
        },
        'jekyll': {
            files: [ 'app/_includes/**/*', 'app/_layouts/**/*', 'app/_data/**/*', 'app/*.html', 'app/_config.yml', 'test/libraries/*.js','test/*' ],
            tasks: ['jekyll:build']
        },
        'specs': {
            files: ['test/specs/*.js','test/config.js'],
            tasks: ['jekyll:build'] //'jshint',
        }
};
