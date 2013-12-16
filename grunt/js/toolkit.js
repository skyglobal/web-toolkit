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
        'modules',
        'modules/inPageNav',
        'modules/accordion',
        'modules/datePicker',
        'modules/validation',
        'modules/share',
        'modules/video',
        'modules/carousel'], function(skycons, hashmanager, popup,toggle, diff, modules, inPageNav, accordion, datePicker, validation, share, video, carousel){

        return {
            modules: modules,
            skycons: skycons,
            hashmanager: hashmanager,
            popup: popup,
            diff: diff,
            inPageNav: inPageNav,
            accordion: accordion,
            datePicker: datePicker,
            validation: validation,
            share: share,
            video: video,
            carousel: carousel
        };
    });
}