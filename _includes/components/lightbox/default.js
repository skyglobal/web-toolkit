if (window.require){
    require(['toolkit'], function(toolkit){
        $('#lightbox-demo-link').lightbox();
    });
} else {
    $('#lightbox-demo-link').lightbox();
}