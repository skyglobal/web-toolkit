var skinnyCarouselConfig =  {
    autoplay: true,
    videoAds: false
};

if (window.require){
    require(['toolkit'], function(){
        $('#hero-skinny').skycom_carousel(skinnyCarouselConfig);
    });
} else {
    $('#hero-skinny').skycom_carousel(skinnyCarouselConfig);
}