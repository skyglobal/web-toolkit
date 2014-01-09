
if (typeof toolkit==='undefined') toolkit={};
toolkit.polyfill = (function () {
    

    function functionBind(){
        if (typeof Function.prototype.bind !=='undefined') { return; }
        Function.prototype.bind = function (oThis) {
            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                FNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof FNOP && oThis ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            FNOP.prototype = this.prototype;
            fBound.prototype = new FNOP();
            return fBound;
        };
    }

    function stringTtrim(){
        if(typeof String.prototype.trim !== 'undefined') { return; }
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    function arrayIndexOf(){
        if (typeof Array.prototype.indexOf !== 'undefined') { return; }
        Array.prototype.indexOf = function(elt) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0){
                from += len;
            }
            for (; from < len; from++) {
                if (from in this && this[from] === elt) return from;
            }
            return -1;
        };
    }

    functionBind();
    stringTtrim();
    arrayIndexOf();

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/polyfill', [], function() {
        
        return toolkit.polyfill();
    });
} else {
    toolkit.polyfill = toolkit.polyfill();
};
if (typeof toolkit==='undefined') toolkit={};
toolkit.detect = (function () {
    

    var state = {};
    var toolkitClasses = ["no-touch", "touch-device", "mobile-view", "desktop-view", "landscape", "portrait"];
    var touchClasses = { hasNot: toolkitClasses[0], has: toolkitClasses[1] };
    var viewClasses = { mobile:toolkitClasses[2], desktop:toolkitClasses[3] };
    var orientationClasses = { landscape: toolkitClasses[4], portrait: toolkitClasses[5] };
    var $window = $(window);

    function bindEvents(){
        $(window).bind('resize', updateDetectionStates);
    }

    function pseudo(el, pos){
        if (!window.getComputedStyle) { return false; }
        var css = window.getComputedStyle(el, ':' + pos);
        var str = (css.getPropertyValue('content') && css.getPropertyValue('content')!='normal') ? css.getPropertyValue('content') : css.getPropertyValue('font-family');
        return (str)? str.replace(/"/g,'').replace(/'/g,'') : '';
    }

    function view(type){
        var html = document.getElementsByTagName('html')[0];
        state.view = pseudo(html,'after') || 'desktop';
        return (type) ? state.view == type : state.view ;
    }

    function orientation(type){
        var html = document.getElementsByTagName('html')[0];
        state.orientation = pseudo(html, 'before') || 'landscape';
        return (type) ? state.orientation == type : state.orientation;
    }

    function touch(){
        state.touch = (!!window.ontouchstart);
        return state.touch;
    }

    function updateDetectionStates(){
        removeClasses();
        attachClasses();
    }

    function removeClasses(){
        var arrClasses = document.documentElement.className.split(' ');
        for (var i in toolkitClasses){
            var indexToRemove = arrClasses.indexOf(toolkitClasses[i]);
            if (indexToRemove > -1) {
                arrClasses.splice(indexToRemove,1);
            }
        }
        document.documentElement.className = arrClasses.join(' ');
    }

    function attachClasses(){
        var arrClasses = document.documentElement.className.split(' ');
        arrClasses.push(touch() ? touchClasses.has : touchClasses.hasNot);
        arrClasses.push(view('mobile') ? viewClasses.mobile : viewClasses.desktop);
        arrClasses.push(orientation('landscape') ? orientationClasses.landscape : orientationClasses.portrait);
        document.documentElement.className = arrClasses.join(' ');
    }

    function elementVisibleBottom($el) {
        if ($el.length < 1) { return; }

        return ($el.offset().top + $el.height() <= $window.scrollTop() + $window.height());
    }

    attachClasses();
    bindEvents();

    return {
        touch: touch,
        orientation: orientation,
        view: view,
        pseudo: pseudo,
        state: state,
        elementVisibleBottom: elementVisibleBottom
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/detect', [], function() {
        
        return toolkit.detect();
    });
} else {
    toolkit.detect = toolkit.detect();
};
/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function() {
    var icons = {
        'skycon-arrow-down-left' : "&#xf100;",
        'skycon-arrow-left' : "&#xf101;",
        'skycon-arrow-right' : "&#xf102;",
        'skycon-at' : "&#xf103;",
        'skycon-carousel-pause' : "&#xf104;",
        'skycon-carousel-play' : "&#xf105;",
        'skycon-chevron-down' : "&#xf106;",
        'skycon-chevron-left' : "&#xf107;",
        'skycon-chevron-up' : "&#xf108;",
        'skycon-chevron' : "&#xf109;",
        'skycon-close' : "&#xf10a;",
        'skycon-cloud' : "&#xf10b;",
        'skycon-expand' : "&#xf10c;",
        'skycon-facebook' : "&#xf10d;",
        'skycon-google-plus' : "&#xf10e;",
        'skycon-info' : "&#xf10f;",
        'skycon-mail' : "&#xf110;",
        'skycon-menu' : "&#xf111;",
        'skycon-minify' : "&#xf112;",
        'skycon-mouse' : "&#xf113;",
        'skycon-never-miss' : "&#xf114;",
        'skycon-on-demand' : "&#xf115;",
        'skycon-pending' : "&#xf116;",
        'skycon-phone' : "&#xf117;",
        'skycon-plus-circle' : "&#xf118;",
        'skycon-remote-record' : "&#xf119;",
        'skycon-search' : "&#xf11a;",
        'skycon-share' : "&#xf11b;",
        'skycon-sky-go' : "&#xf11c;",
        'skycon-sky-plus' : "&#xf11d;",
        'skycon-sky' : "&#xf11e;",
        'skycon-tick' : "&#xf11f;",
        'skycon-tv' : "&#xf120;",
        'skycon-twitter-favourite' : "&#xf121;",
        'skycon-twitter-follow' : "&#xf122;",
        'skycon-twitter-reply' : "&#xf123;",
        'skycon-twitter-retweet' : "&#xf124;",
        'skycon-twitter' : "&#xf125;",
        'skycon-user-profile' : "&#xf126;",
        'skycon-video-play' : "&#xf127;",
        'skycon-volume' : "&#xf128;",
        'skycon-warning' : "&#xf129;"
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
        if (supportsPsuedo()){ return; }
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

    $(document).ready(init);

    return {
        add: addSkycon
    };
});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/skycons', [], function() {
        return toolkit.skycons();
    });
} else {
    toolkit.skycons = toolkit.skycons();
};
/**
 purpose:
 to let 'anchor' tags do their job and change the hash in the url for internal links.
 this will execute the associated callback with that hash.
 no onclick events needed.
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.hashManager = (function() {

    var vars = {
        globalHashList: {},
        hasLoaded: false,
        windowLoaded: false,
        lastExecutor: null,
        hash: null,
        fallback: {
            callback: null,
            undo: null
        }
    };

    function bindEvents() {
        $(window).on('hashchange', onHashChange);
        var doc_mode = document.documentMode,
        hashChangeSupport = 'onhashchange' in window && ( doc_mode === undefined || doc_mode > 7 );
        if (!hashChangeSupport){ //IE7 support
            vars.hash = document.location.hash;
            setInterval(function(){
                if (document.location.hash !== vars.hash){
                    $(window).trigger( 'hashchange' );
                }
            },200);
        }
        vars.windowLoaded = true;
    }

    function onHashChange(hash) {
        var evt, fn;
        hash = cleanHash((typeof hash === 'string') ? hash : location.hash);
        if (hash) {
            evt = vars.globalHashList[hash];
            fn = 'callback';
            vars.lastExecutor = hash;
        } else if (vars.lastExecutor) {
            evt = vars.globalHashList[vars.lastExecutor];
            fn = 'undo';
        }
        if (evt && typeof evt[fn] === 'function') {
            evt[fn](hash);
        } else if (fn === 'callback' && vars.fallback.callback) {
            vars.fallback.callback(hash);
        } else if (fn === 'undo' && vars.fallback.undo) {
            vars.fallback.undo(hash);
        }
    }

    function remove() {
        var loc = window.location;
        if ("pushState" in history) {
            location.hash = '!';
            history.pushState("", document.title, loc.pathname + loc.search);
        } else {
            location.hash = '!';
        }
    }

    function change(hash){
        location.hash = '!' + hash;
    }

    function register(hashList, callback, undo){
        var globalHashList = vars.globalHashList;
        $(hashList).each(function(i, hash) {
            hash = cleanHash(hash);
            if (globalHashList[hash]){
                var err = 'hashManager: hash (' + hash + ') already exists';
                throw new Error(err);
            }
            globalHashList[hash] = {
                callback: callback,
                undo: undo
            };

            if (vars.windowLoaded && hash === cleanHash(location.hash)) {
                onHashChange(hash);
            }
        });
    }

    function resetHash() {
        vars.globalHashList = [];
    }

    function registerFallback(callback, undo){
        vars.fallback.callback = callback;
        vars.fallback.undo = undo;
        onHashChange();
    }

    function cleanHash(hash) {
        return hash.replace(/[#!]/g, '');
    }

    bindEvents();

    return {
        register: register,
        registerFallback: registerFallback,
        change: change,
        remove: remove,
        onHashChange: onHashChange,
        resetHash: resetHash,
        cleanHash: cleanHash
    };
});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/hashManager', [], function() {
        return toolkit.hashManager();
    });
} else {
    toolkit.hashManager =  toolkit.hashManager();
};
if (typeof toolkit==='undefined') toolkit={};

toolkit.popup = (function() {

    function open(args) {
        var url = args.url;
        var width = args.width || 400;
        var height = args.height || width;
        var top = args.top || (screen.height/2)-(height/2);
        var left = args.left || (screen.width/2)-(width/2);
        var windowTitle = args.title || 'Sky';
        return window.open(url, windowTitle, 'top=' + top + ',left=' + left + ',width=' + width + ',height='+ height);
    }

    function openThisLink(e) {
        e.preventDefault();
        var args = $.extend($(this).data('popup'), {url: $(this).attr('href')});
        open(args);
    }

    function bindEvents() {
        $(document).on('click', '[data-popup]', openThisLink);
    }

    bindEvents();

    return {
        open: open
    };
});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/popup', [], function() {
        return toolkit.popup();
    });
} else {
    toolkit.popup = toolkit.popup();
};
/*
 returns toggle(); function
 this should be passed:
 $elClicked: the element clicked that caused the toggle.
 If this is used, this element could have data-toggle which is the selector of what needs to be toggled.
 If this is used, this element could have data-toggle-state which is either 'hidden' or 'shown'.
 $container: The element to be toggled. Use this if $elClicked and 'data-' attributes have not been used.
 action:      The state to toggle to - 'show' or 'hide'. Use this if $elClicked and 'data-' attributes have not been used.


 */

if (typeof toolkit==='undefined') toolkit={};

toolkit.toggle = (function() {

    var hasResized = false,
        hasContentChanged = false,
        elementsToToggle = {},
        hiddenClass = 'toggle-hidden',
        supportTransition = (function () {
            var body = document.body || document.documentElement;
            var style = body.style;
            var property = 'transition';
            if(typeof style[property] == 'string') {return true; }

            // Tests for vendor specific prop
            var vendorPrefix = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];

            property = property.charAt(0).toUpperCase() + property.substr(1);

            for(var i=0; i<vendorPrefix.length; i++) {
                if(typeof style[vendorPrefix[i] + property] == 'string') { return true; }
            }
            return false;
        }());

    function animate($el, to) {
        if (supportTransition) {
            setTimeout(function(){
                $el.css({'height':to, overflow:'hidden', 'transition':'height 0.5s ease-in-out'});
            }, 25);

        }
        $el.toggleClass(hiddenClass, (to === 0));
        return $el;
    }

    function setOpenHeight($el){
        var hasHeight = false;
        if(!supportTransition) return;
        if ($el.attr('style')){
            var styles = ($el.attr('style').split(';'));
            for (var i in styles){
                if (styles[i].trim().indexOf('height')===0){
                    hasHeight = true;
                }
            }
            if (hasHeight){ return; }
        }
        $el.css({'height':getOpenHeight($el)});
    }

    function getOpenHeight($el) {
        if ($el.data('openHeight') !== undefined && !hasResized && !hasContentChanged) {
            return $el.data('openHeight');
        }

        $('body')
            .append($('<div id="toggle-tmp-height" class="skycom-container"></div>')
            .append($el.clone().attr('style', '').removeClass(hiddenClass)));
        $('#toggle-tmp-height > div').append('<div class="toggle-clearfix-div clearfix clear" style="padding:1px"></div> ');
        $('#toggle-tmp-height > div').prepend('<div class="toggle-clearfix-div clearfix clear" style="padding:1px"></div> ');
        $el.data('openHeight', $('#toggle-tmp-height > div').height() - 2);
        $('#toggle-tmp-height').remove();
        $('.toggle-clearfix-div').remove();

        return $el.data('openHeight');
    }

    function updateText($elClicked) {
        var $textElement = $elClicked.find('span').length > 0 ? $elClicked.find('span') : $elClicked;
        var oldText = $textElement.text();
        $textElement.text($elClicked.attr('data-toggle-text'));
        $elClicked
            .attr('data-toggle-text', oldText)
            .attr('data-tracking-label', oldText);
    }

    function show($elToToggle) {
        var openHeight = getOpenHeight($elToToggle);
        animate($elToToggle, openHeight);
    }

    function hide($elToToggle) {
        setOpenHeight($elToToggle);
        animate($elToToggle, 0);
    }

    function updateToggledElements(state, $elementToToggle) {
        if (state == 'shown') {
            elementsToToggle[$elementToToggle.selector] = {state:state, $elementToToggle:$elementToToggle};
        } else {
            delete elementsToToggle[$elementToToggle.selector];
        }
    }

    function toggle(options) {
        var $elClicked = options.$elClicked,
            $elementToToggle = options.$container || $($elClicked.attr('data-toggle')),
            action = options.action,
            state = $elClicked && $elClicked.attr('data-toggle-state');
        hasContentChanged = (options.contentChanged !== undefined) ? options.contentChanged : false;
        if (state === 'shown' || action == 'hide') {
            hide($elementToToggle);
            state = 'hidden';
        } else {
            show($elementToToggle);
            state = 'shown';
        }
        updateToggledElements(state, $elementToToggle);
        if (!$elClicked) {
            $elClicked = $('[data-toggle="#' + $elementToToggle.attr('id') + '"]');
        }
        if ($elClicked && state !== $elClicked.attr('data-toggle-state')) {
            updateText($elClicked, state);
            $elClicked.attr('data-toggle-state', state);
        }

    }

    $(window).on('skycom.resizeend', function () {
        hasResized = true;
        var item, i;
        for (i in elementsToToggle) {
            item = elementsToToggle[i];
            if (item.state === 'shown') {
                var openHeight = getOpenHeight(item.$elementToToggle);
                animate(item.$elementToToggle, openHeight);
            }
        }
        hasResized = false;
    });

    return toggle;

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/toggle', [], function() {
        return toolkit.toggle();
    });
} else {
    toolkit.toggle = toolkit.toggle();
}
;
var hljs=new function(){function l(o){return o.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function b(p){for(var o=p.firstChild;o;o=o.nextSibling){if(o.nodeName.toUpperCase()=="CODE"){return o}if(!(o.nodeType==3&&o.nodeValue.match(/\s+/))){break}}}function h(p,o){return Array.prototype.map.call(p.childNodes,function(q){if(q.nodeType==3){return o?q.nodeValue.replace(/\n/g,""):q.nodeValue}if(q.nodeName.toUpperCase()=="BR"){return"\n"}return h(q,o)}).join("")}function a(q){var p=(q.className+" "+(q.parentNode?q.parentNode.className:"")).split(/\s+/);p=p.map(function(r){return r.replace(/^language-/,"")});for(var o=0;o<p.length;o++){if(e[p[o]]||p[o]=="no-highlight"){return p[o]}}}function c(q){var o=[];(function p(r,s){for(var t=r.firstChild;t;t=t.nextSibling){if(t.nodeType==3){s+=t.nodeValue.length}else{if(t.nodeName.toUpperCase()=="BR"){s+=1}else{if(t.nodeType==1){o.push({event:"start",offset:s,node:t});s=p(t,s);o.push({event:"stop",offset:s,node:t})}}}}return s})(q,0);return o}function j(p,r,v){var q=0;var y="";var s=[];function u(){if(!p.length||!r.length){return p.length?p:r}if(p[0].offset!=r[0].offset){return(p[0].offset<r[0].offset)?p:r}return r[0].event=="start"?p:r}function t(A){function z(B){return" "+B.nodeName+'="'+l(B.value)+'"'}y+="<"+A.nodeName.toLowerCase()+Array.prototype.map.call(A.attributes,z).join("")+">"}function x(z){y+="</"+z.nodeName.toLowerCase()+">"}function o(z){(z.event=="start"?t:x)(z.node)}while(p.length||r.length){var w=u();y+=l(v.substr(q,w[0].offset-q));q=w[0].offset;if(w==p){s.reverse().forEach(x);do{o(w.splice(0,1)[0]);w=u()}while(w==p&&w.length&&w[0].offset==q);s.reverse().forEach(t)}else{if(w[0].event=="start"){s.push(w[0].node)}else{s.pop()}o(w.splice(0,1)[0])}}return y+l(v.substr(q))}function f(r){function o(s){return(s&&s.source)||s}function p(t,s){return RegExp(o(t),"m"+(r.cI?"i":"")+(s?"g":""))}function q(z,x){if(z.compiled){return}z.compiled=true;var u=[];if(z.k){var s={};function A(B,t){if(r.cI){t=t.toLowerCase()}t.split(" ").forEach(function(C){var D=C.split("|");s[D[0]]=[B,D[1]?Number(D[1]):1];u.push(D[0])})}z.lR=p(z.l||"\\b"+hljs.IR+"\\b(?!\\.)",true);if(typeof z.k=="string"){A("keyword",z.k)}else{for(var y in z.k){if(!z.k.hasOwnProperty(y)){continue}A(y,z.k[y])}}z.k=s}if(x){if(z.bWK){z.b="\\b("+u.join("|")+")\\b(?!\\.)\\s*"}z.bR=p(z.b?z.b:"\\B|\\b");if(!z.e&&!z.eW){z.e="\\B|\\b"}if(z.e){z.eR=p(z.e)}z.tE=o(z.e)||"";if(z.eW&&x.tE){z.tE+=(z.e?"|":"")+x.tE}}if(z.i){z.iR=p(z.i)}if(z.r===undefined){z.r=1}if(!z.c){z.c=[]}for(var w=0;w<z.c.length;w++){if(z.c[w]=="self"){z.c[w]=z}q(z.c[w],z)}if(z.starts){q(z.starts,x)}var v=[];for(var w=0;w<z.c.length;w++){v.push(o(z.c[w].b))}if(z.tE){v.push(o(z.tE))}if(z.i){v.push(o(z.i))}z.t=v.length?p(v.join("|"),true):{exec:function(t){return null}}}q(r)}function d(E,G,C,M){function o(r,P){for(var O=0;O<P.c.length;O++){var N=P.c[O].bR.exec(r);if(N&&N.index==0){return P.c[O]}}}function s(N,r){if(N.e&&N.eR.test(r)){return N}if(N.eW){return s(N.parent,r)}}function t(r,N){return !C&&N.i&&N.iR.test(r)}function y(O,r){var N=H.cI?r[0].toLowerCase():r[0];return O.k.hasOwnProperty(N)&&O.k[N]}function I(){var N=l(w);if(!B.k){return N}var r="";var Q=0;B.lR.lastIndex=0;var O=B.lR.exec(N);while(O){r+=N.substr(Q,O.index-Q);var P=y(B,O);if(P){v+=P[1];r+='<span class="'+P[0]+'">'+O[0]+"</span>"}else{r+=O[0]}Q=B.lR.lastIndex;O=B.lR.exec(N)}return r+N.substr(Q)}function z(){if(B.sL&&!e[B.sL]){return l(w)}var N=B.subLanguageMode=="continuous"?B.top:undefined;var r=B.sL?d(B.sL,w,true,N):g(w);if(B.r>0){v+=r.keyword_count;A+=r.r}B.top=r.top;return'<span class="'+r.language+'">'+r.value+"</span>"}function L(){return B.sL!==undefined?z():I()}function K(O,r){var N=O.cN?'<span class="'+O.cN+'">':"";if(O.rB){x+=N;w=""}else{if(O.eB){x+=l(r)+N;w=""}else{x+=N;w=r}}B=Object.create(O,{parent:{value:B}})}function D(N,r){w+=N;if(r===undefined){x+=L();return 0}var P=o(r,B);if(P){x+=L();K(P,r);return P.rB?0:r.length}var Q=s(B,r);if(Q){var O=B;if(!(O.rE||O.eE)){w+=r}x+=L();do{if(B.cN){x+="</span>"}A+=B.r;B=B.parent}while(B!=Q.parent);if(O.eE){x+=l(r)}w="";if(Q.starts){K(Q.starts,"")}return O.rE?0:r.length}if(t(r,B)){throw new Error('Illegal lexem "'+r+'" for mode "'+(B.cN||"<unnamed>")+'"')}w+=r;return r.length||1}var H=e[E];if(!H){throw new Error('Unknown language: "'+E+'"')}f(H);var B=M||H;var x="";for(var F=B;F!=H;F=F.parent){if(F.cN){x='<span class="'+F.cN+'">'+x}}var w="";var A=0;var v=0;try{var u,q,p=0;while(true){B.t.lastIndex=p;u=B.t.exec(G);if(!u){break}q=D(G.substr(p,u.index-p),u[0]);p=u.index+q}D(G.substr(p));for(var F=B;F.parent;F=F.parent){if(F.cN){x+="</span>"}}return{r:A,keyword_count:v,value:x,language:E,top:B}}catch(J){if(J.message.indexOf("Illegal")!=-1){return{r:0,keyword_count:0,value:l(G)}}else{throw J}}}function g(s){var o={keyword_count:0,r:0,value:l(s)};var q=o;for(var p in e){if(!e.hasOwnProperty(p)){continue}var r=d(p,s,false);r.language=p;if(r.keyword_count+r.r>q.keyword_count+q.r){q=r}if(r.keyword_count+r.r>o.keyword_count+o.r){q=o;o=r}}if(q.language){o.second_best=q}return o}function i(q,p,o){if(p){q=q.replace(/^((<[^>]+>|\t)+)/gm,function(r,v,u,t){return v.replace(/\t/g,p)})}if(o){q=q.replace(/\n/g,"<br>")}return q}function m(r,u,p){var v=h(r,p);var t=a(r);if(t=="no-highlight"){return}var w=t?d(t,v,true):g(v);t=w.language;var o=c(r);if(o.length){var q=document.createElementNS("http://www.w3.org/1999/xhtml","pre");q.innerHTML=w.value;w.value=j(o,c(q),v)}w.value=i(w.value,u,p);var s=r.className;if(!s.match("(\\s|^)(language-)?"+t+"(\\s|$)")){s=s?(s+" "+t):t}r.innerHTML=w.value;r.className=s;r.result={language:t,kw:w.keyword_count,re:w.r};if(w.second_best){r.second_best={language:w.second_best.language,kw:w.second_best.keyword_count,re:w.second_best.r}}}function n(){if(n.called){return}n.called=true;Array.prototype.map.call(document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","pre"),b).filter(Boolean).forEach(function(o){m(o,hljs.tabReplace)})}function k(){window.addEventListener("DOMContentLoaded",n,false);window.addEventListener("load",n,false)}var e={};this.LANGUAGES=e;this.highlight=d;this.highlightAuto=g;this.fixMarkup=i;this.highlightBlock=m;this.initHighlighting=n;this.initHighlightingOnLoad=k;this.IR="[a-zA-Z][a-zA-Z0-9_]*";this.UIR="[a-zA-Z_][a-zA-Z0-9_]*";this.NR="\\b\\d+(\\.\\d+)?";this.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";this.BNR="\\b(0b[01]+)";this.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|\\.|-|-=|/|/=|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";this.BE={b:"\\\\[\\s\\S]",r:0};this.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[this.BE],r:0};this.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[this.BE],r:0};this.CLCM={cN:"comment",b:"//",e:"$"};this.CBLCLM={cN:"comment",b:"/\\*",e:"\\*/"};this.HCM={cN:"comment",b:"#",e:"$"};this.NM={cN:"number",b:this.NR,r:0};this.CNM={cN:"number",b:this.CNR,r:0};this.BNM={cN:"number",b:this.BNR,r:0};this.REGEXP_MODE={cN:"regexp",b:/\//,e:/\/[gim]*/,i:/\n/,c:[this.BE,{b:/\[/,e:/\]/,r:0,c:[this.BE]}]};this.inherit=function(q,r){var o={};for(var p in q){o[p]=q[p]}if(r){for(var p in r){o[p]=r[p]}}return o}}();hljs.LANGUAGES.diff=function(a){return{c:[{cN:"chunk",b:"^\\@\\@ +\\-\\d+,\\d+ +\\+\\d+,\\d+ +\\@\\@$",r:10},{cN:"chunk",b:"^\\*\\*\\* +\\d+,\\d+ +\\*\\*\\*\\*$",r:10},{cN:"chunk",b:"^\\-\\-\\- +\\d+,\\d+ +\\-\\-\\-\\-$",r:10},{cN:"header",b:"Index: ",e:"$"},{cN:"header",b:"=====",e:"=====$"},{cN:"header",b:"^\\-\\-\\-",e:"$"},{cN:"header",b:"^\\*{3} ",e:"$"},{cN:"header",b:"^\\+\\+\\+",e:"$"},{cN:"header",b:"\\*{5}",e:"\\*{5}$"},{cN:"addition",b:"^\\+",e:"$"},{cN:"deletion",b:"^\\-",e:"$"},{cN:"change",b:"^\\!",e:"$"}]}}(hljs);hljs.LANGUAGES.javascript=function(a){return{k:{keyword:"in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const",literal:"true false null undefined NaN Infinity"},c:[a.ASM,a.QSM,a.CLCM,a.CBLCLM,a.CNM,{b:"("+a.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[a.CLCM,a.CBLCLM,a.REGEXP_MODE,{b:/</,e:/>;/,sL:"xml"}],r:0},{cN:"function",bWK:true,e:/{/,k:"function",c:[{cN:"title",b:/[A-Za-z$_][0-9A-Za-z$_]*/},{cN:"params",b:/\(/,e:/\)/,c:[a.CLCM,a.CBLCLM],i:/["'\(]/}],i:/\[|%/}]}}(hljs);hljs.LANGUAGES.css=function(a){var b="[a-zA-Z-][a-zA-Z0-9_-]*";var c={cN:"function",b:b+"\\(",e:"\\)",c:["self",a.NM,a.ASM,a.QSM]};return{cI:true,i:"[=/|']",c:[a.CBLCLM,{cN:"id",b:"\\#[A-Za-z0-9_-]+"},{cN:"class",b:"\\.[A-Za-z0-9_-]+",r:0},{cN:"attr_selector",b:"\\[",e:"\\]",i:"$"},{cN:"pseudo",b:":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"},{cN:"at_rule",b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{cN:"at_rule",b:"@",e:"[{;]",c:[{cN:"keyword",b:/\S+/},{b:/\s/,eW:true,eE:true,r:0,c:[c,a.ASM,a.QSM,a.NM]}]},{cN:"tag",b:b,r:0},{cN:"rules",b:"{",e:"}",i:"[^\\s]",r:0,c:[a.CBLCLM,{cN:"rule",b:"[^\\s]",rB:true,e:";",eW:true,c:[{cN:"attribute",b:"[A-Z\\_\\.\\-]+",e:":",eE:true,i:"[^\\s]",starts:{cN:"value",eW:true,eE:true,c:[c,a.NM,a.QSM,a.ASM,a.CBLCLM,{cN:"hexcolor",b:"#[0-9A-Fa-f]+"},{cN:"important",b:"!important"}]}}]}]}]}}(hljs);hljs.LANGUAGES.xml=function(a){var c="[A-Za-z0-9\\._:-]+";var b={eW:true,r:0,c:[{cN:"attribute",b:c,r:0},{b:'="',rB:true,e:'"',c:[{cN:"value",b:'"',eW:true}]},{b:"='",rB:true,e:"'",c:[{cN:"value",b:"'",eW:true}]},{b:"=",c:[{cN:"value",b:"[^\\s/>]+"}]}]};return{cI:true,c:[{cN:"pi",b:"<\\?",e:"\\?>",r:10},{cN:"doctype",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},{cN:"comment",b:"<!--",e:"-->",r:10},{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{title:"style"},c:[b],starts:{e:"</style>",rE:true,sL:"css"}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{title:"script"},c:[b],starts:{e:"<\/script>",rE:true,sL:"javascript"}},{b:"<%",e:"%>",sL:"vbscript"},{cN:"tag",b:"</?",e:"/?>",r:0,c:[{cN:"title",b:"[^ /><]+"},b]}]}}(hljs);hljs.LANGUAGES.http=function(a){return{i:"\\S",c:[{cN:"status",b:"^HTTP/[0-9\\.]+",e:"$",c:[{cN:"number",b:"\\b\\d{3}\\b"}]},{cN:"request",b:"^[A-Z]+ (.*?) HTTP/[0-9\\.]+$",rB:true,e:"$",c:[{cN:"string",b:" ",e:" ",eB:true,eE:true}]},{cN:"attribute",b:"^\\w",e:": ",eE:true,i:"\\n|\\s|=",starts:{cN:"string",e:"$"}},{b:"\\n\\n",starts:{sL:"",eW:true}}]}}(hljs);hljs.LANGUAGES.json=function(a){var e={literal:"true false null"};var d=[a.QSM,a.CNM];var c={cN:"value",e:",",eW:true,eE:true,c:d,k:e};var b={b:"{",e:"}",c:[{cN:"attribute",b:'\\s*"',e:'"\\s*:\\s*',eB:true,eE:true,c:[a.BE],i:"\\n",starts:c}],i:"\\S"};var f={b:"\\[",e:"\\]",c:[a.inherit(c,{cN:null})],i:"\\S"};d.splice(d.length,0,b,f);return{c:d,k:e,i:"\\S"}}(hljs);

//modified for AMD/RequireJS.
//by Peter Mouland
if (typeof window.define === "function" && window.define.amd) {
    define('lib/highlight', [],function() {
        return hljs;
    });
};
if (typeof toolkit==='undefined') toolkit={};
toolkit.diff = (function(hljs){

    function findFiles(opts){
        var oldRoute = opts.oldRoute,
            newRoute = opts.newRoute;
        clear();
        $('a[data-diff]').each(function(){
            var demo, newFile, oldFile,
                dir = $(this).attr('data-diff');
            var demos = $(this).attr('data-diff-demos') || '';
            var arrDemos = demos.split(',');
            var componentName = dir.split('/')[1];
            for (var i in arrDemos){
                demo = arrDemos[i];
                newFile = newRoute + '/' + dir + (demo ? '/' + demo : '');
                oldFile = oldRoute + '/' + dir + (demo ? '/' + demo : '');
                new CompareCodeBase({
                    name: componentName,
                    demo: demo,
                    newCodeSource: newFile,
                    oldCodeSource: oldFile
                });
            }
        });
    }

    function getDiff(name, ext, matrix, a1, a2, x, y){
        if(x>0 && y>0 && a1[y-1]===a2[x-1]){
            getDiff(name, ext, matrix, a1, a2, x-1, y-1);
            addRow(name, ext, x, y, ' ', a1[y-1]);
        } else {
            if(x>0 && (y===0 || matrix[y][x-1] >= matrix[y-1][x])){
                getDiff(name, ext, matrix, a1, a2, x-1, y);
                addRow(name, ext, x, '', '+', a2[x-1]);
            } else if(y>0 && (x===0 || matrix[y][x-1] < matrix[y-1][x])){
                getDiff(name, ext, matrix, a1, a2, x, y-1);
                addRow(name, ext, '', y, '-', a1[y-1], '');
            } else {
                return;
            }
        }
    }

    function prepareCode(name, ext, a1, a2){
        var matrix = new Array(a1.length+1);
        var x,y;

        for( y=0; y<matrix.length; y++){
            matrix[y] = new Array(a2.length+1);
            for( x=0; x<matrix[y].length; x++){
                matrix[y][x] = 0;
            }
        }

        for( y=1; y<matrix.length; y++){
            for( x=1; x<matrix[y].length; x++){
                if(a1[y-1]===a2[x-1]){
                    matrix[y][x] = 1 + matrix[y-1][x-1];
                } else {
                    matrix[y][x] = Math.max(matrix[y-1][x], matrix[y][x-1]);
                }
            }
        }
        return {
            matrix: matrix,
            xPosition: x-1,
            yPosition: y-1
        };
    }

    function addRow(name, ext, x, y, type, rij){
        var tableBody = $(document.getElementById(ext + '-' + name + '-table')).find('tbody')[0],
            header = document.getElementById(name + '-header'),
            tr = document.createElement('tr'),
            td1 = document.createElement('td'),
            td2 = document.createElement('td'),
            td3 = document.createElement('td'),
            txt1 = document.createTextNode(y),
            txt2 = document.createTextNode(x),
            txt3 = document.createTextNode(type + ' ' + rij);

        if(type==='+'){
            tr.className='add';
            $(header).addClass('add');
            $(tableBody).parents('.togglee').addClass('add').prev().addClass('add');
        } else if(type==='-'){
            tr.className='del';
            $(header).addClass('del');
            $(tableBody).parents('.togglee').addClass('del').prev().addClass('del');
        }

        td1.className = 'codekolom';
        td2.className = 'codekolom';
        td3.className = 'bredecode';
        td1.appendChild(txt1);
        td2.appendChild(txt2);
        td3.appendChild(txt3);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tableBody.appendChild(tr);
        hljs.highlightBlock(td3);
    }

    function clear(){
        $('.sky-form .error').text('');
        $('.togglee').remove();
        $('.has-toggle').remove();
    }

    function CompareCodeBase(options){
        this.name = options.name;
        this.newCodeSource = options.newCodeSource;
        this.oldCodeSource = options.oldCodeSource;
        this.demoName = options.demo;
        this.complete = {};

        this.getCode();
    }

    CompareCodeBase.prototype.getCode = function(){
        this.getFileByExtension('new','html');
        this.getFileByExtension('old','html');
        this.getFileByExtension('new','js');
        this.getFileByExtension('old','js');
    };

    CompareCodeBase.prototype.getFileByExtension = function(age, ext){
        var self = this;
        var version = age + ext;
        var dfd = $.ajax({ crossDomain: true, cache: false, url:this[age + 'CodeSource'] + '.' + ext});
        dfd.always(function(data){
            self[version] = (typeof data === 'string') ? data : '';
            self.addToPage(version);
            if (!self.complete[self.name + '.' + ext]){
                self.complete[self.name + '.' + ext] = [age];
            } else {
                self.compare(ext);
            }
        });
    };

    CompareCodeBase.prototype.addToPage = function(version){

        this.fullName = this.name + (this.demoName ? '-' + this.demoName : '');
        this.$container = $('[data-toggle="' + this.name +'"]');
        this.$header = $('h3#' + this.name + '-header');
        this.$tabList = this.$container.find('.tab-list');

        this.addContainer();
        this.addTab();
        this.saveCode(version);
        this.bindEvents();
    };

    CompareCodeBase.prototype.addContainer = function(){
        if (this.$container.length){ return ; }

        this.$header = $('<h3 class="has-toggle demo-h3 pod-title smaller" id="' + this.name + '-header"><span class="toggler" for="' + this.name + '"></span>' + this.name + '</h3>');
        this.$container = $('<div class="togglee" data-toggle="' + this.name + '"></div>');
        this.$tabList = $('<ul class="tab-list clearfix" ></ul>');
        this.$container.append(this.$tabList);
        $('[data-diff-container]')
            .append(this.$header)
            .append(this.$container);
    };

    CompareCodeBase.prototype.createTable = function(ext){
        return $('<div class="code-container"><pre><table id="' + ext + '-' + this.fullName + '-table"><thead><tr><th colspan="3">' + ext.toUpperCase() + '</th></tr></thead><tbody></tbody></table></pre></div> ');
    };

    CompareCodeBase.prototype.addTab = function(){
        if (this.$container.find('#' + this.fullName + '-tab').length){ return ; }

        var $tabListItem = $('<li for="' + this.fullName + '-tab">' + (this.demoName ? this.demoName : 'default') + '</li>');
        this.$tabList.append($tabListItem);

        var $tab = $('<div class="tab hidden" id="' + this.fullName + '-tab"></div>');

        $tab.append(this.createTable('html'))
            .append(this.createTable('js'))
            .append( $('<textarea id="newhtml-' + this.fullName + '" class="hidden latest"></textarea>'))
            .append($('<textarea id="oldhtml-' + this.fullName + '" class=hidden></textarea>'))
            .append( $('<textarea id="newjs-' + this.fullName + '" class="hidden latest"></textarea>'))
            .append($('<textarea id="oldjs-' + this.fullName + '" class=hidden></textarea>'));

        this.$container.append($tab);
    };

    CompareCodeBase.prototype.saveCode = function(version){
        $('#' + version + '-' + this.fullName).val(this[version]);
    };

    CompareCodeBase.prototype.changeTab = function(){
        var $li = $(this);
        $li.closest('.togglee').find('.tab-list > li').removeClass('medium');
        $li.closest('.togglee').find('.tab').addClass('hidden');
        $('#' + $li.attr('for')).removeClass('hidden');
        $li.addClass('medium');
    };

    CompareCodeBase.prototype.bindEvents = function(){
        this.$tabList.on('click', 'li', this.changeTab);
        this.$tabList.find('li').first().click();
    };

    CompareCodeBase.prototype.compare = function(ext){
        var oldCode = (this['old' + ext]) ? this['old' + ext].split('\n') : '' ;
        var newCode = (this['new' + ext]) ? this['new' + ext].split('\n') : '' ;
        var codeObj = prepareCode(this.fullName, ext, oldCode, newCode);
        getDiff(this.fullName, ext, codeObj.matrix, oldCode, newCode, codeObj.xPosition, codeObj.yPosition);
    };

    return findFiles;

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/diff', ['lib/highlight'], function(hljs) {
        return toolkit.diff(hljs);
    });
} else {
    toolkit.diff = toolkit.diff(hljs);
};
if (typeof toolkit==='undefined') toolkit={};
toolkit.focus = (function () {
    

    var tabKey = false;
    var focusClass = 'has-focus';

    function bindEvents(){
        $(document)
            .on('click keyup',keyUp)
            .on('keydown', keyDown)
            .on('focus', "a, input, button, select, *[tabindex]", addClass)
            .on('blur', "a, input, button, select, *[tabindex]", removeClass);
    }

    function addClass(e) {
        if (tabKey) {
            $(e.currentTarget).addClass(focusClass);
        }
    }

    function removeClass(e) {
        $(e.currentTarget).removeClass(focusClass);
    }

    function keyDown(e){
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
        if (KeyID == 9) {tabKey = true;}
    }

    function keyUp(e){
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
        if (KeyID == 9) {tabKey = false;}
    }

    function apply(el){
        $(el).addClass(focusClass);
        el.focus();
    }

    bindEvents();

    return {
        apply: apply,
        className: focusClass
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/focus', [], function() {
        
        return toolkit.focus();
    });
} else {
    toolkit.focus = toolkit.focus();
};
/*jshint strict: true */
/*global jQuery:false */

if (typeof toolkit==='undefined') toolkit={};
toolkit.validation = (function ($) {
    

    function isSafari() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari')!=-1){
            return (ua.indexOf('chrome') === -1);
        }
        return false;
    }

    function getValue($el){
        var $radiosWithSameName = null;
        return ($el.is('[type=checkbox]')) ?
            $el.is(':checked') : ($el.is('[type=radio]') ?
            // Cache all radio buttons (in the same form) with the same name as this one
            ($radiosWithSameName = $el.parents('form')
                // **TODO: escape the radio buttons' name before using it in the jQuery selector
                .find('input[name="' + $el.attr('name') + '"]'))
                .filter(':checked')
                .length > 0 : $el.val());
    }

    function InvalidInputHelper(input, options) {
        if (options.emptyText){
            input.setCustomValidity(options.defaultText);
        }

        function changeOrInput() {
            if (input.value === "") {
                if (options.emptyText){
                    input.setCustomValidity(options.emptyText);
                }
            } else {
                input.setCustomValidity("");
            }
        }

        function invalid() {
            if (input.value === "") {
                if (options.emptyText){
                    input.setCustomValidity(options.emptyText);
                }
            } else if (options.invalidText) {
                input.setCustomValidity(options.invalidText);
            }
        }

        input.addEventListener("change", changeOrInput);
        input.addEventListener("input", changeOrInput);
        input.addEventListener("invalid", invalid);
    }

    var useCustomFormErrors =  (!('required' in document.createElement('input')) ||
                                !('pattern' in document.createElement('input')) || isSafari());
    var canCustomiseHTML5Message = ('setCustomValidity' in document.createElement('input'));

    function Validation($container) {
        this.$container = $container;
        this.$requiredInputs = $container.find('*[required]');
        this.$patternInputs = $container.find('*[pattern]');
        this.errors = [];
        this.hasError = false;
        this.customiseHTML5Messages();
        this.bindEvents();
    }

    Validation.prototype = {
        bindEvents: function() {
            var validation = this;
            //feature detect the required attribute
            if (useCustomFormErrors) {
                validation.$container.on("submit", function(e) {
                    validation.validate(e);
                });
            }
        },

        customiseHTML5Messages: function(){
            if (!canCustomiseHTML5Message) return;
            this.$container.find('.feedback[data-for]').each(function(){
                var el = document.getElementById($(this).attr('data-for'));
                new InvalidInputHelper(el, {invalidText: this.innerText || this.innerHTML});
            });
        },

        addErrorMessageToInput: function($input) {
            var inputId     = $input.attr('id'),
                $descriptor = this.$container.find('label[for=' + inputId + ']'),
                $feedbacks  = this.$container.find('.feedback[data-for=' + inputId + ']');

            this.hasError = true;

            if ($feedbacks.length > 0) {
                $feedbacks.removeClass('hidden');
            } else {
                //create a feedback if one does not exist
                $feedbacks = $('<span class="form-error feedback" data-for="' + $input.attr('id') + '">' + $descriptor.text() + ' is required</span>').appendTo($input.closest('.row'));
            }

            if (!$input.hasClass('form-error')) {
                $input.addClass('form-error');
                $('<i class="form-error skycon-warning"></i>').insertAfter($input);
            }

            this.errors.push($feedbacks.first());
        },

        removeErrorsFromInput: function($input) {
            var inputId     = $input.attr('id'),
                $feedbacks  = this.$container.find('.feedback[data-for=' + inputId + ']');

            if ($input.hasClass('form-error')) {
                $input.removeClass('form-error');
                $input.next('.skycon-warning').remove();
            }
            $feedbacks.addClass('hidden');
        },

        createErrorsAtTop: function() {
            var errorHtml = '<div id="feedback-list-container" class="row" aria-live="polite"><p><i class="form-error skycon-warning"></i>Please correct the highlighted fields below:</p><ul class="feedback-list">',
                i;

            for (i = 0; i < this.errors.length; i++) {
                errorHtml += '<li class="form-error">' + this.errors[i].text() + '</li>';
            }

            errorHtml += '</ul></div>';

            this.$container.prepend(errorHtml);
            // scroll to the top of the forms
            window.location.href = window.location.href.split('#')[0] + '#feedback-list-container';
        },

        resetErrors: function() {
            this.hasError = false;
            this.errors = [];
            this.$container.find('#feedback-list-container').remove();
        },

        validateRequired: function (index, input) {
            var $input = $(input),
                validation = this;
            if ($input.val() === '') {
                validation.addErrorMessageToInput($input);
            } else {
                validation.removeErrorsFromInput($input);
            }
        },

        validatePattern: function (index, input) {
            var $input = $(input),
                validation = this,
                pattern = $input.attr('pattern'),
                re = new RegExp('^(?:' + pattern + ')$'),
                value = getValue($input);
            if (value && !re.test(value)) {
                validation.addErrorMessageToInput($input);
            } else {
                validation.removeErrorsFromInput($input);
            }
        },

        validate: function(e) {
            var validation = this;
            validation.resetErrors();

            this.$requiredInputs.each(this.validateRequired.bind(validation));
            this.$patternInputs.each(this.validatePattern.bind(validation));

            // create list of error messages at the top of the form if there has been any errors
            if (validation.hasError) {
                e.preventDefault();
                validation.createErrorsAtTop();
            }
        }

    };

    $.fn.validation = function() {
        return this.each(function() {
            var validation = new Validation($(this));
        });
    };

    return Validation;

});
if (typeof window.define === "function" && window.define.amd) {
    define('utils/validation', [], function() {
        
        return toolkit.validation(jQuery);
    });
} else {
    toolkit.validation =  toolkit.validation(jQuery);
};
if (typeof toolkit==='undefined') toolkit={};
toolkit.event = (function () {
    

    var resize = null;

    function bindEvents(){
        on(window,'resize',function(){
            clearTimeout(resize);
            resize = setTimeout(emitResizeEnd,200);
        });
    }

    function emitResizeEnd(){
        emit(window,'resizeend'); // raw JS version
        $(window).trigger('resizeend'); // jQuery version
    }

    function on(el, eventName, exec){
        if (el.addEventListener) {
            el.addEventListener(eventName, exec, false);
        } else {
            el.attachEvent(eventName, exec);
        }
    }

    function emit(el, eventName) {
        var event;
        if (document.createEvent) {
            event = new Event(eventName);
            el.dispatchEvent(event);
        } else {
            event = document.createEventObject();
            el.fireEvent('on' + eventName, event);
        }
    }

    bindEvents();

    return {
        on: on,
        emit: emit
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/event', [], function() {
        
        return toolkit.event();
    });
} else {
    toolkit.event = toolkit.event();
};
/**
 purpose:
 to automatically hook into the bootstrap html and shows/hides tabs.
 Works based registering the tabs 'hash' with the changeTab function.
 no onclick events needed.
**/
if (typeof toolkit==='undefined') toolkit={};
toolkit.inPageNav = (function(hash) {
//    todo: accessibility check when moving tabs about - perhaps dont have 2 separate lists.
//    todo: move 'more' link to outside the ul

    function InPageNav($element){
        this.$tabContainer = $element;
        this.$tabs = $element.find('li[role=tab]');
        this.$tabTargets = $element.find('div[role=tabpanel]');
        this.$showMore = $element.find('.dropdown-tab-select > a');
        this.$moreTabsContainer = $element.find('.dropdown-tab-select');
        this.$moreTabsLink = $element.find('.more-tabs');
        this.numberOfTabsToShow = 0;

        this.saveTabOrder();
        this.bindEvents();
        this.initTabs();
    }

    InPageNav.prototype = {
        bindEvents : function(){
            var self = this;
            hash.register(this.getHashList(), this.changeTab.bind(self));
            this.$tabs.on('click', function(e){
                self.changeTab($(this).find('a').attr('href'));
            });
            this.$showMore.on('click', function(e){
                e.preventDefault();
                self.toggleShowMore();
            });
            $('body').on('click', this.hideMore.bind(self));
            $(window).bind('skycom.resizeend',  this.initTabs.bind(self));
        },

        getHashList: function() {
            var arrHash = [];
            this.$tabs.each(function(){
                arrHash.push($(this).attr('aria-controls'));
            });
            return arrHash;
        },

        saveTabOrder: function(){
            this.$tabs.each(function(i){
                $(this).attr('data-position', i);
            });
        },

        initTabs: function(){
            this.moveTabsToList();
            this.moveTabsToDropdown();
            if (!this.$tabTargets.filter('.selected').length){
                this.changeTab(this.$tabTargets.first()[0].id);
            }
        },

        changeTab: function(controlId){
            controlId = controlId.replace('#!','');
            var $thisTab = $("#" + controlId.replace('-tab-contents','') + "-tab"),
                $thisTabTarget = $("#" + controlId);
            this.$tabTargets.add(this.$tabs).removeClass("selected");
            $thisTab.add($thisTabTarget).addClass('selected');
            this.initTabs();
        },

        hideMore: function(e){
            if ($(e.target).closest(this.$showMore).length) { return; }
            this.toggleShowMore('hide');
        },

        toggleShowMore: function(type){
            var action = (this.$moreTabsLink.hasClass('dropdown-tab-selected') || type==='hide') ? 'remove' : 'add';
            this.$showMore.add(this.$moreTabsLink)[action + 'Class']('dropdown-tab-selected');
        },

        getNumberOfTabsToShow: function() {
            var containerWidth = this.$tabContainer.outerWidth(true) -
                    this.$moreTabsContainer.show().outerWidth(true) -
                    this.$tabs.filter('.selected').outerWidth(true),
                totalWidth = 0,
                numberOfTabs = 0;
            this.$tabs.not('.selected').attr('style','float:left').each(function () {
                totalWidth += ($(this).outerWidth(true));
                if (totalWidth > containerWidth) { return ; }
                numberOfTabs++;
            });
            this.$tabs.add(this.$moreTabsContainer).removeAttr('style');
            return numberOfTabs;
        },

        moveTabsToList: function() {
            var self = this;
            this.$tabs.each(function (i) {
                $(this).appendTo(self.$tabContainer.find('.tabs'));
            });
            sortTabs(this.$tabContainer.find('.tabs'));
            this.numberOfTabsToShow = this.getNumberOfTabsToShow();
        },

        moveTabsToDropdown: function() {
            var self = this;
            this.$tabs.not('.selected').each(function (i) {
                if(i < self.numberOfTabsToShow) { return ; }
                $(this).appendTo(self.$moreTabsLink);
                self.$moreTabsContainer.show();
            });
            sortTabs(this.$moreTabsLink);
        }
    };

    function sortTabs($el) {
        var list = [];
        $el.find('li').each(function () {
            list.push($(this).attr('data-position'));
        });
        list.sort();
        $.each(list, function () {
            $el.find('li[data-position="'+this+'"]').appendTo($el);
        });
    }

    $.fn.inPageNav = function() {
        return this.each(function() {
            var inPageNav = new InPageNav($(this));
        });
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('components/inPageNav', ['utils/hashManager'], function(hash) {
        return toolkit.inPageNav(hash);
    });
} else {
    toolkit.inPageNav = toolkit.inPageNav(toolkit.hashManager);
};
/*global jQuery:false */
if (typeof toolkit==='undefined') toolkit={};
toolkit.accordion = (function (toggle) {
    

    function Accordion($element){
        this.$container = $element;
        this.$headings = $element.find('.accordion-heading');
        this.bindEvents();
    }

    function rotateIcon($elClicked) {
        $elClicked.find('i').toggleClass('rotate-180');
    }

    Accordion.prototype = {
        bindEvents:function(){
            this.$headings.on("click",this.toggleContent.bind(this));
        },
        toggleContent:function(e){
            e.preventDefault();
            var $heading = $(e.currentTarget);
            toggle({$elClicked:$heading});
            rotateIcon($heading);
        }
    };

    $.fn.accordion = function() {
        return this.each(function() {
            var accordion = new Accordion($(this));
        });
    };

    return Accordion;
});

if (typeof window.define === "function" && window.define.amd) {
    define('components/accordion', ['utils/toggle'], function(toggle) {
        return toolkit.accordion(toggle);
    });
} else {
    toolkit.accordion = toolkit.accordion(toolkit.toggle);
}
;
if (typeof toolkit==='undefined') toolkit={};
toolkit.datePicker = (function () {

    var monthNames=["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
        currentDate = {
            day: new Date().getDate(),
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
        };

    function daysInMonth(month, year) {
        return [null, 31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

    function firstDay(month, year) {
        var day = new Date(year, month - 1, 1).getDay();
        return (day === 0) ? 7 : day - 1;
    }

    function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }

    function normaliseDate(date){
        return date.toString().length < 2 ? "0" + date : date;
    }

    function DatePicker($container) {
        this.calendarDate = $.extend(currentDate);
        this.$container = $container;
        this.$day = $container.find('.day');
        this.$month = $container.find('.month');
        this.$year = $container.find('.year');
        this.addCalendarHTML();
        this.bindEvents();
    }

    DatePicker.prototype = {

        bindEvents: function() {
            var datePicker = this;

            datePicker.$calendar
                .on('click','.date', datePicker.selectDate.bind(datePicker))
                .on('click', '.prev', datePicker.displayPreviousMonth.bind(datePicker))
                .on('click', '.next', datePicker.displayNextMonth.bind(datePicker));

            datePicker.$container
                .on('keyup', 'input', datePicker.updateCalendarView.bind(datePicker))
                .on('focus', 'input',datePicker.show.bind(datePicker))
                .on('keydown', 'input', function(e) {
                    if (e.keyCode == 9) {
                        datePicker.hide();
                    }
                });

            $(document)
                .on('keydown', function(e) {
                    if (e.keyCode == 27) {
                        datePicker.hide();
                    }
                })
                .on('click', function(e) {
                    if (e.target.className != 'date-picker' && !datePicker.$container.find(e.target).length) {
                        datePicker.hide();
                    }
                });
        },

        show: function(){
            this.$calendar.removeClass('hidden');
        },

        hide: function(){
            this.$calendar.addClass('hidden');
        },

        addCalendarHTML: function() {
            var $calendar = $('<div class="calendar hidden" aria-hidden="true"></div>'),
                $header = $('<div class="header"></div>'),
                $prev = $('<span class="prev"><i class="skycon-arrow-left"></i></span>'),
                $next = $('<span class="next"><i class="skycon-arrow-right"></i></span>'),
                $dateDescription = $('<span data-date></span>'),
                $daysHeader = $('<div class="days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>'),
                $dayContainer = $('<div class="day-container"></div>');
            $header.append($prev).append($dateDescription).append($next);
            $calendar.append($header).append($daysHeader).append($dayContainer);
            this.$container.append($calendar);
            this.$calendar = $calendar;
            this.$dateDescription = $dateDescription;
            this.$dayContainer = $dayContainer;
            this.renderCalendar();
        },

        renderCalendar: function() {
            var datePicker = this;
            datePicker.$dateDescription.text(monthNames[datePicker.calendarDate.month] + " " + datePicker.calendarDate.year);
            datePicker.fillDays(daysInMonth(datePicker.calendarDate.month, datePicker.calendarDate.year), firstDay(datePicker.calendarDate.month, datePicker.calendarDate.year));
        },

        fillDays: function(noOfDaysInMonth, firstDay) {
            var i= 1,
                date = 1,
                datePicker = this,
                calendarDate = datePicker.calendarDate,
                daysText = [],
                classNames = [],
                isToday = false,
                isInputDate = false,
                isPastDate = false,
                monthIsInPast = (calendarDate.month < currentDate.month && calendarDate.year <= currentDate.year) || (calendarDate.year < currentDate.year),
                monthIsNow = calendarDate.month == currentDate.month && calendarDate.year == currentDate.year,
                monthIsInInput = calendarDate.month ==  datePicker.$month.val() && calendarDate.year ==  datePicker.$year.val();

            for (i; i < firstDay; i++) {
                daysText.push("<span></span>");
            }

            for (date; date <= noOfDaysInMonth; date++) {
                classNames = [];
                isInputDate = (date ==  datePicker.$day.val() && monthIsInInput);
                isPastDate = (date < currentDate.day && monthIsNow) || monthIsInPast;
                isToday = (date == currentDate.day && monthIsNow);

                if (isInputDate) classNames.push('selected');
                if (isPastDate) classNames.push('past');
                if (isToday) classNames.push('today');

                daysText.push("<span class='date " + classNames.join(' ')  + "' >" + date + "</span>");
            }
            datePicker.$dayContainer.html(daysText.join(''));
        },

        selectDate: function(e) {
            var datePicker = this;
            datePicker.$container.find('.selected').removeClass('selected');
            $(e.currentTarget).addClass('selected');
            datePicker.calendarDate.day = parseInt(e.currentTarget.innerText,10);
            datePicker.$day.val(normaliseDate(datePicker.calendarDate.day));
            datePicker.$month.val(normaliseDate(datePicker.calendarDate.month));
            datePicker.$year.val(normaliseDate(datePicker.calendarDate.year));
            datePicker.hide();
        },

        displayPreviousMonth: function() {
            var datePicker = this;
            if (datePicker.calendarDate.month === 1) {
                datePicker.calendarDate.month = 12;
                datePicker.calendarDate.year--;
            } else {
                datePicker.calendarDate.month--;
            }
            datePicker.renderCalendar();
        },

        displayNextMonth: function() {
            var datePicker = this;
            if (datePicker.calendarDate.month === 12) {
                datePicker.calendarDate.month = 1;
                datePicker.calendarDate.year++;
            } else {
                datePicker.calendarDate.month++;
            }
            datePicker.renderCalendar();
        },

        updateCalendarView: function(e) {
            var datePicker = this;
            datePicker.calendarDate.day = parseInt(datePicker.$day.val(), 10) || currentDate.day;
            datePicker.calendarDate.month = parseInt(datePicker.$month.val(), 10) || currentDate.month;
            datePicker.calendarDate.year = parseInt(datePicker.$year.val(), 10) || currentDate.year;
            datePicker.renderCalendar();
        }

    };

    $.fn.datePicker = function() {
        return this.each(function() {
            var datePicker = new DatePicker($(this));
        });
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('components/datePicker', [], function() {
        return toolkit.datePicker();
    });
} else {
    toolkit.datePicker = toolkit.datePicker();
};
/*global jQuery:false */
if (typeof toolkit==='undefined') toolkit={};
toolkit.lightbox = (function ($, keyboardFocus, hash) {
    
	var classes = {
            main: 'lightbox',
            closing: 'lightbox-closing',
            content: 'lightbox-content',
            closeButton: 'lightbox-close',
            open: 'lightbox-open'
        },
        scrollbarWidth = function() {
            var scrollDiv = document.createElement("div"),
                scrollbarWidth;
            scrollDiv.className = "lightbox-scrollbar-measure";
            document.body.appendChild(scrollDiv);
            scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            return scrollbarWidth;
        }();

	function disableElementTabbing(index, element) {
		var $element = $(element);
		$element.attr('data-tabindex', $element.attr('tabindex'));
		$element.attr('tabindex', -1);
	}
    function enableElementTabIndex(index, element) {
        var $element = $(element);
        if ($element.attr('data-tabindex')) {
            $element.attr('tabindex', $element.attr('data-tabindex'));
            $element.removeAttr('data-tabindex');
        } else {
            $element.removeAttr('tabindex');
        }
    }

    function disablePageTabbing(){
        $('a, input, select, textarea, button, *[tabindex]').each(disableElementTabbing);
    }
    function enablePageTabbing($container){
        $container.find('*[tabindex]').each(enableElementTabIndex);
    }

    function focusOnLightboxLink(link){
        if (!link) { return; }
        link.focus();
    }
    function focusOnCloseButton($lightboxLink, $closeIcon){
        if ($lightboxLink.hasClass(keyboardFocus.className)) {
            keyboardFocus.apply($closeIcon[0]);
        }else{
            $closeIcon[0].focus();
        }
    }

    function hideBodyScrollBar(){
        $('body').css( {
            'overflow':		'hidden',
            'padding-right': scrollbarWidth + 'px'
        });
    }
    function showBodyScrollBar(){
        $('body').removeAttr('style');
    }

    function Lightbox(id, $lightboxLink, options){
        var $element = $('#' + id.replace('lightbox/',''));

        this.id = id;
        this.$container = ($element.hasClass(classes.main)) ? $element : $element.closest('.' + classes.main);
        this.$contents = (this.$container.length) ? this.$container.find('.' + classes.content) : $element ;
        this.$closeIcon = this.$container.find('.' + classes.closeButton);
        this.$lightboxLink = $lightboxLink;

        if (!this.$container.length){
            this.create();
            this.bindEvents();
        }
        if (options){
            this.onShow = options.onShow;
            this.onClose = options.onClose;
        }
    }

	Lightbox.prototype = {
		bindEvents: function() {
            hash.register([this.id],this.open.bind(this) );

            this.$lightboxLink.on("click", this.open.bind(this));
            this.$container.on("click", this.close.bind(this));
			this.$closeIcon.on("click", this.close.bind(this));
			this.$contents.on("click", function(e) { return false; });
		},

        create: function(){
            var $contents = this.$contents,
                $parent = this.$contents.parent(),
                $lightboxDiv = $('<div class="' + classes.main + '"></div>'),
                $container = $('<div class="skycom-container lightbox-container clearfix"></div>'),
                $close = $('<a class="internal-link ' + classes.closeButton + ' skycon-close" href="#!"><span class="speak">Close</span></a>');

            $contents.addClass(classes.content + ' skycom-10 skycom-offset1').attr('role','dialog');
            $contents.prepend($close);

            $container.append($contents);
            $lightboxDiv.append($container);
            $parent.append($lightboxDiv);

            this.$container = $lightboxDiv;
            this.$closeIcon = $close;
        },

		open: function() {
            if (this.$container.hasClass(classes.open)) { return ; }
            if (this.onShow){
                this.onShow();
            }
            hideBodyScrollBar();

			this.$container.addClass(classes.open);

            focusOnCloseButton(this.$lightboxLink, this.$closeIcon);
            disablePageTabbing();
            enablePageTabbing(this.$container);
		},

		close: function(event) {
            var lightbox = this;
			event.preventDefault();
            if (this.$container.hasClass(classes.closing)) { return ; }

            this.$container.addClass(classes.closing);
            hash.remove();

            window.setTimeout(function() {
                lightbox.$container.removeClass(classes.open + ' ' + classes.closing);
                focusOnLightboxLink(lightbox.$lightboxLink);
                showBodyScrollBar();
                enablePageTabbing($('body'));
                if (lightbox.onClose){
                    lightbox.onClose();
                }
            }, 500);
		}
	};

	$.fn.lightbox = function(options) {
		return this.each(function() {
			var lb = new Lightbox($(this).attr('href').replace('#!',''),$(this), options);
		});
	};

});

if (typeof window.define === "function" && window.define.amd) {
    define('components/lightbox', ['utils/focus', 'utils/hashManager'], function(focus, hash) {
        
        return toolkit.lightbox(jQuery, focus, hash);
    });
} else {
    toolkit.lightbox = toolkit.lightbox(jQuery, toolkit.focus, toolkit.hashManager);
};
if (typeof toolkit==='undefined') toolkit={};
toolkit.share = (function(detect) {

    var $document = $(document);

    function bindEvents() {
        $document.on('click keypress', '.share-popup .summary', toggleSharePopover);
    }

    function toggleSharePopover(e) {
        e.preventDefault();
        var $section = $(this).parent(),
            triggerEvents = 'keypress ' + ('ontouchend' in document.documentElement ? 'touchend' : 'click');
        if(e.type === 'click' || e.type === 'touchend' || (e.type === 'keypress' && e.which === 13)) {
            $section.toggleClass('active');
            var $popover = $(this).parent().find('.popover');
            if(detect.elementVisibleBottom($popover) === false) {
                 $popover.addClass("top");

            } else {
                $popover.removeClass("top");
            }

            $document.on(triggerEvents, function hidePopover(e) {
                if(!$.contains($section[0], e.target)) {
                    $section.removeClass('active');
                    $document.off(triggerEvents, hidePopover);
                }
            });
        }
    }

    bindEvents();

    return {
        toggleSharePopover: toggleSharePopover
    };
});

if (typeof window.define === "function" && window.define.amd) {
    define('components/share', ['utils/detect'], function(detect) {
        return toolkit.share(detect);
    });
} else {
    toolkit.share = toolkit.share(toolkit.detect);
}
;
if (typeof toolkit === 'undefined') toolkit = {};
toolkit.tooltip = (function (detect) {

    function bindEvents() {
        $(document).on('mouseenter mouseleave ', '[data-tooltip]', hover);
    }

    function hover(event) {
        var $hoveredElement = $(this),
            $tooltip = $hoveredElement.find('.tltp');
        clearTimeout($tooltip.attr('data-tooltip-content-timeout'));
        if (event.type == 'mouseenter') {
            if ($tooltip.text() !== "") {
                show($tooltip);
            }
        } else {
            hide($tooltip);
        }
    }

    function position($tooltip) {
        if (detect.elementVisibleBottom($tooltip) === false) {
            $tooltip.addClass("top");
        } else {
            $tooltip.removeClass("top");
        }
    }

    function show($tooltip) {
        position($tooltip);
        $tooltip.attr('data-tooltip-content-timeout', setTimeout(function () {
            $tooltip.fadeIn(100).css('display', 'block');
        }, 500));
    }

    function hide($tooltip) {
        $tooltip.fadeOut(350);
    }

    bindEvents();

});

if (typeof window.define === "function" && window.define.amd) {
    define('components/tooltip', ['utils/detect'], function (detect) {
        return toolkit.tooltip(detect);
    });
} else {
    toolkit.tooltip = toolkit.tooltip(toolkit.detect);
}
;
if (typeof toolkit === 'undefined') toolkit = {};
toolkit.video = (function (window, $) {
    

    function Video($container, options) {
        if (!$container.attr('data-video-id')){ return; }
        var video = this;
        this.$container = $container;
        this.options = {
            token : options.token,
            freewheel : options.displayAdverts,
            animationSpeed : (options.animationSpeed !== undefined ) ? options.animationSpeed : 500,
            autoplay : false,
            videoId : $container.attr('data-video-id'),
            onPlay: options.onPlay,
            closeCallback: options.closeCallback,
            $wrapperLocation: options.$wrapperLocation || this.$container
        };
        this.bindEvents();
    }

    Video.prototype = {
        bindEvents: function(){
            var video = this;
            video.$container.on('click','.play-video' ,function(e){
                video.createWrapper();
                video.play(e);
            });
        },
        bindWrapperEvents:function () {
            var video = this;
            $('body').one('keydown', video.stopOnEscape.bind(video));
            video.$wrapper.one('click touchstart', '.close', video.stop.bind(video));
            video.$player.one('ended webkitendfullscreen', video.stop.bind(video));
        },
        createWrapper:function () {
            this.options.$wrapperLocation.append('<div class="video-wrapper">' +
                '<a href="#!" class="close"><i class="skycon-close" aria-hidden=true></i><span class="speak">Close</span></a>' +
                '<div class="videocontrolcontainer"><video></video><img class="posterFrame"/></div>' +
            '</div>');
            this.options.$wrapperLocation.find('.posterFrame').on('error', function () {
                this.src = options.placeHolderImage;
            });
            this.options.$wrapperLocation.append('<div class="video-overlay"></div>');
            this.$player = this.options.$wrapperLocation.parent().find('video');
            this.$wrapper = this.options.$wrapperLocation.find('.video-wrapper');
            this.$wrapper.attr('id', 'video-' + this.options.videoId);
            this.bindWrapperEvents();
        },
        removeWrapper: function(){
            this.$wrapper.removeClass('playing-video').remove();
            this.options.$wrapperLocation.find('.video-overlay').remove();
        },

        play:function(e) {
            if(e) { e.preventDefault(); }
            var video = this;
            if(video.options.onPlay) {
                video.options.onPlay();
            }
            this.showCanvas(function () {
            video.$player.sky_html5player(video.options); //todo: move to main video function
            setTimeout(function () {
                sky.html5player.play();
            }, 1333); //todo: call without setTimeout. S3 breaks as does flash ie8
//                todo: do both todo's when video team add flash queueing + fixed S3
            });
        },
        stopOnEscape: function(e){
            if (e.keyCode === 27) {
                e.preventDefault();
                this.stop();
            }
        },
        stop:function (e) {
            if(e) { e.preventDefault(); }
            var video = this;
            $(window).off('skycom.resizeend', video.resizeContainer);
            sky.html5player.close(this.$wrapper);
            this.hideCanvas();
        },
        showCanvas:function (callback) {
            var height,
                $container = this.$container,
                $wrapperLocation = this.options.$wrapperLocation,
                $overlay = $wrapperLocation.find('.video-overlay'),
                $wrapper = $wrapperLocation.find('.video-wrapper'),
                $play = $container.find('.play-video'),
                $close = $wrapper.find('.close'),
                animationSpeed = (this.options.animationSpeed === 0) ? 0 : this.options.animationSpeed || 500,
                video = this;
            this.originalHeight = $container.height();
            $wrapper.addClass('playing-video');
            $overlay.fadeIn(animationSpeed, function () {
                $play.fadeOut(animationSpeed);
                $close.addClass('active');
                height = video.calculateHeight();
                $container.animate({ height:height }, animationSpeed, function () {
                    $(window).on('skycom.resizeend', $.proxy(video.resizeContainer, video));
                    $wrapper.show();
                    $overlay.fadeOut(animationSpeed);
                    callback();
                });
            });
        },
        calculateHeight:function () {
            return Math.round((this.$container.width() / 16) * 9);
        },
        resizeContainer:function () {
            this.$container.animate({ height:this.calculateHeight() }, 250);
        },
        hideCanvas:function () {
            var video = this,
                $container = this.$container,
                $wrapperLocation = this.options.$wrapperLocation,
                $overlay = $wrapperLocation.find('.video-overlay'),
                $wrapper = $wrapperLocation.find('.video-wrapper'),
                $play = $container.find('.play-video'),
                $close = $wrapper.find('.close'),
                animationSpeed = (this.options.animationSpeed === 0) ? 0 : this.options.animationSpeed || 500,
                originalHeight = this.originalHeight;

            $overlay.fadeIn(animationSpeed, function () {
                $close.removeClass('active');
                $container.animate({ height:originalHeight }, animationSpeed, function () {
                    $container.css({ height:'auto' });
                    if (video.options.closeCallback) {
                        video.options.closeCallback();
                    }
                    $play.fadeIn(animationSpeed);
                    $overlay.hide();
                    $wrapper.fadeOut(animationSpeed, video.removeWrapper.bind(video));
                });
            });
        }
    };
    $.fn.video = function(params) {
        return this.each(function() {
            var video = new Video($(this), params);
        });
    };
    return Video;
});

if (typeof window.define === "function" && window.define.amd) {
    define('components/video', [], function () {
        return toolkit.video(window, jQuery);
    });
} else {
    toolkit.video =  toolkit.video(window, jQuery);
};
if (typeof toolkit==='undefined') toolkit={};
toolkit.carousel = (function(window, $, video) {
    

    // get CSS3 capabilities
    var has3d = (function() {
        return ('WebKitCSSMatrix' in window && 'm11' in new window.WebKitCSSMatrix());
    }());
    var hasTransform = (function() {
        var s = document.body.style;
        return s.transform !== undefined || s.WebkitTransform !== undefined || s.MozTransform !== undefined || s.OTransform !== undefined;
    }());

    function Carousel(element, options) {
        this.options = options;
        this.$viewport = element;
        this.$slideContainer = element.find('.skycom-carousel-container');
        this.$slides = this.$slideContainer.find('>');
        this.currentIndex = 0;
        this.slideCount = this.$slides.length;
        this.timerId = false;
        this.touchReset();
        this.bindEvents();
        this.initialiseVideos();
    }

    Carousel.prototype = {
        unbindTouchEvents: function() {
            this.$slideContainer.off('touchstart touchmove touchend touchcancel');
        },
        bindTouchEvents: function() {
            this.$slideContainer
                .on('touchstart', this.touchstart.bind(this))
                .on('touchmove', this.touchmove.bind(this))
                .on('touchend', this.touchend.bind(this))
                .on('touchcancel', this.touchReset.bind(this));
        },
        bindEvents: function() {
            this.bindTouchEvents();
            this.$slideContainer.find('a').on('click', this.pause.bind(this));
        },
        unbindEvents: function() {
            this.unbindTouchEvents();
            this.$slideContainer.find('a').off('click');
        },
        setOffset: function(percent, animate) {
            var $container = this.$slideContainer.removeClass("animate");
            if (animate) $container.addClass("animate");
            if (has3d) {
                $container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
            } else if (hasTransform) {
                $container.css("transform", "translate("+ percent +"%,0)");
            } else if (animate) {
                $container.animate({'left': (percent*2) + '%'}, 600);
            } else {
                $container.css({'left': (percent*2) + '%'});
            }
            return this;
        },
        toggleTermsContent: function(){
            this.pause();
            var termsHidden = this.$viewport.next('.terms-content').find('.terms').length===0;
            this[termsHidden ? 'showTermsContent' : 'hideTermsContent']();
        },
        showTermsContent: function(){
            this.hideTermsContent();
            var $terms = $(this.$slides[this.currentIndex]).find('.terms');
            if ($terms.length){
                this.$viewport.next('.terms-content').append($terms.clone(true).removeClass('speak').attr('aria-hidden','true')).fadeIn(200);
            }
        },
        hideTermsContent: function(){
            this.$viewport.next('.terms-content').fadeOut(200, function() {
                $(this).find('.terms').remove();
            });
        },
        showTermsLink: function(slideIndex){
            this.hideTermsLink();
            var $terms = $(this.$slides[slideIndex]).find('.terms');
            if ($terms.length){
                this.$viewport.find('.terms-link').removeClass('hidden').fadeIn(200);
            }
        },
        hideTermsLink: function(){
            this.$viewport.find('.terms-link').fadeOut(200);
            this.hideTermsContent();
        },
        initialiseVideos: function() {
            var carousel = this;
            this.$slides.video({
                $wrapperLocation: carousel.$viewport,
                token:"8D5B12D4-E1E6-48E8-AF24-F7B13050EE85",
                displayAdverts: false, //disable ads
                onPlay: function() {
                    carousel.pause();
                    carousel.$viewport.find('.actions, .indicators, .terms-link').fadeOut(500);
                },
                closeCallback: function() {
                    carousel.$viewport.find('.actions, .indicators, .terms-link').fadeIn(500);
                }
            });

        },
        moveSlide : function(opts){//index, start, end, callback, reverse
            var self = this,
                $slides = this.$slides,
                cssFloat, indexToShow;

            indexToShow = (opts.index >= this.slideCount)?0:(opts.index < 0) ? this.slideCount - 1 : opts.index;
            cssFloat = (opts.index>this.currentIndex && !opts.reverse) ? 'left' : 'right';

            $slides.filter(':not(:eq(' + this.currentIndex + '))').hide();
            $slides.eq(this.currentIndex).css('float', cssFloat);
            $slides.eq(indexToShow).show().css('float', cssFloat == 'left' ? 'right' : 'left');

            this.setOffset(opts.start, false);
            if (typeof opts.end !== 'undefined'){
                setTimeout(function(){
                    self.setOffset(opts.end, true);
                    self.showTermsLink(indexToShow);
                    self.$viewport.trigger('change', indexToShow);
                }, 20);
                this.currentIndex = indexToShow;
                if (typeof opts.callback == 'function') opts.callback(indexToShow);
            }
            return indexToShow;
        },
        goto: function(slideIndex, pause, callback) {
            if (pause !== false) this.pause();
            if (slideIndex===this.currentIndex) { return; }

            if ((slideIndex>this.currentIndex)) {
                this.moveSlide({index: slideIndex, start:0, end:-50, callback:callback});
            } else{
                this.moveSlide({index: slideIndex, start:-50, end: 0, callback:callback});
            }
            return this;
        },
        next: function(pause, callback) {
            this.goto(this.currentIndex + 1, pause, callback);
            this.$viewport.find('.indicators, .actions').css('display', 'block');
            return this;
        },
        previous: function() {
            this.goto(this.currentIndex - 1);
            this.$viewport.find('.indicators, .actions').css('display', 'block');
            return this;
        },
        play: function(callback, delay) {
            var self = this,
                interval = this.options.interval;

            self.timerId = setTimeout(function() { //timeout for small delay after pressing pay button
                self.next(false);
                self.timerId = setTimeout(function loop() {  //timeout interval between slides
                    self.next(false, function() {
                        self.timerId = setTimeout(loop, interval);
                    });
                }, interval);
            }, delay || this.options.onPlayDelay);

            this.$viewport.trigger('playing');
            if (typeof callback == 'function') callback();
            return this;
        },
        pause: function(callback) {
            clearTimeout(this.timerId);

            this.$viewport.trigger('paused');
            if (typeof callback == 'function') callback();
            return this;
        },
        touchstart: function(e) {
            var touch = e.originalEvent.touches[0];
            this.pause();
            this.swipe.start = {x: touch.pageX, y:touch.pageY};
        },
        touchmove: function(e) {
            var swipe = this.swipe,
                touch = e.originalEvent.touches[0],
                xDifference = touch.pageX - swipe.start.x,
                yDifference = touch.pageY - swipe.start.y,
                scrollingCarousel = Math.abs(xDifference) > Math.abs(yDifference),
                slideIndex = xDifference<0?this.currentIndex+1:this.currentIndex- 1,
                positionAsPercentage;

            if (!swipe.start || scrollingCarousel===false) return;
            e.preventDefault();

            positionAsPercentage = (xDifference / this.$slideContainer.outerWidth(true)) * 100;
            if (xDifference>0) positionAsPercentage -=50;
            this.swipe.positionAsPercentage = positionAsPercentage;

            this.moveSlide({index:slideIndex,start:positionAsPercentage});
        },
        touchend: function(e) {
            if (!this.swipe.start) return;
            var swipe = this.swipe,
                position = swipe.positionAsPercentage,
                touch = e.originalEvent.changedTouches[0],
                xDifference = touch.pageX - swipe.start.x,
                direction = null,
                threshold = 75;
            if (Math.abs(xDifference) > threshold) {
                direction = (xDifference < 0) ? 'left' : 'right';
            }

            if (direction === 'left') {
                this.moveSlide({
                    index: this.currentIndex + 1,
                    start: position,
                    end: -50
                });
                this.$viewport.find('.next').trigger('toolkit.track');

            } else if (direction === 'right') {
                this.moveSlide({
                    index: this.currentIndex - 1,
                    start: position,
                    end:0
                });
                this.$viewport.find('.previous').trigger('toolkit.track');

            } else if (position !== 0) {
                var start = (xDifference > 0) ? position + 50 : position,
                    index = this.currentIndex,
                    end = 0,
                    reverse;
                if (start < 0){
                    this.currentIndex = (index+1>=this.slideCount) ? 0 : index+1;
                } else {
                    this.currentIndex -= 1;
                    end = -50;
                    start -= 50;
                }
                reverse = this.currentIndex===0 && index === this.slideCount-1;
                this.moveSlide({
                    index: index,
                    start: start,
                    end: end,
                    reverse: reverse
                });
            }
            this.touchReset();
        },
        touchReset: function() {
            this.swipe = {
                start: false,
                positionAsPercentage: 0
            };
        }
    };

    // jquerify
    $.fn.skycom_carousel = function(params) {
        var options = $.extend(true, {
            actions: [
                { id: 'play', label: 'Play Carousel', icon: 'carousel-play' },
                { id: 'pause', label: 'Pause Carousel', icon: 'carousel-pause' },
                { id: 'previous', label: 'Previous', icon: 'chevron-left',speak:true },
                { id: 'next', label: 'Next', icon: 'chevron',speak:true }
            ],
            autoplay: true,
            startSlideIndex: 0,
            onPlayDelay: 500,
            interval: 6000
        }, params);

        // generating default markup
        var markup = {
            actions: function($element, options){
                var html = '', id, label, i, extraClass, icon, action,circle,
                    actions = options.actions,
                    onclick = options.onclick;
                if(options.count <= 1) return this;

                for (i=0;i<actions.length;i++) {
                    action = actions[i];

                    id = action.id;
                    extraClass = (id=='next' || id=='previous') ? ' hidden-touch ' : '';
                    icon = 'skycon-' + action.icon;
                    label = (action.speak) ? '<span class="speak">' + action.label + '</span>' : action.label;
                    html += '<a href="#" class="skycom-internal supportive ' + extraClass + id + '" >';
                    html += '<span class="semi-circle"><i class="' + icon + '" aria-hidden="true"></i></span>' + label;
                    html += '</a>';
                }
                $element.find('.skycom-carousel-container').before('<div class="actions">' + html + '</div>');
                $element.find('> .actions > *').each(function(index) {
                    $(this).attr('data-action', actions[index].id).on('click', function(e) {
                        onclick(actions[index].id);
                        e.preventDefault();
                    });
                });
                return this;
            },
            indicators: function($element, options) {

                var $indicators, i,
                    count = options.count,
                    onclick = options.onclick,
                    html = '<div class="indicators"><div class="container">',
                    className = ' class="active"';
//                if (count <= 1) return this;
                if (count>1){
                    for (i = count; i--;) {
                        html += '<span' + className + ' data-tracking data-tracking-label="indicator"></span>';
                        className = '';
                    }
                }
                $indicators = $(html + '</div></div>').on('click', 'span', function(e) {
                    onclick($(e.currentTarget).index());
                });
                $element.append($indicators);
                return this;
            },
            terms: function($element) {
                var $termsLink = $('<a href="#!" class="terms-link carousel-content cushioned hidden black internal-link supportive" aria-hidden="true">Terms and Conditions</a>');
                var $termsContent = $('<div class="terms-content carousel-content  cushioned hidden"></div>');
                if ($element.find('.terms').length){
                    $element.append($termsLink);
                    $element.after($termsContent);
                    $element.addClass('has-terms');
                }
                return this;
            },
            video: function($element) {
                $element.append('<div class="video-overlay"></div>');
                return this;
            }
        };

        return this.each(function() {
            var $this = $(this);
            var carousel = new Carousel($this, options);
            var createMarkup = function(carousel) {
                markup.indicators($this, {
                    count: carousel.slideCount,
                    onclick: function(index) {
                        carousel.goto(index);
                    }
                })
                .terms($this)
                .actions($this, {
                    count: carousel.slideCount,
                    actions: options.actions,
                    onclick: function(action) {
                        carousel[action]();
                    }
                });
            };

            createMarkup(carousel);

            $this.on('click', '.terms-link', function(e) {
                carousel.toggleTermsContent();
            }).on('change',function(e, index) {
                index = index || 0;
                $this.find('.indicators .container > *').removeClass('active').eq(index).addClass('active');
                carousel.$slides.removeClass('active').find('a').attr('tabindex',-1);
                carousel.$slides.eq(index).addClass('active').find('a').removeAttr('tabindex');
            }).on('playing',function() {
                $this.removeClass('paused').addClass('playing');
            }).on('paused',function() {
                $this.removeClass('playing').addClass('paused');
            }).on('pause',function() {
                carousel.pause();
            }).on('play',function() {
                carousel.play();
            }).on('goto',function(e, slideIndex) {
                carousel.goto(slideIndex, true);
            }).on('refresh',function(e, slideIndex) {
                carousel.$slides = carousel.$slideContainer.find('>');
                carousel.slideCount = carousel.$slides.length;
                $this.find('.indicators').remove();
                $this.find('.actions').remove();
                $this.find('.video-overlay').remove();
                slideIndex = parseInt(slideIndex, 10);
                slideIndex = (isNaN(slideIndex) || slideIndex < 0) ? 0 : slideIndex;
                slideIndex = (slideIndex > (carousel.slideCount - 1)) ?  carousel.slideCount - 1 : slideIndex;
                carousel.goto(slideIndex, true);
                createMarkup(carousel);
            }).on('keyup',function(e){
                switch(e.keyCode){
                    case 9: carousel.pause(); break; //tab
                    case 37: carousel.previous(); break; //left arrow
                    case 39: carousel.next(); break; //right arrow
                }
            }).find('.toggle-terms').on('click', function(e) {
                carousel.$viewport.toggleClass('showing-tandcs');
            });
            if(carousel.slideCount > 1) {
                carousel[options.autoplay === true ? 'play' : 'pause'](false, options.interval);
                carousel.goto(options.startSlideIndex, false);
                carousel.showTermsLink(0);
                $this.trigger('change');
            } else {
                carousel.showTermsLink(0);
                carousel.unbindTouchEvents();
            }
        });
    };
});

if (typeof window.define === "function" && window.define.amd) {
    define('components/carousel', ['components/video'], function(video) {
        return toolkit.carousel(window, jQuery, video);
    });
} else {
    toolkit.carousel = toolkit.carousel(window, jQuery, toolkit.video);
}
;
(function init() {
    if(responsiveImages) {
        responsiveImages.bindOnResize();
    }
})();

if (typeof window.define === "function" && window.define.amd) {
//    explicitly call all js files here to ensure all files are available
    define('toolkit',[
        'utils/polyfill',
        'utils/detect',
        'utils/skycons',
        'utils/hashManager',
        'utils/popup',
        'utils/toggle',
        'utils/diff',
        'utils/focus',
        'utils/validation',
        'utils/event',
        'components/inPageNav',
        'components/accordion',
        'components/datePicker',
        'components/lightbox',
        'components/share',
        'components/tooltip',
        'components/video',
        'components/carousel'], function(
            polyfill, detect, skycons, hashManager, popup,toggle, diff, focus, validation, event,
            inPageNav, accordion, datePicker, lightbox, share, tooltip, video, carousel){

        return {
            polyfill: polyfill,
            detect: detect,
            skycons: skycons,
            hashManager: hashManager,
            popup: popup,
            toggle: toggle,
            diff: diff,
            focus: focus,
            validation: validation,
            event: event,
            inPageNav: inPageNav,
            accordion: accordion,
            datePicker: datePicker,
            lightbox: lightbox,
            share: share,
            tooltip: tooltip,
            video: video,
            carousel: carousel
        };
    });
};