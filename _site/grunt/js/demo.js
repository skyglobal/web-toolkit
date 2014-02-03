if (typeof demo==='undefined') demo={};
demo.main = (function(DisplayCode, menu, tests, skycons, hash) {

    function bindEvents() {
        hash.register('code/*',showCode);
    }

    function showCode(hash){
        var styled = false;
        var $lightboxLink = $('a[href="#!' + hash + '"]');
        var feature = hash.replace(/code\//g,'');
        var version = $('#current-version').text(),
            host = 'http://web-toolkit.global.sky.com',
            dir = '_site/_includes';
        if (location.hostname.indexOf('local')===0){
            host = 'http://' + location.host;
            dir = '../_includes';
        } else if (document.location.host === "skyglobal.github.io"){
            host = 'http://skyglobal.github.io/web-toolkit',
            dir = '../_includes';
        }
        var featureFiles, codeBase, route;
        if ($lightboxLink.attr('data-docs')){
            featureFiles = $lightboxLink.attr('data-docs');
            codeBase = feature;
            route = host + '/' + version + '/' + dir + '/' + codeBase;
            styled = true;
        } else {
            featureFiles = $('a[href*="#' + feature + '"]').attr('data-diff-demos');
            codeBase = $('a[href*="#' + feature + '"]').attr('data-diff');
            route = host + '/' + version + '/' + dir + '/' + codeBase;
        }
        new DisplayCode({
            header: $lightboxLink.parent().text().replace($lightboxLink.text(),'').trim(),
            feature: feature,
            dir: route,
            fileNames: featureFiles.split(','),
            styled: styled
        });
    }

    function toggle(){
        var $toggler = $(this);
        var $example = $('div[data-toggle=' + $toggler.attr('for') + ']');
        if ($example.hasClass('open')){
            $toggler.removeClass('open');
            $example.removeClass('open');
        } else {
            $toggler.addClass('open');
            $example.addClass('open');
        }
    }

    bindEvents();

});

if (typeof window.define === "function" && window.define.amd){
    define('demo', ['demo/displayCode',
        'demo/menu',
        'demo/tests',
        'demo/skycons',
        'utils/hashManager'], function(displayCode, menu, tests, skycons, hashManager) {
        return demo.main(displayCode, menu, tests, skycons, hashManager);
    });
} else {
    demo.main(demo.displayCode, demo.menu, demo.tests, demo.skycons, toolkit.hashManager);
}
