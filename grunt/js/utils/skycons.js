/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function() {
    var icons = {
        'skycon-sky' : "&#xf100;",
        'skycon-chevron-down' : "&#xf101;",
        'skycon-arrow-right' : "&#xf102;",
        'skycon-plus-circle' : "&#xf103;",
        'skycon-sky-plus' : "&#xf104;",
        'skycon-tv' : "&#xf105;",
        'skycon-twitter-reply' : "&#xf106;",
        'skycon-arrow-down-left' : "&#xf107;",
        'skycon-chevron-up' : "&#xf108;",
        'skycon-chevron' : "&#xf109;",
        'skycon-facebook' : "&#xf10a;",
        'skycon-tick' : "&#xf10b;",
        'skycon-remote-record' : "&#xf10c;",
        'skycon-warning' : "&#xf10d;",
        'skycon-carousel-play' : "&#xf10e;",
        'skycon-arrow-left' : "&#xf10f;",
        'skycon-chevron-left' : "&#xf110;",
        'skycon-on-demand' : "&#xf111;",
        'skycon-user-profile' : "&#xf112;",
        'skycon-search' : "&#xf113;",
        'skycon-twitter-retweet' : "&#xf114;",
        'skycon-at' : "&#xf115;",
        'skycon-volume' : "&#xf116;",
        'skycon-twitter-favourite' : "&#xf117;",
        'skycon-expand' : "&#xf118;",
        'skycon-carousel-pause' : "&#xf119;",
        'skycon-mouse' : "&#xf11a;",
        'skycon-share' : "&#xf11b;",
        'skycon-never-miss' : "&#xf11c;",
        'skycon-mail' : "&#xf11d;",
        'skycon-sky-go' : "&#xf11e;",
        'skycon-twitter-follow' : "&#xf11f;",
        'skycon-minify' : "&#xf120;",
        'skycon-twitter' : "&#xf121;",
        'skycon-close' : "&#xf122;",
        'skycon-menu' : "&#xf123;",
        'skycon-phone' : "&#xf124;",
        'skycon-cloud' : "&#xf125;",
        'skycon-video-play' : "&#xf126;",
        'skycon-google-plus' : "&#xf127;"
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
        if (!supportsPsuedo()){
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
    }

    return {
        add: addSkycon,
        init: init
    };
}());

if (typeof window.define === "function" && window.define.amd) {
    define('utils/skycons', [], function() {
        return toolkit.skycons;
    });
}
