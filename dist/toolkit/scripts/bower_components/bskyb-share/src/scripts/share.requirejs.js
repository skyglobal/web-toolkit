var share = require('./share');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-share/dist/scripts/share.requirejs', [], function() {
        'use strict';
        return share;
    });
}