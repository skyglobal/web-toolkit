if (typeof toolkit==='undefined') toolkit={};
toolkit.detect = (function () {
    "use strict";

    var state = {};
    var toolkitClasses = ["no-touch", "touch-device", "mobile-view", "desktop-view", "landscape", "portrait"];
    var touchClasses = { hasNot: toolkitClasses[0], has: toolkitClasses[1] };
    var viewClasses = { mobile:toolkitClasses[2], desktop:toolkitClasses[3] };
    var orientationClasses = { landscape: toolkitClasses[4], portrait: toolkitClasses[5] };
    var $window = $(window);

    function bindEvents(){
        $(window).bind('resize', updateDetectionStates);
    }

    function pseudo(el, pos){
        if (!window.getComputedStyle) { return false; }
        var css = window.getComputedStyle(el, ':' + pos);
        var str = (css.getPropertyValue('content') && css.getPropertyValue('content')!='normal') ? css.getPropertyValue('content') : css.getPropertyValue('font-family');
        return (str)? str.replace(/"/g,'').replace(/'/g,'') : '';
    }

    function view(type){
        var html = document.getElementsByTagName('html')[0];
        state.view = pseudo(html,'after') || 'desktop';
        return (type) ? state.view == type : state.view ;
    }

    function orientation(type){
        var html = document.getElementsByTagName('html')[0];
        state.orientation = pseudo(html, 'before') || 'landscape';
        return (type) ? state.orientation == type : state.orientation;
    }

    function touch(){
        state.touch = (!!window.ontouchstart);
        return state.touch;
    }

    function updateDetectionStates(){
        removeClasses();
        attachClasses();
    }

    function removeClasses(){
        var arrClasses = document.documentElement.className.split(' ');
        for (var i in toolkitClasses){
            var indexToRemove = arrClasses.indexOf(toolkitClasses[i]);
            if (indexToRemove > -1) {
                arrClasses.splice(indexToRemove,1);
            }
        }
        document.documentElement.className = arrClasses.join(' ');
    }

    function attachClasses(){
        var arrClasses = document.documentElement.className.split(' ');
        arrClasses.push(touch() ? touchClasses.has : touchClasses.hasNot);
        arrClasses.push(view('mobile') ? viewClasses.mobile : viewClasses.desktop);
        arrClasses.push(orientation('landscape') ? orientationClasses.landscape : orientationClasses.portrait);
        document.documentElement.className = arrClasses.join(' ');
    }

    function elementVisibleBottom(el) {
        if (el.length < 1)
            return;

        var elementOffSet = el.offset();

        return (elementOffSet.top + el.height() <= $window.scrollTop() + $window.height());
    }

    attachClasses();
    bindEvents();

    return {
        touch: touch,
        orientation: orientation,
        view: view,
        pseudo: pseudo,
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