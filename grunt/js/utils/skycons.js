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
        'skycon-expand' : "&#xe00d;",
        'skycon-facebook' : "&#xe00e;",
        'skycon-google-plus' : "&#xe00f;",
        'skycon-info' : "&#xe010;",
        'skycon-mail' : "&#xe011;",
        'skycon-menu' : "&#xe012;",
        'skycon-minify' : "&#xe013;",
        'skycon-mouse' : "&#xe014;",
        'skycon-never-miss' : "&#xe015;",
        'skycon-on-demand' : "&#xe016;",
        'skycon-pending' : "&#xe017;",
        'skycon-phone' : "&#xe018;",
        'skycon-plus-circle' : "&#xe019;",
        'skycon-remote-record' : "&#xe01a;",
        'skycon-search' : "&#xe01b;",
        'skycon-share' : "&#xe01c;",
        'skycon-sky-go' : "&#xe01d;",
        'skycon-sky-plus' : "&#xe01e;",
        'skycon-sky' : "&#xe01f;",
        'skycon-tick' : "&#xe020;",
        'skycon-tv' : "&#xe021;",
        'skycon-twitter-favourite' : "&#xe022;",
        'skycon-twitter-follow' : "&#xe023;",
        'skycon-twitter-reply' : "&#xe024;",
        'skycon-twitter-retweet' : "&#xe025;",
        'skycon-twitter' : "&#xe026;",
        'skycon-user-profile' : "&#xe027;",
        'skycon-video-play' : "&#xe028;",
        'skycon-volume' : "&#xe029;",
        'skycon-warning' : "&#xe02a;"
    };

    function addWebfont(el, c){
        var html = el.innerHTML,
            entity = icons[c];
        el.innerHTML = '<span style="font-style:normal;font-family: \'skycons\'">' + entity + '</span>' + html;
    }

    function init(){
        if (detect.supportsPsuedo()){ return; }
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
        return toolkit.skycons(detect,event);
    });
} else {
    toolkit.skycons = toolkit.skycons(toolkit.detect,toolkit.event);
}