/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function(detect, event) {

    var icons = {
        'skycon-arrow-down-left' : "&#xf102;",
        'skycon-arrow-left' : "&#xf101;",
        'skycon-arrow-right' : "&#xf112;",
        'skycon-at' : "&#xf105;",
        'skycon-calender' : "&#xf108;",
        'skycon-carousel-pause' : "&#xf100;",
        'skycon-carousel-play' : "&#xf120;",
        'skycon-chevron' : "&#xf11a;",
        'skycon-chevron-down' : "&#xf11b;",
        'skycon-chevron-left' : "&#xf103;",
        'skycon-chevron-up' : "&#xf10b;",
        'skycon-close' : "&#xf109;",
        'skycon-cloud' : "&#xf104;",
        'skycon-download' : "&#xf11c;",
        'skycon-edit' : "&#xf125;",
        'skycon-expand' : "&#xf10c;",
        'skycon-facebook' : "&#xf11e;",
        'skycon-gallery' : "&#xf124;",
        'skycon-google-plus' : "&#xf119;",
        'skycon-home' : "&#xf111;",
        'skycon-info' : "&#xf127;",
        'skycon-mail' : "&#xf115;",
        'skycon-menu' : "&#xf121;",
        'skycon-minify' : "&#xf122;",
        'skycon-mouse' : "&#xf107;",
        'skycon-never-miss' : "&#xf106;",
        'skycon-on-demand' : "&#xf11d;",
        'skycon-pending' : "&#xf12b;",
        'skycon-phone' : "&#xf12d;",
        'skycon-plus-circle' : "&#xf10a;",
        'skycon-remote-record' : "&#xf128;",
        'skycon-search' : "&#xf117;",
        'skycon-share' : "&#xf12e;",
        'skycon-sky' : "&#xf123;",
        'skycon-sky-go' : "&#xf129;",
        'skycon-sky-plus' : "&#xf10f;",
        'skycon-speech-bubble' : "&#xf12a;",
        'skycon-tick' : "&#xf110;",
        'skycon-tv' : "&#xf12c;",
        'skycon-twitter' : "&#xf126;",
        'skycon-twitter-favourite' : "&#xf11f;",
        'skycon-twitter-follow' : "&#xf10e;",
        'skycon-twitter-reply' : "&#xf12f;",
        'skycon-twitter-retweet' : "&#xf116;",
        'skycon-user-profile' : "&#xf10d;",
        'skycon-remote-download' : "&#xf12e;",
        'skycon-video-play' : "&#xf114;",
        'skycon-volume' : "&#xf113;",
        'skycon-warning' : "&#xf118;"
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
