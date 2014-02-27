module.exports = {
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
};