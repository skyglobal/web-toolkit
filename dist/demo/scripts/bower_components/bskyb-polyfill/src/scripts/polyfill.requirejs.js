var polyfill = require('./polyfill');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-polyfill/dist/scripts/polyfill.requirejs', [], function() {
        'use strict';
        return polyfill;
    });
}