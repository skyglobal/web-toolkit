/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function() {
    var icons = {
        'skycon-sky' : "&#xf100;",
        'skycon-twitter-reply' : "&#xf101;",
        'skycon-chevron' : "&#xf102;",
        'skycon-facebook' : "&#xf103;",
        'skycon-remote-record' : "&#xf104;",
        'skycon-warning' : "&#xf105;",
        'skycon-carousel-play' : "&#xf106;",
        'skycon-user-profile' : "&#xf107;",
        'skycon-search' : "&#xf108;",
        'skycon-twitter-retweet' : "&#xf109;",
        'skycon-volume' : "&#xf10a;",
        'skycon-twitter-favourite' : "&#xf10b;",
        'skycon-expand' : "&#xf10c;",
        'skycon-carousel-pause' : "&#xf10d;",
        'skycon-share' : "&#xf10e;",
        'skycon-never-miss' : "&#xf10f;",
        'skycon-mail' : "&#xf110;",
        'skycon-sky-go' : "&#xf111;",
        'skycon-twitter-follow' : "&#xf112;",
        'skycon-minify' : "&#xf113;",
        'skycon-twitter' : "&#xf114;",
        'skycon-close' : "&#xf115;",
        'skycon-menu' : "&#xf116;",
        'skycon-google-plus' : "&#xf117;"
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
