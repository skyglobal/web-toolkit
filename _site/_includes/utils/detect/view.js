function updateView(toolkit){
    var view = toolkit.detect.view();
    var desktop = toolkit.detect.view('desktop');
    var mobile = toolkit.detect.view('mobile');
    $('#view-demo').text(view);
    $('#view-demo-is-desktop').text(desktop);
    $('#view-demo-is-mobile').text(mobile);
}

if (window.require){
    require(['toolkit'], function(toolkit){
        $(window).on('resize',function(){updateView(toolkit);});
        updateView(toolkit);
    });
} else {
    $(window).on('resize',function(){updateView(toolkit);});
    updateView(toolkit);
}