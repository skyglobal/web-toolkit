var state = { css: {} };
var html = document.documentElement;
var toolkitClasses = ["no-touch", "touch-device"];
var vendorPrefix = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
var classes = { hasNot: toolkitClasses[0], has: toolkitClasses[1] };

function attachClasses() {
    var arrClasses = html.className.split(' ');
    arrClasses.push(touch() ? classes.has : classes.hasNot);
    html.className = arrClasses.join(' ');
}

function translate3d() {
    var transforms = {
            'webkitTransform': '-webkit-transform',
            'OTransform': '-o-transform',
            'msTransform': '-ms-transform',
            'MozTransform': '-moz-transform',
            'transform': 'transform'
        },
        body = document.body || document.documentElement,
        has3d,
        div = document.createElement('div'),
        t;
    body.insertBefore(div, null);
    for (t in transforms) {
        if (transforms.hasOwnProperty(t)) {
            if (div.style[t] !== undefined) {
                div.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(div).getPropertyValue(transforms[t]);
            }
        }
    }
    body.removeChild(div);
    state.css.translate3d = (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    return state.css.translate3d;
}

function supportsCSS(property) {
    if (state.css[property]) {
        return state.css[property];
    }
    if (property === 'translate3d') {
        return translate3d(property);
    }
    var style = html.style;
    if (typeof style[property] == 'string') {
        state.css[property] = true;
        return true;
    }
    property = property.charAt(0).toUpperCase() + property.substr(1);
    for (var i = 0; i < vendorPrefix.length; i++) {
        if (typeof style[vendorPrefix[i] + property] == 'string') {
            state.css[property] = true;
            return state.css[property];
        }
    }
    state.css[property] = false;
    return state.css[property];
}

function css(el, property) {
    if (!property) {
        return supportsCSS(el);
    }
    var strValue = "";
    if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView.getComputedStyle(el, "").getPropertyValue(property);
    } else if (el.currentStyle) {
        property = property.replace(/\-(\w)/g, function (strMatch, p1) {
            return p1.toUpperCase();
        });
        strValue = el.currentStyle[property];
    }
    return strValue;
}

function touch() {
    state.touch = (typeof window.ontouchstart !== "undefined");
    return state.touch;
}

function getElementOffset(el) {
    return {
        top: el.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop,
        left: el.getBoundingClientRect().left + window.pageXOffset - document.documentElement.clientLeft
    };
}

function elementVisibleBottom(el) {
    if (el.length < 1)
        return;
    var elementOffset = getElementOffset(el);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    return (elementOffset.top + el.offsetHeight <= scrollTop + document.documentElement.clientHeight);
}

function elementVisibleRight(el) {
    if (el.length < 1)
        return;
    var elementOffset = getElementOffset(el);
    return (elementOffset.left + el.offsetWidth <= document.documentElement.clientWidth);
}

attachClasses();

module.exports = {
    _attachClasses: attachClasses,
    _state: state,
    css: css,
    touch: touch,
    elementVisibleBottom: elementVisibleBottom,
    elementVisibleRight: elementVisibleRight
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.detect = module.exports;