var singleSlideCarouselConfig =  {
    autoplay: true,
    videoAds: false
};
if (window.require){
    require(['toolkit'], function(){
        $('#empty-hero').skycom_carousel(singleSlideCarouselConfig);
    });
} else {
    $('#empty-hero').skycom_carousel(singleSlideCarouselConfig);
}