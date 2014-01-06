require(['toolkit'], function(toolkit){
    var touch = toolkit.detect.touch();
    $('#touch-demo').text(touch);
});