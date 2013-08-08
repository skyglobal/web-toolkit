if (typeof toolkit==='undefined') toolkit={};
toolkit.main = (function() {

    function bindEvents(){
        $(window).load(function(){
            $(document.body).addClass('window-loaded');
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