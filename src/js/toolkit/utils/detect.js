if (typeof toolkit==='undefined') toolkit={};
toolkit.detect = (function (event) {
    "use strict";

    var state = {
        css : {}
    };

    var html = document.documentElement;
    var toolkitClasses = ["no-touch", "touch-device", "mobile-view", "desktop-view", "landscape", "portrait"];
    var vendorPrefix = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];

    var touchClasses = { hasNot: toolkitClasses[0], has: toolkitClasses[1] };
    var viewClasses = { mobile:toolkitClasses[2], desktop:toolkitClasses[3] };
    var orientationClasses = { landscape: toolkitClasses[4], portrait: toolkitClasses[5] };

    function bindEvents(){
        event.on(window,'resize', updateDetectionStates);
    }


    function updateDetectionStates(){
        removeClasses();
        attachClasses();
    }

    function removeClasses(){
        var arrClasses = html.className.split(' ');
        for (var i in toolkitClasses){
            var indexToRemove = arrClasses.indexOf(toolkitClasses[i]);
            if (indexToRemove > -1) {
                arrClasses.splice(indexToRemove,1);
            }
        }
        html.className = arrClasses.join(' ');
    }

    function attachClasses(){
        var arrClasses = html.className.split(' ');
        arrClasses.push(touch() ? touchClasses.has : touchClasses.hasNot);
        arrClasses.push(view('mobile') ? viewClasses.mobile : viewClasses.desktop);
        arrClasses.push(orientation('landscape') ? orientationClasses.landscape : orientationClasses.portrait);
        html.className = arrClasses.join(' ');
    }

    function support3D() {
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
        state.css.support3D = (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        return state.css.support3D;
    }

    function supportsPseudo(){
//        if (state.css.pseudo){ return state.css.pseudo; }
        var body = document.body || document.documentElement,
            paraBefore = document.createElement('p'),
            styleBefore = document.createElement('style'),
            heightBefore,
            selectorsBefore = '#testbefore:before { content: "before"; }';
        styleBefore.type = 'text\/css';
        paraBefore.id = 'testbefore';

        if (styleBefore.styleSheet) {
            styleBefore.styleSheet.cssText = selectorsBefore;
        } else {
            styleBefore.appendChild(document.createTextNode(selectorsBefore));
        }

        body.appendChild(styleBefore);
        body.appendChild(paraBefore);
        heightBefore = document.getElementById('testbefore').offsetHeight;
        body.removeChild(styleBefore);
        body.removeChild(paraBefore);

        state.css.pseudo =(heightBefore >= 1);
        return state.css.pseudo;
    }

    function pseudo(el, pos, property){
        if (!el){ return supportsPseudo(); }
        if (!window.getComputedStyle) { return false; }
        var css = window.getComputedStyle(el, ':' + pos);
        var str = css.getPropertyValue(property);
        if (str && (str.indexOf("'")===0 || str.indexOf('"')===0)){
            str = str.substring(1,str.length-1);
        }
        return str;
    }

    function getHtmlPseudo(pos){
        var content = pseudo(html, pos, 'content');
        var fontFamily = pseudo(html, pos, 'font-family');
        return (content && content!='normal') ? content : fontFamily;
    }

    function supportsCSS(property){
        if (state.css[property]) { return state.css[property]; }
        if (property === 'support3D' ){
            return support3D(property);
        }
        var style = html.style;
        if(typeof style[property] == 'string') {
            state.css[property] = true;
            return true;
        }
        property = property.charAt(0).toUpperCase() + property.substr(1);
        for(var i=0; i<vendorPrefix.length; i++) {
            if(typeof style[vendorPrefix[i] + property] == 'string') {
                state.css[property] = true;
                return state.css[property];
            }
        }
        state.css[property] = false;
        return state.css[property];
    }

    function css(el, property){
        if (!property){ return supportsCSS(el); }
        var strValue = "";
        if(document.defaultView && document.defaultView.getComputedStyle){
            strValue = document.defaultView.getComputedStyle(el, "").getPropertyValue(property);
        } else if(el.currentStyle){
            property = property.replace(/\-(\w)/g, function (strMatch, p1){
                return p1.toUpperCase();
            });
            strValue = el.currentStyle[property];
        }
        return strValue;
    }

    function view(type){
        state.view = getHtmlPseudo('after') || 'desktop';
        return (type) ? state.view == type : state.view ;
    }

    function orientation(type){
        state.orientation = getHtmlPseudo('before') || 'landscape';
        return (type) ? state.orientation == type : state.orientation;
    }

    function touch(){
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

        var elementOffset =  getElementOffset(el);
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        return (elementOffset.top + el.offsetHeight <= scrollTop + document.documentElement.clientHeight);
    }

    function elementVisibleRight(el) {
        if (el.length < 1)
            return;
        var elementOffset =  getElementOffset(el);
        return (elementOffset.left + el.offsetWidth <= document.documentElement.clientWidth);
    }

    attachClasses();
    bindEvents();

    return {
        css: css,
        touch: touch,
        orientation: orientation,
        view: view,
        pseudo: pseudo,
        state: state,
        elementVisibleBottom: elementVisibleBottom,
        elementVisibleRight: elementVisibleRight,
        updateDetectionStates: updateDetectionStates //just expose this while phantomJS doesnt understand event.emit(window,'resize');
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/detect', ['utils/event'], function(event) {
        'use strict';
        toolkit.detect = toolkit.detect(event);
        return toolkit.detect;
    });
} else {
    toolkit.detect = toolkit.detect(toolkit.event);
}