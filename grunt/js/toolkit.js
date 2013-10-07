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


if (typeof window.define === "function" && window.define.amd) {
//    explicitly call all js files here to ensure all files are available
    define('toolkit',[
        'utils/skycons',
        'utils/hashmanager',
        'utils/popup',
        'modules/tabs',
        'modules/share',
        'modules/carousel'], function(skycons, hashmanager, popup, tabs, share, carousel){

        function init(options) {
            var module;
            var modules = $.extend({
                skycons : true,
                share : true,
                popup : true
            }, options);

            for (module in modules) {
                if (modules[module] && this[module] && this[module].init) {
                    this[module].init(modules[module])
                }
            }
        }

        return {
            init: init,
            skycons: skycons,
            hashmanager: hashmanager,
            popup: popup,
            tabs: tabs,
            share: share,
            carousel: carousel
        };
    });
}