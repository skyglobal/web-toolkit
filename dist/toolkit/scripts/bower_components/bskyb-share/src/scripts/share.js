var core = require('../../bower_components/bskyb-core/src/scripts/core');
var event = core.event;

function getElementOffset(el) {
    return {
        top: el.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop,
        left: el.getBoundingClientRect().left + window.pageXOffset - document.documentElement.clientLeft
    };
}

function elementVisibleBottom(el) {
    var elementOffset = getElementOffset(el);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    return (elementOffset.top + el.offsetHeight <= scrollTop + document.documentElement.clientHeight);
}

function elementVisibleRight(el) {
    var elementOffset = getElementOffset(el);
    return (elementOffset.left + el.offsetWidth <= document.documentElement.clientWidth);
}

function addClass(el, className){
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
}

function removeClass(el, className){
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}

function toggleClass(el, className, force){
    if (force === true){
        return addClass(el, className);
    } else if (force === false){
        return removeClass(el, className);
    } else if (el.classList) {
        return el.classList.toggle(className);
    }

    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0){
        return removeClass(el, className);
    } else if (existingIndex <0) {
        return addClass(el, className);
    }
}

function contains(el, child){
    return el !== child && el.contains(child);
}

function matches(el, selector){
    /* istanbul ignore next | browser specific code hard to test in phantom! */
    var fn = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    if (!fn)  { //no 'matches' on document.documentElement
        return;
    }
    return fn.call(el, selector);
}

function parent(el, selector) {
    var p = el.parentNode;
    while (!matches(p, selector) && p!==null) {
        p = p.parentNode;
    }
    return p;
}


function toggleSharePopover(e) {
    e.preventDefault();
    var section = parent(this, '.share__popup'),
        popover = section.getElementsByClassName('share__list'),
        triggerEvents = 'keypress touchend click';
    if(e.type === 'click' || e.type === 'touchend' || (e.type === 'keypress' && e.which === 13)) {
        toggleClass(section, 'share__popup--active');
        toggleClass(popover[0], "share__list--left", !elementVisibleRight(popover[0]));
        toggleClass(popover[0], "share__list--top", !elementVisibleBottom(popover[0]));

        event.on(document.documentElement, triggerEvents, function hidePopover(e) {
            if(contains(section, e.target)) { return; }
            removeClass(section, 'share__popup--active');
            event.off(document, triggerEvents, hidePopover);
        });
    }
}


function popupLink(e) {
    e.preventDefault();
    var url = (this.tagName === 'A') ? this : parent(this, 'a').getAttribute('href');
    var width = 626;
    var height = 436;
    var top = (screen.height/2)-(height/2);
    var left = (screen.width/2)-(width/2);
    var windowTitle = 'Sky';
    return window.open(url, windowTitle, 'top=' + top + ',left=' + left + ',width=' + width + ',height='+ height);
}

function bindEvents() {
    event.live('click', '.share__summary', toggleSharePopover);
    event.live('click', '.share__social-link', popupLink);
}

bindEvents();

module.exports = {
    init: bindEvents,
    _toggleSharePopover: toggleSharePopover,
    _toggleClass: toggleClass,
    _popupLink: popupLink
};

/* istanbul ignore if */
if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.share = module.exports;