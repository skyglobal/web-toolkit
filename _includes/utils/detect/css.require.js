require(['toolkit'], function(toolkit){

    function updateDetectCSS(toolkit){
        var transition = toolkit.detect.css('transition');
        var support3D = toolkit.detect.css('support3D');
        var transform = toolkit.detect.css('transform');
        $('#css-demo-transition').text(transition);
        $('#css-demo-support3D').text(support3D);
        $('#css-demo-transform').text(transform);
    }

    updateDetectCSS(toolkit);
});