/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function() {
    var icons = {
        'skycon-sky' : "&#xf100;",
        'skycon-twitter-reply' : "&#xf101;",
        'skycon-chevron-circle' : "&#xf102;",
        'skycon-chevron' : "&#xf103;",
        'skycon-facebook' : "&#xf104;",
        'skycon-remote-record' : "&#xf105;",
        'skycon-warning' : "&#xf106;",
        'skycon-carousel-play' : "&#xf107;",
        'skycon-user-profile' : "&#xf108;",
        'skycon-search' : "&#xf109;",
        'skycon-twitter-retweet' : "&#xf10a;",
        'skycon-volume' : "&#xf10b;",
        'skycon-twitter-favourite' : "&#xf10c;",
        'skycon-expand' : "&#xf10d;",
        'skycon-carousel-pause' : "&#xf10e;",
        'skycon-share' : "&#xf10f;",
        'skycon-never-miss' : "&#xf110;",
        'skycon-mail' : "&#xf111;",
        'skycon-sky-go' : "&#xf112;",
        'skycon-twitter-follow' : "&#xf113;",
        'skycon-minify' : "&#xf114;",
        'skycon-twitter' : "&#xf115;",
        'skycon-close' : "&#xf116;",
        'skycon-menu' : "&#xf117;",
        'skycon-google-plus' : "&#xf118;"
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
