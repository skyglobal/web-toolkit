var defaultCarouselConfig =  {
    autoplay: true,
    videoAds: false
};

if (window.require){
    require(['toolkit'], function(){
        $('#hero').skycom_carousel(defaultCarouselConfig);
    });
} else {
    $('#hero').skycom_carousel(defaultCarouselConfig);
}