if (window.require){
    require(['toolkit'], function(toolkit){
        var touch = toolkit.detect.touch();
        $('#touch-demo').text(touch);
    });
} else {
    var touch = toolkit.detect.touch();
    $('#touch-demo').text(touch);
}