/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function() {
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

    function supportsPsuedo(){
        var doc = document,
            html = doc.documentElement,
            body = doc.body,
            supportsPseudo = false,
            paraBefore = doc.createElement('p'),
            styleBefore = doc.createElement('style'),
            heightBefore,
            selectorsBefore = '#testbefore:before { content: "before"; }';

        styleBefore.type = 'text\/css';
        paraBefore.id = 'testbefore';

        if (styleBefore.styleSheet) {
            styleBefore.styleSheet.cssText = selectorsBefore;
        } else {
            styleBefore.appendChild(doc.createTextNode(selectorsBefore));
        }

        body.appendChild(styleBefore);
        body.appendChild(paraBefore);

        heightBefore = doc.getElementById('testbefore').offsetHeight;
        
        if (heightBefore >= 1) {
            supportsPseudo = true;
        }
        
        body.removeChild(styleBefore);
        body.removeChild(paraBefore);
        return supportsPseudo;
    }

    function addSkycon(el, c){
        var html = el.innerHTML,
            entity = icons[c];
        el.innerHTML = '<span style="font-family: \'skycons\'" class="ie7-skycon">' + entity + '</span>' + html;
    }

    function init(){
        if (supportsPsuedo()){ return; }
        var els = document.getElementsByTagName('*'),
            i, c, el;
        for (i = 0; ; i += 1) {
            el = els[i];
            if(!el) { break; }
            c = el.className;
            c = c.match(/skycon-[^\s'"]+/);
            if (c) { addSkycon(el, c[0]); }
        }
    }

    $(document).ready(init);

    return {
        add: addSkycon
    };
});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/skycons', [], function() {
        return toolkit.skycons();
    });
} else {
    toolkit.skycons = toolkit.skycons();
}