if (typeof toolkit==='undefined') toolkit={};
toolkit.event = (function (detect) {
    "use strict";
    var timeout = {
        resize : null
    };
    var state = {    };
    var browserSpecificEvents = {
        'transitionend' : check('transition','end'),
        'animationend' : check('animation','end')
    };

    function capitalise(str){
        return str.replace(/\b[a-z]/g, function() {return arguments[0].toUpperCase();});
    }

    function check(eventName, type){
        var result = false,
            eventType = eventName.toLowerCase() + type.toLowerCase(),
            eventTypeCaps = capitalise(eventName.toLowerCase()) + capitalise(type.toLowerCase());
        if (state[eventType]){ return state[eventType]; }
        if('on' + eventType in window) {
            result = eventType;
        } else if('onwebkit' + eventType in window) {
            result = 'webkit' + eventTypeCaps;
        } else if('ono' + eventType in document.documentElement) {
            result = 'o' + eventTypeCaps;
        }
        return result;
    }

    function bindEvents(){
        on(window,'resize',function(){
            clearTimeout(timeout.resize);
            timeout.resize = setTimeout(emitResizeEnd,200);
        });
    }

    function emitResizeEnd(){
        emit(window,'resizeend'); // raw JS version
        $(window).trigger('resizeend'); // jQuery version
    }

    function on(el, eventName, exec){
        var browserSpecificEventName = browserSpecificEvents[eventName.toLowerCase()];
        eventName = browserSpecificEventName ||  eventName;
        if (el.addEventListener) {
            el.addEventListener(eventName, exec, false);
        } else {
            el.attachEvent(eventName, exec);
        }
    }

    function emit(el, eventName) {
        var event;
        if (document.createEvent) {
            event = new Event(eventName);
            el.dispatchEvent(event);
        } else {
            event = document.createEventObject();
            el.fireEvent('on' + eventName, event);
        }
    }

    function ready(exec){
        if (/in/.test(document.readyState)){
            setTimeout(function(){ ready(exec); },9);
        } else {
            exec();
        }
    }

    bindEvents();

    return {
        on: on,
        emit: emit,
        ready: ready
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/event', ['utils/detect'], function(detect) {
        'use strict';
        return toolkit.event(detect);
    });
} else {
    toolkit.event = toolkit.event(toolkit.detect);
}