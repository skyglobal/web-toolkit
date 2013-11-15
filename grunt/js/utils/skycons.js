/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function() {
    var icons = {
        'skycon-arrow-left' : "&#xf100;",
        'skycon-arrow-right' : "&#xf101;",
        'skycon-carousel-pause' : "&#xf102;",
        'skycon-carousel-play' : "&#xf103;",
        'skycon-chevron-down' : "&#xf104;",
        'skycon-chevron-up' : "&#xf105;",
        'skycon-chevron' : "&#xf106;",
        'skycon-close' : "&#xf107;",
        'skycon-cloud' : "&#xf108;",
        'skycon-expand' : "&#xf109;",
        'skycon-facebook' : "&#xf10a;",
        'skycon-google-plus' : "&#xf10b;",
        'skycon-mail' : "&#xf10c;",
        'skycon-menu' : "&#xf10d;",
        'skycon-minify' : "&#xf10e;",
        'skycon-mouse' : "&#xf10f;",
        'skycon-never-miss' : "&#xf110;",
        'skycon-on-demand' : "&#xf111;",
        'skycon-phone' : "&#xf112;",
        'skycon-remote-record' : "&#xf113;",
        'skycon-search' : "&#xf114;",
        'skycon-share' : "&#xf115;",
        'skycon-sky-go' : "&#xf116;",
        'skycon-sky-plus' : "&#xf117;",
        'skycon-sky' : "&#xf118;",
        'skycon-tv' : "&#xf119;",
        'skycon-twitter-favourite' : "&#xf11a;",
        'skycon-twitter-follow' : "&#xf11b;",
        'skycon-twitter-reply' : "&#xf11c;",
        'skycon-twitter-retweet' : "&#xf11d;",
        'skycon-twitter' : "&#xf11e;",
        'skycon-user-profile' : "&#xf11f;",
        'skycon-volume' : "&#xf120;",
        'skycon-warning' : "&#xf121;",
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
