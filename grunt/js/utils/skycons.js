/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function(detect, event) {

    var icons = {
        'skycon-arrow-down-left' : "&#xf100;",
        'skycon-arrow-left' : "&#xf101;",
        'skycon-arrow-right' : "&#xf102;",
        'skycon-at' : "&#xf103;",
        'skycon-carousel-pause' : "&#xf104;",
        'skycon-carousel-play' : "&#xf105;",
        'skycon-chevron-down' : "&#xf106;",
        'skycon-chevron-left' : "&#xf107;",
        'skycon-chevron-up' : "&#xf108;",
        'skycon-chevron' : "&#xf109;",
        'skycon-close' : "&#xf10a;",
        'skycon-cloud' : "&#xf10b;",
        'skycon-expand' : "&#xf10c;",
        'skycon-facebook' : "&#xf10d;",
        'skycon-google-plus' : "&#xf10e;",
        'skycon-info' : "&#xf10f;",
        'skycon-mail' : "&#xf110;",
        'skycon-menu' : "&#xf111;",
        'skycon-minify' : "&#xf112;",
        'skycon-mouse' : "&#xf113;",
        'skycon-never-miss' : "&#xf114;",
        'skycon-on-demand' : "&#xf115;",
        'skycon-pending' : "&#xf116;",
        'skycon-phone' : "&#xf117;",
        'skycon-plus-circle' : "&#xf118;",
        'skycon-remote-record' : "&#xf119;",
        'skycon-search' : "&#xf11a;",
        'skycon-share' : "&#xf11b;",
        'skycon-sky-go' : "&#xf11c;",
        'skycon-sky-plus' : "&#xf11d;",
        'skycon-sky' : "&#xf11e;",
        'skycon-speech-bubble' : "&#xf11f;",
        'skycon-tick' : "&#xf120;",
        'skycon-tv' : "&#xf121;",
        'skycon-twitter-favourite' : "&#xf122;",
        'skycon-twitter-follow' : "&#xf123;",
        'skycon-twitter-reply' : "&#xf124;",
        'skycon-twitter-retweet' : "&#xf125;",
        'skycon-twitter' : "&#xf126;",
        'skycon-user-profile' : "&#xf127;",
        'skycon-video-play' : "&#xf128;",
        'skycon-volume' : "&#xf129;",
        'skycon-warning' : "&#xf12a;",
    };

    function addWebfont(el, c){
        var html = el.innerHTML,
            entity = icons[c];
        el.innerHTML = '<span style="font-style:normal;font-family: \'skycons\'">' + entity + '</span>' + html;
    }

    function init(){
        if (detect.pseudo()){ return; }
        var els = document.getElementsByTagName('*'),
            i, c, el;
        for (i = 0; ; i += 1) {
            el = els[i];
            if(!el) { break; }
            c = el.className;
            c = c.match(/skycon-[^\s'"]+/);
            if (c) { addWebfont(el, c[0]); }
        }
    }

    event.ready(init);

    return {
        add: addWebfont
    };
});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/skycons', ['utils/detect','utils/event'], function(detect,event) {
        toolkit.skycons = toolkit.skycons(detect,event);
        return toolkit.skycons;
    });
} else {
    toolkit.skycons = toolkit.skycons(toolkit.detect,toolkit.event);
}