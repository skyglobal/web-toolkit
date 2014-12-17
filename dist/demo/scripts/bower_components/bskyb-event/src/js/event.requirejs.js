var event = require('./event');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-event/dist/js/event.requirejs', [], function() {
        
        return event;
    });
}