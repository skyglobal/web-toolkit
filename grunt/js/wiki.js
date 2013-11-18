define('wiki', ['utils/developer-notes-logger', 'toolkit'], function(logger, toolkit) {

    function bindEvents(){
        $(document).on('click','.toggler', toggle);
        $('#check').on('click', checkDiff);
    }

    function checkDiff(e){
        e.preventDefault();
        var oldVersion = $('#version').val(),
            newVersion = $('.wiki-header small').text().replace('v',''),
            route = 'http://web-toolkit.global.sky.com';
        if (oldVersion.split('.').length<3 || (oldVersion.split('.')[0]<1)){
            $('.sky-form .error').text("The version number is required, and must be '1.0.0' or higher");
        }
        if (parseFloat(oldVersion,10)===1 || (oldVersion.split('.')[0]==='0')){
            oldVersion = '0.6.9';//get lowest version available
        }
        toolkit.diff({
            oldRoute: route + '/' + oldVersion + '/_site/_includes/',
            newRoute: route + '/' + newVersion + '/_site/_includes/'
        });
    }

    function initModuleDemos(){
        $('#hero').skycom_carousel({
            carousel: {
                autoplay: true,
                videoAds: false
            }
        });
        $('#hero-skinny').skycom_carousel({
            carousel: {
                autoplay: true,
                videoAds: false
            }
        });
        $('#demo-classc-tabs').inPageNav();
        $('#demo-inpage-nav-tabs').inPageNav();
        toolkit.modules.init();
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

    logger();
    initModuleDemos();
    bindEvents();

});