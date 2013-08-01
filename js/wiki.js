wiki = (function() {
    $('#hero').skycom_carousel({
        carousel: {
            autoplay: true,
            videoAds: false
        }
    });
}());

if (typeof window.define === "function" && window.define.amd) {
    define('wiki', ['toolkit'], function() {
        return wiki;
    })
}
