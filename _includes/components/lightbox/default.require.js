require(['toolkit'], function(toolkit){
    $('#lightbox-demo-link').lightbox({
        onShow: function(){ //optional hook
            $('[data-function=carousel]').trigger("pause");
            $('#lightbox-demo').trigger('my-lightbox-opened');
        }, onClose: function(){ //optional hook
            $('#lightbox-demo').trigger('my-lightbox-closed');
        }
    });
});