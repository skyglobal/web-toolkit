var utils = require('./utils');
var timeout = { resize: null };
NodeList.prototype.isNodeList = HTMLCollection.prototype.isNodeList = true;

function bindEvents() {
    on(window, 'resize', initResizeEnd);
}

function initResizeEnd() {
    clearTimeout(timeout.resize);
    timeout.resize = setTimeout(function triggerResizeEnd() {
        trigger(window, 'resizeend'); // raw JS version
        if (typeof $ !== 'undefined') {
            $(window).trigger('resizeend'); // jQuery version
        }
    }, 200);
}


function on(el, eventName, eventHandler, useCapture){
    if (el.isNodeList){
        Array.prototype.forEach.call(el, function(element, i){
            utils.on(element, eventName, eventHandler, useCapture)
        });
    } else {
        utils.on(el, eventName, eventHandler, useCapture);
    }
}

function off(el, eventName, eventHandler, useCapture) {
    if (el.isNodeList){
        Array.prototype.forEach.call(el, function(element, i){
            utils.off(element, eventName, eventHandler, useCapture)
        });
    } else {
        utils.off(el, eventName, eventHandler, useCapture)
    }
}

function trigger(el, eventName) {
    var event;
    if (document.createEvent) {
        event = document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
        event.initCustomEvent(eventName, false, false, null);
        el.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        el.fireEvent('on' + eventName, event);
    }
}

function ready(exec) {
    if (/in/.test(document.readyState)) {
        setTimeout(function () {
            ready(exec);
        }, 9);
    } else {
        exec();
    }
}

function live(events, selector, eventHandler){
    events.split(' ').forEach(function(eventName){
        utils.attachEvent(eventName, selector, eventHandler);
    });
}

bindEvents();

module.exports = {
    live: live,
    on: on,
    off: off,
    emit: trigger, //deprecate me
    trigger: trigger,
    ready: ready
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.event = module.exports;
