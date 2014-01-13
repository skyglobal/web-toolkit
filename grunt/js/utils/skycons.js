/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function() {
    var icons = {
        'skycon-sky' : "&#xf100;",
        'skycon-chevron-down' : "&#xf101;",
        'skycon-info' : "&#xf102;",
        'skycon-arrow-right' : "&#xf103;",
        'skycon-plus-circle' : "&#xf104;",
        'skycon-sky-plus' : "&#xf105;",
        'skycon-tv' : "&#xf106;",
        'skycon-twitter-reply' : "&#xf107;",
        'skycon-arrow-down-left' : "&#xf108;",
        'skycon-chevron-up' : "&#xf109;",
        'skycon-chevron' : "&#xf10a;",
        'skycon-facebook' : "&#xf10b;",
        'skycon-tick' : "&#xf10c;",
        'skycon-remote-record' : "&#xf10d;",
        'skycon-warning' : "&#xf10e;",
        'skycon-carousel-play' : "&#xf10f;",
        'skycon-arrow-left' : "&#xf110;",
        'skycon-chevron-left' : "&#xf111;",
        'skycon-on-demand' : "&#xf112;",
        'skycon-user-profile' : "&#xf113;",
        'skycon-search' : "&#xf114;",
        'skycon-twitter-retweet' : "&#xf115;",
        'skycon-at' : "&#xf116;",
        'skycon-volume' : "&#xf117;",
        'skycon-twitter-favourite' : "&#xf118;",
        'skycon-expand' : "&#xf119;",
        'skycon-carousel-pause' : "&#xf11a;",
        'skycon-mouse' : "&#xf11b;",
        'skycon-share' : "&#xf11c;",
        'skycon-never-miss' : "&#xf11d;",
        'skycon-mail' : "&#xf11e;",
        'skycon-sky-go' : "&#xf11f;",
        'skycon-twitter-follow' : "&#xf120;",
        'skycon-pending' : "&#xf121;",
        'skycon-minify' : "&#xf122;",
        'skycon-twitter' : "&#xf123;",
        'skycon-close' : "&#xf124;",
        'skycon-menu' : "&#xf125;",
        'skycon-phone' : "&#xf126;",
        'skycon-cloud' : "&#xf127;",
        'skycon-video-play' : "&#xf128;",
        'skycon-google-plus' : "&#xf129;"
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