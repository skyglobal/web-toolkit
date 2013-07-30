wiki = (function() {
    $('#hero').skycom_carousel({
        carousel: {
            autoplay: true
        }
    });
}());

if (typeof window.define === "function" && window.define.amd) {
    define('wiki', ['toolkit'], function() {
        return wiki;
    })
}
