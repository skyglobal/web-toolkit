if (window.require){
    require(['toolkit'], function(){
        $('.date-picker').datePicker();
        $('.sky-form').validation();
    });
} else {
    $('.date-picker').datePicker();
    $('.sky-form').validation();
}