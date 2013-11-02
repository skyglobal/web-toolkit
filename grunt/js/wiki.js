define('wiki', ['utils/developer-notes-logger', 'utils/diff', 'toolkit'], function(logger, diff, toolkit) {

    function initModuleDemos(){
        $('#hero').skycom_carousel({
            carousel: {
                autoplay: true,
                videoAds: false
            }
        });
        toolkit.modules.init();
    }


    logger();
    initModuleDemos();

});