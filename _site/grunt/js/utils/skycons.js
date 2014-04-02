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
    'skycon-download' : "&#xf10c;",
    'skycon-expand' : "&#xf10d;",
    'skycon-facebook' : "&#xf10e;",
    'skycon-google-plus' : "&#xf10f;",
    'skycon-info' : "&#xf110;",
    'skycon-mail' : "&#xf111;",
    'skycon-menu' : "&#xf112;",
    'skycon-minify' : "&#xf113;",
    'skycon-mouse' : "&#xf114;",
    'skycon-never-miss' : "&#xf115;",
    'skycon-on-demand' : "&#xf116;",
    'skycon-pending' : "&#xf117;",
    'skycon-phone' : "&#xf118;",
    'skycon-plus-circle' : "&#xf119;",
    'skycon-remote-record' : "&#xf11a;",
    'skycon-search' : "&#xf11b;",
    'skycon-share' : "&#xf11c;",
    'skycon-sky-go' : "&#xf11d;",
    'skycon-sky-plus' : "&#xf11e;",
    'skycon-sky' : "&#xf11f;",
    'skycon-speech-bubble' : "&#xf120;",
    'skycon-tick' : "&#xf121;",
    'skycon-tv' : "&#xf122;",
    'skycon-twitter-favourite' : "&#xf123;",
    'skycon-twitter-follow' : "&#xf124;",
    'skycon-twitter-reply' : "&#xf125;",
    'skycon-twitter-retweet' : "&#xf126;",
    'skycon-twitter' : "&#xf127;",
    'skycon-user-profile' : "&#xf128;",
    'skycon-video-play' : "&#xf129;",
    'skycon-volume' : "&#xf12a;",
    'skycon-warning' : "&#xf12b;",
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