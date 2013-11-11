/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function() {
    var icons = {
        'skycon-sky' : "&#xf100;",
        'skycon-chevron-down' : "&#xf101;",
        'skycon-twitter-reply' : "&#xf102;",
        'skycon-chevron-up' : "&#xf103;",
        'skycon-chevron' : "&#xf104;",
        'skycon-facebook' : "&#xf105;",
        'skycon-remote-record' : "&#xf106;",
        'skycon-warning' : "&#xf107;",
        'skycon-carousel-play' : "&#xf108;",
        'skycon-user-profile' : "&#xf109;",
        'skycon-search' : "&#xf10a;",
        'skycon-twitter-retweet' : "&#xf10b;",
        'skycon-volume' : "&#xf10c;",
        'skycon-twitter-favourite' : "&#xf10d;",
        'skycon-expand' : "&#xf10e;",
        'skycon-carousel-pause' : "&#xf10f;",
        'skycon-share' : "&#xf110;",
        'skycon-never-miss' : "&#xf111;",
        'skycon-mail' : "&#xf112;",
        'skycon-sky-go' : "&#xf113;",
        'skycon-twitter-follow' : "&#xf114;",
        'skycon-minify' : "&#xf115;",
        'skycon-twitter' : "&#xf116;",
        'skycon-close' : "&#xf117;",
        'skycon-menu' : "&#xf118;",
        'skycon-google-plus' : "&#xf119;"
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
