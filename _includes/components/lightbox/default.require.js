require(['toolkit'], function(toolkit){
    //JS for default lightbox
    $('#lightbox-demo-link').lightbox();

    //JS for default lightbox with callbacks (onShow and onClose)
    $('#lightbox-demo-link-with-callbacks').lightbox({
        onShow: function(){
            $('[data-function=carousel]').trigger("pause");
            $('#lightbox-demo-with-callbacks').trigger('my-lightbox-opened');
        }, onClose: function(){
            $('#lightbox-demo-with-callbacks').trigger('my-lightbox-closed');
        }
    });

});