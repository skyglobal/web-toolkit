if (typeof toolkit==='undefined') toolkit={};
toolkit.event = (function () {
    "use strict";

    var timeout = {
        resize : null
    };

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
    define('utils/event', [], function() {
        'use strict';
        return toolkit.event();
    });
} else {
    toolkit.event = toolkit.event();
}