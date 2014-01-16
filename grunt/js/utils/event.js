if (typeof toolkit==='undefined') toolkit={};
toolkit.event = (function () {
    "use strict";

    var resize = null;

    function bindEvents(){
        on(window,'resize',function(){
            clearTimeout(resize);
            resize = setTimeout(emitResizeEnd,200);
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

    bindEvents();

    return {
        on: on,
        emit: emit
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