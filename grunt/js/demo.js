if (typeof demo==='undefined') demo={};
demo.main = (function(DisplayCode, menu, tests) {

    function bindEvents() {
        $(document).on('click','.toggler', toggle);
        $(document).on('click','.code-download', showCode);
        $('.sky-form').on('submit', checkDiff);
    }

    function checkDiff(e) {
        e.preventDefault();
        var newRouteDir,
            oldVersion = $('#version').val(),
            newVersion = $('#current-version').text(),
            route = 'http://web-toolkit.global.sky.com',
            routeDir = newRouteDir = '_site/_includes';
        if (location.hostname.indexOf('local')===0){
            route = 'http://'+location.host;
            newRouteDir = '../_includes';
        }
        if (oldVersion.split('.').length<3 || (oldVersion.split('.')[0]<1)){
            $('.sky-form .error').text("The version number is required, and must be '1.0.0' or higher");
        }
        if (parseFloat(oldVersion,10)===1 || (oldVersion.split('.')[0]==='0')){
            oldVersion = '0.6.9';//get lowest version available
        }
        window.toolkit.diff({
            oldRoute: route + '/' + oldVersion + '/' + routeDir,
            newRoute: route + '/' + newVersion + '/' + newRouteDir
        });
    }

    function showCode(e){
        var styled = false;
        var feature = $(this).attr('href').replace('#!lightbox/code-','');
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
        if ($(this).attr('data-docs')){
            featureFiles = $(this).attr('data-docs');
            codeBase = feature;
            route = host + '/' + version + '/' + dir + '/' + codeBase;
            styled = true;
        } else {
            featureFiles = $('a[href*="#' + feature + '"]').attr('data-diff-demos');
            codeBase = $('a[href*="#' + feature + '"]').attr('data-diff');
            route = host + '/' + version + '/' + dir + '/' + codeBase;
        }
        new DisplayCode({
            header: $(this).parent().text().replace($(this).text(),'').trim(),
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
        'demo/tests'], function(displayCode, menu, tests) {
        return demo.main(displayCode, menu, tests);
    });
} else {
    demo.main(demo.displayCode, demo.menu, demo.tests);
}
