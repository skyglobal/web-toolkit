$('#lightbox-demo-link').lightbox({
    onShow: function(){
        $('[data-function=carousel]').trigger("pause");
        $('#lightbox-demo').trigger('my-lightbox-opened');
    }, onClose: function(){
        $('#lightbox-demo').trigger('my-lightbox-closed');
    }
});