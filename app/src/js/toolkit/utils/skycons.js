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
        'skycon-edit' : "&#xf10d;",
        'skycon-expand' : "&#xf10e;",
        'skycon-facebook' : "&#xf10f;",
        'skycon-gallery' : "&#xf110;",
        'skycon-google-plus' : "&#xf111;",
        'skycon-info' : "&#xf112;",
        'skycon-mail' : "&#xf113;",
        'skycon-menu' : "&#xf114;",
        'skycon-minify' : "&#xf115;",
        'skycon-mouse' : "&#xf116;",
        'skycon-never-miss' : "&#xf117;",
        'skycon-on-demand' : "&#xf118;",
        'skycon-pending' : "&#xf119;",
        'skycon-phone' : "&#xf11a;",
        'skycon-plus-circle' : "&#xf11b;",
        'skycon-remote-record' : "&#xf11c;",
        'skycon-search' : "&#xf11d;",
        'skycon-share' : "&#xf11e;",
        'skycon-sky-go' : "&#xf11f;",
        'skycon-sky-plus' : "&#xf120;",
        'skycon-sky' : "&#xf121;",
        'skycon-speech-bubble' : "&#xf122;",
        'skycon-tick' : "&#xf123;",
        'skycon-tv' : "&#xf124;",
        'skycon-twitter-favourite' : "&#xf125;",
        'skycon-twitter-follow' : "&#xf126;",
        'skycon-twitter-reply' : "&#xf127;",
        'skycon-twitter-retweet' : "&#xf128;",
        'skycon-twitter' : "&#xf129;",
        'skycon-user-profile' : "&#xf12a;",
        'skycon-video-play' : "&#xf12b;",
        'skycon-volume' : "&#xf12c;",
        'skycon-warning' : "&#xf12d;"
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