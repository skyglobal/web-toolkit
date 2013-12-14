var lightboxConfig = {onShow: function(){
    $('[data-function=carousel]').trigger("pause");
    $('#lightbox-demo').trigger('my-lightbox-opened');
}, onClose: function(){
   $('#lightbox-demo').trigger('my-lightbox-closed');
}};
if (window.require){
    require(['toolkit'], function(toolkit){
        $('#lightbox-demo-link').lightbox(lightboxConfig);
    });
} else {
    $('#lightbox-demo-link').lightbox(lightboxConfig);
}