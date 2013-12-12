if (window.require){
    require(['toolkit'], function(){
        $('#demo-classic-tabs').inPageNav();
    });
} else {
    $('#demo-classic-tabs').inPageNav();
}