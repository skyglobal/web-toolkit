if (typeof toolkit==='undefined') toolkit={};
toolkit.main = (function() {

    function bindEvents() {
        var addWindowLoadClass = function() { $(document.body).addClass('window-loaded');},
            windowLoadTimeout = setTimeout(addWindowLoadClass, 5000);

        $(window).load(function() {
            clearTimeout(windowLoadTimeout);
            addWindowLoadClass();
        });
    }

    bindEvents();

}());

toolkit.modules = (function(){

    var init =function(options) {
        var module;
        var modulesToInitialize = $.extend({
            skycons : false,
            share : false,
            popup : false,
            inPageNav : false,
            accordion : false,
            lightbox : false,
            datePicker : false
        }, options);
        for (module in modulesToInitialize) {
            if ((modulesToInitialize[module] || !options ) && toolkit[module] && toolkit[module].init) {
                toolkit[module].init();
            }
        }
    };

    return {
        init: init
    };
})();

if (typeof window.define === "function" && window.define.amd) {
    define('modules', [], function() {
        return toolkit.modules;
    });
}

if (typeof window.define === "function" && window.define.amd) {
//    explicitly call all js files here to ensure all files are available
    define('toolkit',[
        'utils/skycons',
        'utils/hashmanager',
        'utils/popup',
        'utils/toggle',
        'utils/diff',
        'utils/focus',
        'modules',
        'modules/inPageNav',
        'modules/accordion',
        'modules/datePicker',
        'modules/validation',
        'modules/lightbox',
        'modules/share',
        'modules/tooltip',
        'modules/video',
        'modules/carousel'], function(skycons, hashmanager, popup,toggle, diff, focus, modules, inPageNav, accordion, datePicker, validation, lightbox, share, tooltip, video, carousel){

        return {
            modules: modules,
            skycons: skycons,
            hashmanager: hashmanager,
            popup: popup,
            diff: diff,
            focus: focus,
            inPageNav: inPageNav,
            accordion: accordion,
            datePicker: datePicker,
            validation: validation,
            lightbox: lightbox,
            share: share,
            tooltip: tooltip,
            video: video,
            carousel: carousel
        };
    });
}