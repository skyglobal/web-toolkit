var detect = require('./detect');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-detect/dist/js/detect.requirejs', [], function() {
        
        return detect;
    });
}