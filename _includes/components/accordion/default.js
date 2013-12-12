if (window.require){
    require(['toolkit'], function(){
        $('.accordion').accordion();
    });
} else {
    $('.accordion').accordion();
}