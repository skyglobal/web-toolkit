require(['toolkit'], function(toolkit){

    function updateOrientation(toolkit){
        var orientation = toolkit.detect.orientation();
        var isPortrait = toolkit.detect.orientation('portrait');
        var isLandscape = toolkit.detect.orientation('landscape');
        $('#orientation-demo').text(orientation);
        $('#orientation-demo-is-landscape').text(isLandscape);
        $('#orientation-demo-is-portrait').text(isPortrait);
    }

    $(window).on('resize',function(){updateOrientation(toolkit);});
    updateOrientation(toolkit);
});