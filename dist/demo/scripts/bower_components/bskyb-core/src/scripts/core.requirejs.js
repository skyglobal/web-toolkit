var local = {}; local['core'] = require('./core');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-core/dist/scripts/core.requirejs', [], function() {
        'use strict';
        return local['core'];
    });
}