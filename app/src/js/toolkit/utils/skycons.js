/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function(detect, event) {

    var icons = {
        'skycon-arrow-down-left' : "&#xe001;",
        'skycon-arrow-left' : "&#xe002;",
        'skycon-arrow-right' : "&#xe003;",
        'skycon-at' : "&#xe004;",
        'skycon-carousel-pause' : "&#xe005;",
        'skycon-carousel-play' : "&#xe006;",
        'skycon-chevron-down' : "&#xe007;",
        'skycon-chevron-left' : "&#xe008;",
        'skycon-chevron-up' : "&#xe009;",
        'skycon-chevron' : "&#xe00a;",
        'skycon-close' : "&#xe00b;",
        'skycon-cloud' : "&#xe00c;",
        'skycon-download' : "&#xe00d;",
        'skycon-expand' : "&#xe00e;",
        'skycon-facebook' : "&#xe00f;",
        'skycon-gallery' : "&#xe010;",
        'skycon-google-plus' : "&#xe011;",
        'skycon-info' : "&#xe012;",
        'skycon-mail' : "&#xe013;",
        'skycon-menu' : "&#xe014;",
        'skycon-minify' : "&#xe015;",
        'skycon-mouse' : "&#xe016;",
        'skycon-never-miss' : "&#xe017;",
        'skycon-on-demand' : "&#xe018;",
        'skycon-pending' : "&#xe019;",
        'skycon-phone' : "&#xe01a;",
        'skycon-plus-circle' : "&#xe01b;",
        'skycon-remote-record' : "&#xe01c;",
        'skycon-search' : "&#xe01d;",
        'skycon-share' : "&#xe01e;",
        'skycon-sky-go' : "&#xe01f;",
        'skycon-sky-plus' : "&#xe020;",
        'skycon-sky' : "&#xe021;",
        'skycon-speech-bubble' : "&#xe022;",
        'skycon-tick' : "&#xe023;",
        'skycon-tv' : "&#xe024;",
        'skycon-twitter-favourite' : "&#xe025;",
        'skycon-twitter-follow' : "&#xe026;",
        'skycon-twitter-reply' : "&#xe027;",
        'skycon-twitter-retweet' : "&#xe028;",
        'skycon-twitter' : "&#xe029;",
        'skycon-user-profile' : "&#xe02a;",
        'skycon-video-play' : "&#xe02b;",
        'skycon-volume' : "&#xe02c;",
        'skycon-warning' : "&#xe02d;"
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