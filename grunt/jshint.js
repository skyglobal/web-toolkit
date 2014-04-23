module.exports = {
        toolkit: ['Gruntfile.js',
                  'app/src/js/components/*.js',
                  'app/src/js/utils/*.js',
                  'app/src/js/demo/*.js'],
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
