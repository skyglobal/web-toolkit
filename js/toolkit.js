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
    define([
        'utils/hashmanager',
        'modules/tabs',
        'modules/carousel'], function(hashmanager, tabs, carousel){


        return {
            hashmanager: hashmanager,
            tabs: tabs,
            carousel: carousel
        };
    });
}