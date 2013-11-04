define('wiki', ['utils/developer-notes-logger', 'utils/diff', 'toolkit'], function(logger, diff, toolkit) {

    function bindEvents(){
        $(document).on('click','.toggler', toggle);
    }

    function initModuleDemos(){
        $('#hero').skycom_carousel({
            carousel: {
                autoplay: true,
                videoAds: false
            }
        });
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