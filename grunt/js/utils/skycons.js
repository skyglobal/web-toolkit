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
        'skycon-chevron-up' : "&#xf105;",
        'skycon-chevron' : "&#xf106;",
        'skycon-facebook' : "&#xf107;",
        'skycon-remote-record' : "&#xf108;",
        'skycon-warning' : "&#xf109;",
        'skycon-carousel-play' : "&#xf10a;",
        'skycon-arrow-left' : "&#xf10b;",
        'skycon-on-demand' : "&#xf10c;",
        'skycon-user-profile' : "&#xf10d;",
        'skycon-search' : "&#xf10e;",
        'skycon-twitter-retweet' : "&#xf10f;",
        'skycon-volume' : "&#xf110;",
        'skycon-twitter-favourite' : "&#xf111;",
        'skycon-expand' : "&#xf112;",
        'skycon-carousel-pause' : "&#xf113;",
        'skycon-mouse' : "&#xf114;",
        'skycon-share' : "&#xf115;",
        'skycon-never-miss' : "&#xf116;",
        'skycon-mail' : "&#xf117;",
        'skycon-sky-go' : "&#xf118;",
        'skycon-twitter-follow' : "&#xf119;",
        'skycon-minify' : "&#xf11a;",
        'skycon-twitter' : "&#xf11b;",
        'skycon-close' : "&#xf11c;",
        'skycon-menu' : "&#xf11d;",
        'skycon-phone' : "&#xf11e;",
        'skycon-cloud' : "&#xf11f;",
        'skycon-google-plus' : "&#xf120;"
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
