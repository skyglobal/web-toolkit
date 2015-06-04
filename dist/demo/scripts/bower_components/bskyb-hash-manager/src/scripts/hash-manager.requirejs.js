var local = {}; local['hash-manager'] = require('./hash-manager');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-hash-manager/dist/scripts/hash-manager.requirejs', [], function() {
        'use strict';
        return local['hash-manager'];
    });
}