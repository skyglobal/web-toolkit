/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function() {
    var icons = {
        'skycon-sky' : "&#xf100;",
        'skycon-chevron-down' : "&#xf101;",
        'skycon-plus-circle' : "&#xf102;",
        'skycon-sky-plus' : "&#xf103;",
        'skycon-tv' : "&#xf104;",
        'skycon-twitter-reply' : "&#xf105;",
        'skycon-arrow-down-left' : "&#xf106;",
        'skycon-chevron-up' : "&#xf107;",
        'skycon-chevron' : "&#xf108;",
        'skycon-facebook' : "&#xf109;",
        'skycon-tick' : "&#xf10a;",
        'skycon-remote-record' : "&#xf10b;",
        'skycon-warning' : "&#xf10c;",
        'skycon-carousel-play' : "&#xf10d;",
        'skycon-arrow-left' : "&#xf10e;",
        'skycon-chevron-left' : "&#xf10f;",
        'skycon-on-demand' : "&#xf110;",
        'skycon-user-profile' : "&#xf111;",
        'skycon-search' : "&#xf112;",
        'skycon-twitter-retweet' : "&#xf113;",
        'skycon-volume' : "&#xf114;",
        'skycon-twitter-favourite' : "&#xf115;",
        'skycon-expand' : "&#xf116;",
        'skycon-carousel-pause' : "&#xf117;",
        'skycon-mouse' : "&#xf118;",
        'skycon-share' : "&#xf119;",
        'skycon-never-miss' : "&#xf11a;",
        'skycon-mail' : "&#xf11b;",
        'skycon-sky-go' : "&#xf11c;",
        'skycon-twitter-follow' : "&#xf11d;",
        'skycon-minify' : "&#xf11e;",
        'skycon-twitter' : "&#xf11f;",
        'skycon-close' : "&#xf120;",
        'skycon-menu' : "&#xf121;",
        'skycon-phone' : "&#xf122;",
        'skycon-cloud' : "&#xf123;",
        'skycon-video-play' : "&#xf124;",
        'skycon-google-plus' : "&#xf125;",
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
