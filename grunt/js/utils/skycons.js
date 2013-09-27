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
        'skycon-remote-record' : "&#xf103;",
        'skycon-warning' : "&#xf104;",
        'skycon-twitter-bird' : "&#xf105;",
        'skycon-carousel-play' : "&#xf106;",
        'skycon-user-profile' : "&#xf107;",
        'skycon-search' : "&#xf108;",
        'skycon-twitter-retweet' : "&#xf109;",
        'skycon-twitter-favourite' : "&#xf10a;",
        'skycon-carousel-pause' : "&#xf10b;",
        'skycon-never-miss' : "&#xf10c;",
        'skycon-mail' : "&#xf10d;",
        'skycon-sky-go' : "&#xf10e;",
        'skycon-twitter-follow' : "&#xf10f;",
        'skycon-close' : "&#xf110;",
        'skycon-menu' : "&#xf111;"
    };

    function supportsPsuedo(){
        var head = document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            rules = [
                '#pseudo-test { visibility:hidden; position:absolute; } ',
                '#pseudo-test:before { content: "(-:"; }'
            ],
            div = document.createElement('div'),
            hasBefore = false;
        style.type = 'text/css';

        if(style.styleSheet){
            style.styleSheet.cssText = rules.join('');
        } else {
            style.appendChild(document.createTextNode(rules.join('')));
        }

        head.appendChild(style);

        div.id = "pseudo-test";
        document.body.appendChild(div);
        hasBefore = div.offsetWidth > 0;

        // Clean up
        style.parentNode.removeChild(style);
        div.parentNode.removeChild(div);
        return hasBefore;
    }

    function addSkycon(el, c){
        var html = el.innerHTML,
            entity = icons[c];
        el.innerHTML = '<span style="font-family: \'Skycons\'">' + entity + '</span>' + html;
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