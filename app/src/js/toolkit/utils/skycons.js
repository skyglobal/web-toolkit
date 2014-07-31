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
        'skycon-calender' : "&#xf104;",
        'skycon-carousel-pause' : "&#xf105;",
        'skycon-carousel-play' : "&#xf106;",
        'skycon-chevron-down' : "&#xf107;",
        'skycon-chevron-left' : "&#xf108;",
        'skycon-chevron-up' : "&#xf109;",
        'skycon-chevron' : "&#xf10a;",
        'skycon-close' : "&#xf10b;",
        'skycon-cloud' : "&#xf10c;",
        'skycon-download' : "&#xf10d;",
        'skycon-edit' : "&#xf10e;",
        'skycon-expand' : "&#xf10f;",
        'skycon-facebook' : "&#xf110;",
        'skycon-gallery' : "&#xf111;",
        'skycon-google-plus' : "&#xf112;",
        'skycon-home' : "&#xf113;",
        'skycon-info' : "&#xf114;",
        'skycon-mail' : "&#xf115;",
        'skycon-menu' : "&#xf116;",
        'skycon-minify' : "&#xf117;",
        'skycon-mouse' : "&#xf118;",
        'skycon-never-miss' : "&#xf119;",
        'skycon-on-demand' : "&#xf11a;",
        'skycon-pending' : "&#xf11b;",
        'skycon-phone' : "&#xf11c;",
        'skycon-plus-circle' : "&#xf11d;",
        'skycon-remote-record' : "&#xf11e;",
        'skycon-search' : "&#xf11f;",
        'skycon-share' : "&#xf120;",
        'skycon-sky-go' : "&#xf121;",
        'skycon-sky-plus' : "&#xf122;",
        'skycon-sky' : "&#xf123;",
        'skycon-speech-bubble' : "&#xf124;",
        'skycon-tick' : "&#xf125;",
        'skycon-tv' : "&#xf126;",
        'skycon-twitter-favourite' : "&#xf127;",
        'skycon-twitter-follow' : "&#xf128;",
        'skycon-twitter-reply' : "&#xf129;",
        'skycon-twitter-retweet' : "&#xf12a;",
        'skycon-twitter' : "&#xf12b;",
        'skycon-user-profile' : "&#xf12c;",
        'skycon-video-play' : "&#xf12d;",
        'skycon-volume' : "&#xf12e;",
        'skycon-warning' : "&#xf12f;",
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
