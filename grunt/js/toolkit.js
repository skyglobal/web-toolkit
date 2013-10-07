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
                skycons : true,
                share : true,
                popup : true
            }, options);
            for (module in modulesToInitialize) {
                if (modulesToInitialize[module] && toolkit[module] && toolkit[module].init) {
                    toolkit[module].init(modulesToInitialize[module])
                }
            }
        }

        return {
            init: init
        }
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
        'modules',
        'modules/tabs',
        'modules/share',
        'modules/carousel'], function(skycons, hashmanager, popup, modules, tabs, share, carousel){


        return {
            modules: modules,
            skycons: skycons,
            hashmanager: hashmanager,
            popup: popup,
            tabs: tabs,
            share: share,
            carousel: carousel
        };
    });
}