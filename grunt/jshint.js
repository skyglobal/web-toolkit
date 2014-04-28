module.exports = {
//        all: ['Gruntfile.js', 'app/src/js/**/*.js', 'test/spec/**/*.js'],
        all: ['Gruntfile.js', 'app/src/js/toolkit/**/*.js'],
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
