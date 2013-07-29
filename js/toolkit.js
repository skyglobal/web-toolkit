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