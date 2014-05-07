module.exports = {
    options: {
        reporter: 'Spec',
        logErrors: true // get test run to fail if browser throws any JS errors
    },
    amd: {
        src: ['_site/test-without-coverage.html']
    },
    global: {
        src: ['_site/test-global.html'],
        options: {
            run: true
        }
    }
};
