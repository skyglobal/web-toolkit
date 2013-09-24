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
        'skycon-warning' : "&#xf103;",
        'skycon-twitter-bird' : "&#xf104;",
        'skycon-carousel-play' : "&#xf105;",
        'skycon-user-profile' : "&#xf106;",
        'skycon-search' : "&#xf107;",
        'skycon-twitter-retweet' : "&#xf108;",
        'skycon-twitter-favourite' : "&#xf109;",
        'skycon-carousel-pause' : "&#xf10a;",
        'skycon-mail' : "&#xf10b;",
        'skycon-twitter-follow' : "&#xf10c;",
        'skycon-close' : "&#xf10d;",
        'skycon-menu' : "&#xf10e;"
    };

    function supportsPsuedo(){
        var head = document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            rules = [
                '#skycon-test { visibility:hidden; position:absolute; } ',
                '#skycon-test:before { content: "(-:"; }'
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

        div.id = "skycon-test";
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