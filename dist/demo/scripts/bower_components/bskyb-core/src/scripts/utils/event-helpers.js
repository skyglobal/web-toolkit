var eventRegistry = {};
var state = {    };
var browserSpecificEvents = {
    'transitionend': 'transition',
    'animationend': 'animation'
};
NodeList.prototype.isNodeList = HTMLCollection.prototype.isNodeList = true;

function capitalise(str) {
    return str.replace(/\b[a-z]/g, function () {
        return arguments[0].toUpperCase();
    });
}

function check(eventName) {
    var type = '';
    if (browserSpecificEvents[eventName]){
        eventName =  browserSpecificEvents[eventName];
        type = 'end';
    }
    var result = false,
        eventType = eventName.toLowerCase() + type.toLowerCase(),
        eventTypeCaps = capitalise(eventName.toLowerCase()) + capitalise(type.toLowerCase());
    if (state[eventType]) {
        return state[eventType];
    }
    ['ms', 'moz', 'webkit', 'o', ''].forEach(function(prefix){
        if (('on' + prefix + eventType in window) ||
            ('on' + prefix + eventType in document.documentElement)) {
            result = (!!prefix) ? prefix + eventTypeCaps : eventType;
        }
    });
    state[eventType] = result;
    return result;
}

function dispatchEvent(el, eventName){
    eventName = check(eventName) || eventName;
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

function addEventListener(el, eventName, eventHandler, useCapture){
    eventName = check(eventName) || eventName;
    if (el.addEventListener) {
        el.addEventListener(eventName, eventHandler, !!useCapture);
    } else {
        el.attachEvent('on' + eventName, eventHandler);
    }
}

function removeEventListener(el, eventName, eventHandler){
    eventName = check(eventName) || eventName;
    if (el.removeEventListener) {
        el.removeEventListener(eventName, eventHandler, false);
    } else {
        el.detachEvent('on' + eventName, eventHandler);
    }
}

function dispatchLiveEvent(event) {
    var targetElement = event.target;

    eventRegistry[event.type].forEach(function (entry) {
        var potentialElements = document.querySelectorAll(entry.selector);
        var hasMatch = false;
        Array.prototype.forEach.call(potentialElements, function(el){
            if (el.contains(targetElement) || el === targetElement){
                hasMatch = true;
                return;
            }
        });

        if (hasMatch) {
            entry.handler.call(targetElement, event);
        }
    });

}

function attachEvent(eventName, selector, eventHandler){
    if (!eventRegistry[eventName]) {
        eventRegistry[eventName] = [];
        addEventListener(document.documentElement, eventName, dispatchLiveEvent, true);
    }

    eventRegistry[eventName].push({
        selector: selector,
        handler: eventHandler
    });
}


module.exports = {
    dispatchEvent: dispatchEvent,
    attachEvent: attachEvent,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
};