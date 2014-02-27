module.exports = {
    // IMPORTANT NOTE:
    // grunt-mocha-screenshot is grunt-mocha with screenshotting support
    // so if grunt-mocha needs to be updated, merge (pull) grunt-mocha-screenshot
    all : ['_site/test-without-coverage.html'],
    options : {
        reporter: 'Spec'
    }
};