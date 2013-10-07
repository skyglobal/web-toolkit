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

toolkit = (function(skycons, hashmanager, popup, tabs, share, carousel){

    function init(options) {
        var module;
        var modules = $.extend({
            skycons : true,
            share : true,
            popup : true
        }, options);
        console.log(this);
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
}(toolkit.skycons, toolkit.hashmanager, toolkit.popup, toolkit.tabs, toolkit.share, toolkit.carousel));


if (typeof window.define === "function" && window.define.amd) {
//    explicitly call all js files here to ensure all files are available
    define('toolkit',[
        'utils/skycons',
        'utils/hashmanager',
        'utils/popup',
        'modules/tabs',
        'modules/share',
        'modules/carousel'], function() {
            return toolkit
        });
}