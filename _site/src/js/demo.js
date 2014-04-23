if (typeof demo==='undefined') demo={};
demo.main = (function(DisplayCode,ss, menu, tests, skycons, hash, inPageNav) {

    function bindEvents() {
        hash.register('code/*',showCode);
    }

    function showCode(hash){
        var styled = false;
        var $lightboxLink = $('a[href="#!' + hash + '"]');
        var feature = hash.replace(/code\//g,'').replace('/','--').trim();
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
        var $tag = $('a[href*="#' + feature + '"]');
        if (!$tag.length) {
            // probably using-the-toolkit's special case
            $tag = $lightboxLink;
        }
        featureFiles = $tag.attr('data-diff-demos').trim();
        codeBase = $tag.attr('data-diff').trim();
        route = host + '/' + version + '/' + dir + '/' + codeBase;
        new DisplayCode({
            header: $lightboxLink.parent().text().replace($lightboxLink.text(),'').trim(),
            feature: feature,
            dir: route,
            fileNames: featureFiles.replace(/ /g,'').split(','),
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
    define('demo', ['demo/display-code',
        'lib/jquery.scrollspy',
        'demo/menu',
        'demo/tests',
        'utils/hash-manager',
        'components/in-page-nav'], function(displayCode, scrollspy, menu, tests, hashManager, inPageNav) {
        return demo.main(displayCode, scrollspy, menu, tests, hashManager, inPageNav);
    });
} else {
    demo.main(demo.displayCode, scrollspy, demo.menu, demo.tests, toolkit.hashManager, toolkit.inPageNav);
}
