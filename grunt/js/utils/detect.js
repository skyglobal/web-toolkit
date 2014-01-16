if (typeof toolkit==='undefined') toolkit={};
toolkit.detect = (function () {
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
    var $window = $(window);

    function bindEvents(){
        $(window).bind('resize', updateDetectionStates);
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

    function support3D(){
        var property = 'transform';
        var style = html.style;
        for(var i=0; i<vendorPrefix.length; i++) {
            style[vendorPrefix[i] + property] = 'translate3D(0,0,0)';
            if (style[vendorPrefix[i] + property] === 'translate3D(0,0,0)'){
                state.css.support3D = true;
                return state.css.support3D;
            }
        }
        state.css.support3D = false;
        return state.css.support3D;
    }

    function supportsPsuedo(){
        var doc = document,
            html = doc.documentElement,
            body = doc.body,
            supportsPseudo = false,
            paraBefore = doc.createElement('p'),
            styleBefore = doc.createElement('style'),
            heightBefore,
            selectorsBefore = '#testbefore:before { content: "before"; }';

        styleBefore.type = 'text\/css';
        paraBefore.id = 'testbefore';

        if (styleBefore.styleSheet) {
            styleBefore.styleSheet.cssText = selectorsBefore;
        } else {
            styleBefore.appendChild(doc.createTextNode(selectorsBefore));
        }

        body.appendChild(styleBefore);
        body.appendChild(paraBefore);

        heightBefore = doc.getElementById('testbefore').offsetHeight;

        if (heightBefore >= 1) {
            supportsPseudo = true;
        }

        body.removeChild(styleBefore);
        body.removeChild(paraBefore);
        return supportsPseudo;
    }

    function getPseudoClass(el, pos){
        if (!window.getComputedStyle) { return false; }
        var css = window.getComputedStyle(el, ':' + pos);
        var str = (css.getPropertyValue('content') && css.getPropertyValue('content')!='normal') ? css.getPropertyValue('content') : css.getPropertyValue('font-family');
        return (str)? str.replace(/"/g,'').replace(/'/g,'') : '';
    }

    function css(property){
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

    function view(type){
        state.view = getPseudoClass(html,'after') || 'desktop';
        return (type) ? state.view == type : state.view ;
    }

    function orientation(type){
        state.orientation = getPseudoClass(html, 'before') || 'landscape';
        return (type) ? state.orientation == type : state.orientation;
    }

    function touch(){
        state.touch = (!!window.ontouchstart);
        return state.touch;
    }

    function elementVisibleBottom($el) {
        if ($el.length < 1) { return; }

        return ($el.offset().top + $el.height() <= $window.scrollTop() + $window.height());
    }

    attachClasses();
    bindEvents();

    return {
        css: css,
        touch: touch,
        orientation: orientation,
        view: view,
        pseudo: getPseudoClass,
        supportsPsuedo: supportsPsuedo,
        state: state,
        elementVisibleBottom: elementVisibleBottom
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/detect', [], function() {
        'use strict';
        return toolkit.detect();
    });
} else {
    toolkit.detect = toolkit.detect();
}