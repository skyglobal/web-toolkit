/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function() {
    var icons = {
        'skycon-sky' : "&#xf100;",
        'skycon-chevron-down' : "&#xf101;",
        'skycon-sky-plus' : "&#xf102;",
        'skycon-tv' : "&#xf103;",
        'skycon-twitter-reply' : "&#xf104;",
        'skycon-arrow-down-left' : "&#xf105;",
        'skycon-chevron-up' : "&#xf106;",
        'skycon-chevron' : "&#xf107;",
        'skycon-facebook' : "&#xf108;",
        'skycon-tick' : "&#xf109;",
        'skycon-remote-record' : "&#xf10a;",
        'skycon-warning' : "&#xf10b;",
        'skycon-carousel-play' : "&#xf10c;",
        'skycon-arrow-left' : "&#xf10d;",
        'skycon-chevron-left' : "&#xf10e;",
        'skycon-on-demand' : "&#xf10f;",
        'skycon-user-profile' : "&#xf110;",
        'skycon-search' : "&#xf111;",
        'skycon-twitter-retweet' : "&#xf112;",
        'skycon-volume' : "&#xf113;",
        'skycon-twitter-favourite' : "&#xf114;",
        'skycon-expand' : "&#xf115;",
        'skycon-carousel-pause' : "&#xf116;",
        'skycon-mouse' : "&#xf117;",
        'skycon-share' : "&#xf118;",
        'skycon-never-miss' : "&#xf119;",
        'skycon-mail' : "&#xf11a;",
        'skycon-sky-go' : "&#xf11b;",
        'skycon-twitter-follow' : "&#xf11c;",
        'skycon-minify' : "&#xf11d;",
        'skycon-twitter' : "&#xf11e;",
        'skycon-close' : "&#xf11f;",
        'skycon-menu' : "&#xf120;",
        'skycon-phone' : "&#xf121;",
        'skycon-cloud' : "&#xf122;",
        'skycon-video-play' : "&#xf123;",
        'skycon-google-plus' : "&#xf124;"
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
