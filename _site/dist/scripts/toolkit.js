
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
toolkit.event = (function () {
    

    var timeout = {
        resize : null
    };

    function bindEvents(){
        on(window,'resize',function(){
            clearTimeout(timeout.resize);
            timeout.resize = setTimeout(emitResizeEnd,200);
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

    function ready(exec){
        if (/in/.test(document.readyState)){
            setTimeout(function(){ ready(exec); },9);
        } else {
            exec();
        }
    }

    bindEvents();

    return {
        on: on,
        emit: emit,
        ready: ready
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/event', [], function() {
        
        return toolkit.event();
    });
} else {
    toolkit.event = toolkit.event();
};
if (typeof toolkit==='undefined') toolkit={};
toolkit.detect = (function (event) {
    

    var state = {
        css : {}
    };

    var html = document.documentElement;
    var toolkitClasses = ["no-touch", "touch-device", "mobile-view", "desktop-view", "landscape", "portrait"];
    var vendorPrefix = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];

    var touchClasses = { hasNot: toolkitClasses[0], has: toolkitClasses[1] };
    var viewClasses = { mobile:toolkitClasses[2], desktop:toolkitClasses[3] };
    var orientationClasses = { landscape: toolkitClasses[4], portrait: toolkitClasses[5] };

    function bindEvents(){
        event.on(window,'resize', updateDetectionStates);
    }


    function updateDetectionStates(){
        removeClasses();
        attachClasses();
    }

    function removeClasses(){
        var arrClasses = html.className.split(' ');
        for (var i in toolkitClasses){
            var indexToRemove = arrClasses.indexOf(toolkitClasses[i]);
            if (indexToRemove > -1) {
                arrClasses.splice(indexToRemove,1);
            }
        }
        html.className = arrClasses.join(' ');
    }

    function attachClasses(){
        var arrClasses = html.className.split(' ');
        arrClasses.push(touch() ? touchClasses.has : touchClasses.hasNot);
        arrClasses.push(view('mobile') ? viewClasses.mobile : viewClasses.desktop);
        arrClasses.push(orientation('landscape') ? orientationClasses.landscape : orientationClasses.portrait);
        html.className = arrClasses.join(' ');
    }

    function support3D(){
        var property = 'transform';
        var style = html.style;
        for(var i=0; i<vendorPrefix.length; i++) {
            style[vendorPrefix[i] + property] = 'translate3D(0,0,0)';
            if (style[vendorPrefix[i] + property] === 'translate3D(0,0,0)'){
                state.css.support3D = true;
                return state.css.support3D;
            }
        }
        state.css.support3D = false;
        return state.css.support3D;
    }

    function supportsPseudo(){
        var doc = document,
            html = doc.documentElement,
            body = doc.body,
            supported = false,
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

        body.removeChild(styleBefore);
        body.removeChild(paraBefore);

        return (heightBefore >= 1);
    }

    function pseudo(el, pos, property){
        if (!el){ return supportsPseudo(); }
        if (!window.getComputedStyle) { return false; }
        var css = window.getComputedStyle(el, ':' + pos);
        var str = css.getPropertyValue(property);
        if (str && (str.indexOf("'")===0 || str.indexOf('"')===0)){
            str = str.substring(1,str.length-1);
        }
        return str;
    }

    function getHtmlPseudo(pos){
        var content = pseudo(html, pos, 'content');
        var fontFamily = pseudo(html, pos, 'font-family');
        return (content && content!='normal') ? content : fontFamily;
    }

    function css(property){
        if (state.css[property]) { return state.css[property]; }
        if (property === 'support3D' ){
            return support3D(property);
        }
        var style = html.style;
        if(typeof style[property] == 'string') {
            state.css[property] = true;
            return true;
        }
        property = property.charAt(0).toUpperCase() + property.substr(1);
        for(var i=0; i<vendorPrefix.length; i++) {
            if(typeof style[vendorPrefix[i] + property] == 'string') {
                state.css[property] = true;
                return state.css[property];
            }
        }
        state.css[property] = false;
        return state.css[property];
    }

    function view(type){
        state.view = getHtmlPseudo('after') || 'desktop';
        return (type) ? state.view == type : state.view ;
    }

    function orientation(type){
        state.orientation = getHtmlPseudo('before') || 'landscape';
        return (type) ? state.orientation == type : state.orientation;
    }

    function touch(){
        state.touch = (!!window.ontouchstart);
        return state.touch;
    }

    function elementVisibleBottom($el) {
        if ($el.length < 1) { return; }
        return ($el.offset().top + $el.height() <= $(window).scrollTop() + $(window).height());
    }

    attachClasses();
    bindEvents();

    return {
        css: css,
        touch: touch,
        orientation: orientation,
        view: view,
        pseudo: pseudo,
        state: state,
        elementVisibleBottom: elementVisibleBottom,
        updateDetectionStates: updateDetectionStates //just expose this while phantomJS doesnt understand event.emit(window,'resize');
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/detect', ['utils/event'], function(event) {
        
        return toolkit.detect(event);
    });
} else {
    toolkit.detect = toolkit.detect(toolkit.event);
};
/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function(detect, event) {

    var icons = {
        'skycon-sky' : "&#xf100;",
        'skycon-chevron-down' : "&#xf101;",
        'skycon-info' : "&#xf102;",
        'skycon-arrow-right' : "&#xf103;",
        'skycon-plus-circle' : "&#xf104;",
        'skycon-sky-plus' : "&#xf105;",
        'skycon-tv' : "&#xf106;",
        'skycon-twitter-reply' : "&#xf107;",
        'skycon-arrow-down-left' : "&#xf108;",
        'skycon-chevron-up' : "&#xf109;",
        'skycon-chevron' : "&#xf10a;",
        'skycon-facebook' : "&#xf10b;",
        'skycon-tick' : "&#xf10c;",
        'skycon-remote-record' : "&#xf10d;",
        'skycon-warning' : "&#xf10e;",
        'skycon-carousel-play' : "&#xf10f;",
        'skycon-arrow-left' : "&#xf110;",
        'skycon-chevron-left' : "&#xf111;",
        'skycon-on-demand' : "&#xf112;",
        'skycon-user-profile' : "&#xf113;",
        'skycon-search' : "&#xf114;",
        'skycon-twitter-retweet' : "&#xf115;",
        'skycon-at' : "&#xf116;",
        'skycon-volume' : "&#xf117;",
        'skycon-twitter-favourite' : "&#xf118;",
        'skycon-expand' : "&#xf119;",
        'skycon-carousel-pause' : "&#xf11a;",
        'skycon-mouse' : "&#xf11b;",
        'skycon-share' : "&#xf11c;",
        'skycon-never-miss' : "&#xf11d;",
        'skycon-mail' : "&#xf11e;",
        'skycon-sky-go' : "&#xf11f;",
        'skycon-twitter-follow' : "&#xf120;",
        'skycon-pending' : "&#xf121;",
        'skycon-minify' : "&#xf122;",
        'skycon-twitter' : "&#xf123;",
        'skycon-close' : "&#xf124;",
        'skycon-menu' : "&#xf125;",
        'skycon-phone' : "&#xf126;",
        'skycon-cloud' : "&#xf127;",
        'skycon-video-play' : "&#xf128;",
        'skycon-google-plus' : "&#xf129;"
    };

    function addWebfont(el, c){
        var html = el.innerHTML,
            entity = icons[c];
        el.innerHTML = '<span style="font-style:normal;font-family: \'skycons\'">' + entity + '</span>' + html;
    }

    function init(){
        if (detect.pseudo()){ return; }
        var els = document.getElementsByTagName('*'),
            i, c, el;
        for (i = 0; ; i += 1) {
            el = els[i];
            if(!el) { break; }
            c = el.className;
            c = c.match(/skycon-[^\s'"]+/);
            if (c) { addWebfont(el, c[0]); }
        }
    }

    event.ready(init);

    return {
        add: addWebfont
    };
});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/skycons', ['utils/detect','utils/event'], function(detect,event) {
        return toolkit.skycons(detect,event);
    });
} else {
    toolkit.skycons = toolkit.skycons(toolkit.detect,toolkit.event);
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
        eventsAlreadyBound: false,
        lastExecutor: null,
        hash: null
    };

    function bindEvents() {
        $(window).on('hashchange', onHashChange);
        var doc_mode = document.documentMode,
        hashChangeSupport = 'onhashchange' in window && ( doc_mode === undefined || doc_mode > 7 );
        if (!hashChangeSupport){ //IE7 support
            vars.hash = document.location.hash;
            setInterval(function(){
                if (document.location.hash !== vars.hash){
                    $(window).trigger('hashchange');
                }
            },200);
        }
        vars.eventsAlreadyBound = true;
    }

    function onHashChange(hash) {
        var evt, fn;
        hash = cleanHash((typeof hash === 'string') ? hash : location.hash);
        evt = getHashEvent(hash);
        if (hash && evt) {
            fn = 'callback';
            vars.lastExecutor = hash;
        } else if (vars.lastExecutor) {
            evt = vars.globalHashList[vars.lastExecutor];
            fn = 'undo';
        }
        if (evt && typeof evt[fn] === 'function') {
            evt[fn](hash);
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

    function getHashEvent(hash){
        var globalHashList = vars.globalHashList,
            registeredHash,
            wildcardEvent,
            exactMatchEvent;
        for(registeredHash in globalHashList) {
            if(matches(hash, registeredHash) || matches(registeredHash, hash)) {
                if (registeredHash.indexOf('/*')>=0) {
                    wildcardEvent = globalHashList[registeredHash];
                } else {
                    exactMatchEvent = globalHashList[registeredHash];
                    break;
                }
            }
        }
        return exactMatchEvent || wildcardEvent;
    }

    function matches(hashWithoutWildCard, hashWithWildCard) {
        hashWithoutWildCard = cleanHash(hashWithoutWildCard);
        hashWithWildCard = cleanHash(hashWithWildCard);
        var hashSections = hashWithWildCard.split('/*');
        var hashMatched = ((hashWithoutWildCard.indexOf(hashSections[0]) === 0 && hashSections.length>1) ||
            hashWithoutWildCard == hashWithWildCard);
        return hashMatched;
    }

    function register(hashList, callback, undo){
        if (typeof hashList === 'string') { hashList = [hashList];}
        var hash,
            i= 0,
            len = hashList.length;
        for (i;i<len;i++){
            hash = cleanHash(hashList[i]);
            if (vars.globalHashList[hash]){
                var err = 'hashManager: hash (' + hash + ') already exists';
                throw new Error(err);
            }
            vars.globalHashList[hash] = {
                callback: callback,
                undo: undo
            };

            if (vars.eventsAlreadyBound && matches(location.hash, hash)) {
                onHashChange();
            }
        }
    }

    function resetHash() {
        vars.globalHashList = [];
    }

    function cleanHash(hash) {
        return hash.replace(/[#!]/g, '');
    }

    bindEvents();

    return {
        register: register,
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
toolkit.toggle = (function(detect) {

    var hasResized = false,
        hasContentChanged = false,
        elementsToToggle = {},
        hiddenClass = 'toggle-hidden',
        supportTransition = detect.css('transition');

    function animate($el, to) {
        if (supportTransition) {
            $el.css({'height':to, overflow:'hidden', 'transition': 'height 0.5s ease-in-out'});
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
            .append($el.clone().attr('style', '').removeClass(hiddenClass + ' transition ')));
        $('#toggle-tmp-height > div').append('<div class="toggle-clearfix-div clearfix clear" style="padding:1px"></div> ');
        $('#toggle-tmp-height > div').prepend('<div class="toggle-clearfix-div clearfix clear" style="padding:1px"></div> ');
        $el.data('openHeight', $('#toggle-tmp-height > div').height() - 2);
        $('#toggle-tmp-height').remove();
        $('.toggle-clearfix-div').remove();

        return 100;
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
    define('utils/toggle', ['utils/detect'], function(detect) {
        return toolkit.toggle(detect);
    });
} else {
    toolkit.toggle = toolkit.toggle(toolkit.detect);
}
;
//v8.0
var hljs=new function(){function k(v){return v.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function t(v){return v.nodeName.toLowerCase()}function i(w,x){var v=w&&w.exec(x);return v&&v.index==0}function d(v){return Array.prototype.map.call(v.childNodes,function(w){if(w.nodeType==3){return b.useBR?w.nodeValue.replace(/\n/g,""):w.nodeValue}if(t(w)=="br"){return"\n"}return d(w)}).join("")}function r(w){var v=(w.className+" "+(w.parentNode?w.parentNode.className:"")).split(/\s+/);v=v.map(function(x){return x.replace(/^language-/,"")});return v.filter(function(x){return j(x)||x=="no-highlight"})[0]}function o(x,y){var v={};for(var w in x){v[w]=x[w]}if(y){for(var w in y){v[w]=y[w]}}return v}function u(x){var v=[];(function w(y,z){for(var A=y.firstChild;A;A=A.nextSibling){if(A.nodeType==3){z+=A.nodeValue.length}else{if(t(A)=="br"){z+=1}else{if(A.nodeType==1){v.push({event:"start",offset:z,node:A});z=w(A,z);v.push({event:"stop",offset:z,node:A})}}}}return z})(x,0);return v}function q(w,y,C){var x=0;var F="";var z=[];function B(){if(!w.length||!y.length){return w.length?w:y}if(w[0].offset!=y[0].offset){return(w[0].offset<y[0].offset)?w:y}return y[0].event=="start"?w:y}function A(H){function G(I){return" "+I.nodeName+'="'+k(I.value)+'"'}F+="<"+t(H)+Array.prototype.map.call(H.attributes,G).join("")+">"}function E(G){F+="</"+t(G)+">"}function v(G){(G.event=="start"?A:E)(G.node)}while(w.length||y.length){var D=B();F+=k(C.substr(x,D[0].offset-x));x=D[0].offset;if(D==w){z.reverse().forEach(E);do{v(D.splice(0,1)[0]);D=B()}while(D==w&&D.length&&D[0].offset==x);z.reverse().forEach(A)}else{if(D[0].event=="start"){z.push(D[0].node)}else{z.pop()}v(D.splice(0,1)[0])}}return F+k(C.substr(x))}function m(y){function v(z){return(z&&z.source)||z}function w(A,z){return RegExp(v(A),"m"+(y.cI?"i":"")+(z?"g":""))}function x(D,C){if(D.compiled){return}D.compiled=true;D.k=D.k||D.bK;if(D.k){var z={};function E(G,F){if(y.cI){F=F.toLowerCase()}F.split(" ").forEach(function(H){var I=H.split("|");z[I[0]]=[G,I[1]?Number(I[1]):1]})}if(typeof D.k=="string"){E("keyword",D.k)}else{Object.keys(D.k).forEach(function(F){E(F,D.k[F])})}D.k=z}D.lR=w(D.l||/\b[A-Za-z0-9_]+\b/,true);if(C){if(D.bK){D.b=D.bK.split(" ").join("|")}if(!D.b){D.b=/\B|\b/}D.bR=w(D.b);if(!D.e&&!D.eW){D.e=/\B|\b/}if(D.e){D.eR=w(D.e)}D.tE=v(D.e)||"";if(D.eW&&C.tE){D.tE+=(D.e?"|":"")+C.tE}}if(D.i){D.iR=w(D.i)}if(D.r===undefined){D.r=1}if(!D.c){D.c=[]}var B=[];D.c.forEach(function(F){if(F.v){F.v.forEach(function(G){B.push(o(F,G))})}else{B.push(F=="self"?D:F)}});D.c=B;D.c.forEach(function(F){x(F,D)});if(D.starts){x(D.starts,C)}var A=D.c.map(function(F){return F.bK?"\\.?\\b("+F.b+")\\b\\.?":F.b}).concat([D.tE]).concat([D.i]).map(v).filter(Boolean);D.t=A.length?w(A.join("|"),true):{exec:function(F){return null}};D.continuation={}}x(y)}function c(S,L,J,R){function v(U,V){for(var T=0;T<V.c.length;T++){if(i(V.c[T].bR,U)){return V.c[T]}}}function z(U,T){if(i(U.eR,T)){return U}if(U.eW){return z(U.parent,T)}}function A(T,U){return !J&&i(U.iR,T)}function E(V,T){var U=M.cI?T[0].toLowerCase():T[0];return V.k.hasOwnProperty(U)&&V.k[U]}function w(Z,X,W,V){var T=V?"":b.classPrefix,U='<span class="'+T,Y=W?"":"</span>";U+=Z+'">';return U+X+Y}function N(){var U=k(C);if(!I.k){return U}var T="";var X=0;I.lR.lastIndex=0;var V=I.lR.exec(U);while(V){T+=U.substr(X,V.index-X);var W=E(I,V);if(W){H+=W[1];T+=w(W[0],V[0])}else{T+=V[0]}X=I.lR.lastIndex;V=I.lR.exec(U)}return T+U.substr(X)}function F(){if(I.sL&&!f[I.sL]){return k(C)}var T=I.sL?c(I.sL,C,true,I.continuation.top):g(C);if(I.r>0){H+=T.r}if(I.subLanguageMode=="continuous"){I.continuation.top=T.top}return w(T.language,T.value,false,true)}function Q(){return I.sL!==undefined?F():N()}function P(V,U){var T=V.cN?w(V.cN,"",true):"";if(V.rB){D+=T;C=""}else{if(V.eB){D+=k(U)+T;C=""}else{D+=T;C=U}}I=Object.create(V,{parent:{value:I}})}function G(T,X){C+=T;if(X===undefined){D+=Q();return 0}var V=v(X,I);if(V){D+=Q();P(V,X);return V.rB?0:X.length}var W=z(I,X);if(W){var U=I;if(!(U.rE||U.eE)){C+=X}D+=Q();do{if(I.cN){D+="</span>"}H+=I.r;I=I.parent}while(I!=W.parent);if(U.eE){D+=k(X)}C="";if(W.starts){P(W.starts,"")}return U.rE?0:X.length}if(A(X,I)){throw new Error('Illegal lexeme "'+X+'" for mode "'+(I.cN||"<unnamed>")+'"')}C+=X;return X.length||1}var M=j(S);if(!M){throw new Error('Unknown language: "'+S+'"')}m(M);var I=R||M;var D="";for(var K=I;K!=M;K=K.parent){if(K.cN){D=w(K.cN,D,true)}}var C="";var H=0;try{var B,y,x=0;while(true){I.t.lastIndex=x;B=I.t.exec(L);if(!B){break}y=G(L.substr(x,B.index-x),B[0]);x=B.index+y}G(L.substr(x));for(var K=I;K.parent;K=K.parent){if(K.cN){D+="</span>"}}return{r:H,value:D,language:S,top:I}}catch(O){if(O.message.indexOf("Illegal")!=-1){return{r:0,value:k(L)}}else{throw O}}}function g(y,x){x=x||b.languages||Object.keys(f);var v={r:0,value:k(y)};var w=v;x.forEach(function(z){if(!j(z)){return}var A=c(z,y,false);A.language=z;if(A.r>w.r){w=A}if(A.r>v.r){w=v;v=A}});if(w.language){v.second_best=w}return v}function h(v){if(b.tabReplace){v=v.replace(/^((<[^>]+>|\t)+)/gm,function(w,z,y,x){return z.replace(/\t/g,b.tabReplace)})}if(b.useBR){v=v.replace(/\n/g,"<br>")}return v}function p(z){var y=d(z);var A=r(z);if(A=="no-highlight"){return}var v=A?c(A,y,true):g(y);var w=u(z);if(w.length){var x=document.createElementNS("http://www.w3.org/1999/xhtml","pre");x.innerHTML=v.value;v.value=q(w,u(x),y)}v.value=h(v.value);z.innerHTML=v.value;z.className+=" hljs "+(!A&&v.language||"");z.result={language:v.language,re:v.r};if(v.second_best){z.second_best={language:v.second_best.language,re:v.second_best.r}}}var b={classPrefix:"hljs-",tabReplace:null,useBR:false,languages:undefined};function s(v){b=o(b,v)}function l(){if(l.called){return}l.called=true;var v=document.querySelectorAll("pre code");Array.prototype.forEach.call(v,p)}function a(){addEventListener("DOMContentLoaded",l,false);addEventListener("load",l,false)}var f={};var n={};function e(v,x){var w=f[v]=x(this);if(w.aliases){w.aliases.forEach(function(y){n[y]=v})}}function j(v){return f[v]||f[n[v]]}this.highlight=c;this.highlightAuto=g;this.fixMarkup=h;this.highlightBlock=p;this.configure=s;this.initHighlighting=l;this.initHighlightingOnLoad=a;this.registerLanguage=e;this.getLanguage=j;this.inherit=o;this.IR="[a-zA-Z][a-zA-Z0-9_]*";this.UIR="[a-zA-Z_][a-zA-Z0-9_]*";this.NR="\\b\\d+(\\.\\d+)?";this.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";this.BNR="\\b(0b[01]+)";this.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";this.BE={b:"\\\\[\\s\\S]",r:0};this.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[this.BE]};this.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[this.BE]};this.CLCM={cN:"comment",b:"//",e:"$"};this.CBLCLM={cN:"comment",b:"/\\*",e:"\\*/"};this.HCM={cN:"comment",b:"#",e:"$"};this.NM={cN:"number",b:this.NR,r:0};this.CNM={cN:"number",b:this.CNR,r:0};this.BNM={cN:"number",b:this.BNR,r:0};this.REGEXP_MODE={cN:"regexp",b:/\//,e:/\/[gim]*/,i:/\n/,c:[this.BE,{b:/\[/,e:/\]/,r:0,c:[this.BE]}]};this.TM={cN:"title",b:this.IR,r:0};this.UTM={cN:"title",b:this.UIR,r:0}}();hljs.registerLanguage("bash",function(b){var a={cN:"variable",v:[{b:/\$[\w\d#@][\w\d_]*/},{b:/\$\{(.*?)\}/}]};var d={cN:"string",b:/"/,e:/"/,c:[b.BE,a,{cN:"variable",b:/\$\(/,e:/\)/,c:[b.BE]}]};var c={cN:"string",b:/'/,e:/'/};return{l:/-?[a-z\.]+/,k:{keyword:"if then else elif fi for break continue while in do done exit return set declare case esac export exec",literal:"true false",built_in:"printf echo read cd pwd pushd popd dirs let eval unset typeset readonly getopts source shopt caller type hash bind help sudo",operator:"-ne -eq -lt -gt -f -d -e -s -l -a"},c:[{cN:"shebang",b:/^#![^\n]+sh\s*$/,r:10},{cN:"function",b:/\w[\w\d_]*\s*\(\s*\)\s*\{/,rB:true,c:[b.inherit(b.TM,{b:/\w[\w\d_]*/})],r:0},b.HCM,b.NM,d,c,a]}});hljs.registerLanguage("cs",function(b){var a="abstract as base bool break byte case catch char checked const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual volatile void while async await ascending descending from get group into join let orderby partial select set value var where yield";return{k:a,c:[{cN:"comment",b:"///",e:"$",rB:true,c:[{cN:"xmlDocTag",b:"///|<!--|-->"},{cN:"xmlDocTag",b:"</?",e:">"}]},b.CLCM,b.CBLCLM,{cN:"preprocessor",b:"#",e:"$",k:"if else elif endif define undef warning error line region endregion pragma checksum"},{cN:"string",b:'@"',e:'"',c:[{b:'""'}]},b.ASM,b.QSM,b.CNM,{bK:"protected public private internal",e:/[{;=]/,k:a,c:[{bK:"class namespace interface",starts:{c:[b.TM]}},{b:b.IR+"\\s*\\(",rB:true,c:[b.TM]}]}]}});hljs.registerLanguage("ruby",function(e){var h="[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?";var g="and false then defined module in return redo if BEGIN retry end for true self when next until do begin unless END rescue nil else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor";var a={cN:"yardoctag",b:"@[A-Za-z]+"};var i={cN:"comment",v:[{b:"#",e:"$",c:[a]},{b:"^\\=begin",e:"^\\=end",c:[a],r:10},{b:"^__END__",e:"\\n$"}]};var c={cN:"subst",b:"#\\{",e:"}",k:g};var d={cN:"string",c:[e.BE,c],v:[{b:/'/,e:/'/},{b:/"/,e:/"/},{b:"%[qw]?\\(",e:"\\)"},{b:"%[qw]?\\[",e:"\\]"},{b:"%[qw]?{",e:"}"},{b:"%[qw]?<",e:">",r:10},{b:"%[qw]?/",e:"/",r:10},{b:"%[qw]?%",e:"%",r:10},{b:"%[qw]?-",e:"-",r:10},{b:"%[qw]?\\|",e:"\\|",r:10},{b:/\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/}]};var b={cN:"params",b:"\\(",e:"\\)",k:g};var f=[d,i,{cN:"class",bK:"class module",e:"$|;",i:/=/,c:[e.inherit(e.TM,{b:"[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?"}),{cN:"inheritance",b:"<\\s*",c:[{cN:"parent",b:"("+e.IR+"::)?"+e.IR}]},i]},{cN:"function",bK:"def",e:" |$|;",r:0,c:[e.inherit(e.TM,{b:h}),b,i]},{cN:"constant",b:"(::)?(\\b[A-Z]\\w*(::)?)+",r:0},{cN:"symbol",b:":",c:[d,{b:h}],r:0},{cN:"symbol",b:e.UIR+"(\\!|\\?)?:",r:0},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{cN:"variable",b:"(\\$\\W)|((\\$|\\@\\@?)(\\w+))"},{b:"("+e.RSR+")\\s*",c:[i,{cN:"regexp",c:[e.BE,c],i:/\n/,v:[{b:"/",e:"/[a-z]*"},{b:"%r{",e:"}[a-z]*"},{b:"%r\\(",e:"\\)[a-z]*"},{b:"%r!",e:"![a-z]*"},{b:"%r\\[",e:"\\][a-z]*"}]}],r:0}];c.c=f;b.c=f;return{k:g,c:f}});hljs.registerLanguage("diff",function(a){return{c:[{cN:"chunk",r:10,v:[{b:/^\@\@ +\-\d+,\d+ +\+\d+,\d+ +\@\@$/},{b:/^\*\*\* +\d+,\d+ +\*\*\*\*$/},{b:/^\-\-\- +\d+,\d+ +\-\-\-\-$/}]},{cN:"header",v:[{b:/Index: /,e:/$/},{b:/=====/,e:/=====$/},{b:/^\-\-\-/,e:/$/},{b:/^\*{3} /,e:/$/},{b:/^\+\+\+/,e:/$/},{b:/\*{5}/,e:/\*{5}$/}]},{cN:"addition",b:"^\\+",e:"$"},{cN:"deletion",b:"^\\-",e:"$"},{cN:"change",b:"^\\!",e:"$"}]}});hljs.registerLanguage("javascript",function(a){return{aliases:["js"],k:{keyword:"in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const class",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require"},c:[{cN:"pi",b:/^\s*('|")use strict('|")/,r:10},a.ASM,a.QSM,a.CLCM,a.CBLCLM,a.CNM,{b:"("+a.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[a.CLCM,a.CBLCLM,a.REGEXP_MODE,{b:/</,e:/>;/,r:0,sL:"xml"}],r:0},{cN:"function",bK:"function",e:/\{/,c:[a.inherit(a.TM,{b:/[A-Za-z$_][0-9A-Za-z$_]*/}),{cN:"params",b:/\(/,e:/\)/,c:[a.CLCM,a.CBLCLM],i:/["'\(]/}],i:/\[|%/},{b:/\$[(.]/},{b:"\\."+a.IR,r:0}]}});hljs.registerLanguage("xml",function(a){var c="[A-Za-z0-9\\._:-]+";var d={b:/<\?(php)?(?!\w)/,e:/\?>/,sL:"php",subLanguageMode:"continuous"};var b={eW:true,i:/</,r:0,c:[d,{cN:"attribute",b:c,r:0},{b:"=",r:0,c:[{cN:"value",v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s\/>]+/}]}]}]};return{aliases:["html"],cI:true,c:[{cN:"doctype",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},{cN:"comment",b:"<!--",e:"-->",r:10},{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{title:"style"},c:[b],starts:{e:"</style>",rE:true,sL:"css"}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{title:"script"},c:[b],starts:{e:"<\/script>",rE:true,sL:"javascript"}},{b:"<%",e:"%>",sL:"vbscript"},d,{cN:"pi",b:/<\?\w+/,e:/\?>/,r:10},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"title",b:"[^ /><]+",r:0},b]}]}});hljs.registerLanguage("markdown",function(a){return{c:[{cN:"header",v:[{b:"^#{1,6}",e:"$"},{b:"^.+?\\n[=-]{2,}$"}]},{b:"<",e:">",sL:"xml",r:0},{cN:"bullet",b:"^([*+-]|(\\d+\\.))\\s+"},{cN:"strong",b:"[*_]{2}.+?[*_]{2}"},{cN:"emphasis",v:[{b:"\\*.+?\\*"},{b:"_.+?_",r:0}]},{cN:"blockquote",b:"^>\\s+",e:"$"},{cN:"code",v:[{b:"`.+?`"},{b:"^( {4}|\t)",e:"$",r:0}]},{cN:"horizontal_rule",b:"^[-\\*]{3,}",e:"$"},{b:"\\[.+?\\][\\(\\[].+?[\\)\\]]",rB:true,c:[{cN:"link_label",b:"\\[",e:"\\]",eB:true,rE:true,r:0},{cN:"link_url",b:"\\]\\(",e:"\\)",eB:true,eE:true},{cN:"link_reference",b:"\\]\\[",e:"\\]",eB:true,eE:true,}],r:10},{b:"^\\[.+\\]:",e:"$",rB:true,c:[{cN:"link_reference",b:"\\[",e:"\\]",eB:true,eE:true},{cN:"link_url",b:"\\s",e:"$"}]}]}});hljs.registerLanguage("css",function(a){var b="[a-zA-Z-][a-zA-Z0-9_-]*";var c={cN:"function",b:b+"\\(",e:"\\)",c:["self",a.NM,a.ASM,a.QSM]};return{cI:true,i:"[=/|']",c:[a.CBLCLM,{cN:"id",b:"\\#[A-Za-z0-9_-]+"},{cN:"class",b:"\\.[A-Za-z0-9_-]+",r:0},{cN:"attr_selector",b:"\\[",e:"\\]",i:"$"},{cN:"pseudo",b:":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"},{cN:"at_rule",b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{cN:"at_rule",b:"@",e:"[{;]",c:[{cN:"keyword",b:/\S+/},{b:/\s/,eW:true,eE:true,r:0,c:[c,a.ASM,a.QSM,a.NM]}]},{cN:"tag",b:b,r:0},{cN:"rules",b:"{",e:"}",i:"[^\\s]",r:0,c:[a.CBLCLM,{cN:"rule",b:"[^\\s]",rB:true,e:";",eW:true,c:[{cN:"attribute",b:"[A-Z\\_\\.\\-]+",e:":",eE:true,i:"[^\\s]",starts:{cN:"value",eW:true,eE:true,c:[c,a.NM,a.QSM,a.ASM,a.CBLCLM,{cN:"hexcolor",b:"#[0-9A-Fa-f]+"},{cN:"important",b:"!important"}]}}]}]}]}});hljs.registerLanguage("http",function(a){return{i:"\\S",c:[{cN:"status",b:"^HTTP/[0-9\\.]+",e:"$",c:[{cN:"number",b:"\\b\\d{3}\\b"}]},{cN:"request",b:"^[A-Z]+ (.*?) HTTP/[0-9\\.]+$",rB:true,e:"$",c:[{cN:"string",b:" ",e:" ",eB:true,eE:true}]},{cN:"attribute",b:"^\\w",e:": ",eE:true,i:"\\n|\\s|=",starts:{cN:"string",e:"$"}},{b:"\\n\\n",starts:{sL:"",eW:true}}]}});hljs.registerLanguage("java",function(b){var a="false synchronized int abstract float private char boolean static null if const for true while long throw strictfp finally protected import native final return void enum else break transient new catch instanceof byte super volatile case assert short package default double public try this switch continue throws";return{k:a,i:/<\//,c:[{cN:"javadoc",b:"/\\*\\*",e:"\\*/",c:[{cN:"javadoctag",b:"(^|\\s)@[A-Za-z]+"}],r:10},b.CLCM,b.CBLCLM,b.ASM,b.QSM,{bK:"protected public private",e:/[{;=]/,k:a,c:[{cN:"class",bK:"class interface",eW:true,i:/[:"<>]/,c:[{bK:"extends implements",r:10},b.UTM]},{b:b.UIR+"\\s*\\(",rB:true,c:[b.UTM]}]},b.CNM,{cN:"annotation",b:"@[A-Za-z]+"}]}});hljs.registerLanguage("php",function(b){var e={cN:"variable",b:"\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*"};var a={cN:"preprocessor",b:/<\?(php)?|\?>/};var c={cN:"string",c:[b.BE,a],v:[{b:'b"',e:'"'},{b:"b'",e:"'"},b.inherit(b.ASM,{i:null}),b.inherit(b.QSM,{i:null})]};var d={v:[b.BNM,b.CNM]};return{cI:true,k:"and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception default die require __FUNCTION__ enddeclare final try switch continue endfor endif declare unset true false trait goto instanceof insteadof __DIR__ __NAMESPACE__ yield finally",c:[b.CLCM,b.HCM,{cN:"comment",b:"/\\*",e:"\\*/",c:[{cN:"phpdoc",b:"\\s@[A-Za-z]+"},a]},{cN:"comment",b:"__halt_compiler.+?;",eW:true,k:"__halt_compiler",l:b.UIR},{cN:"string",b:"<<<['\"]?\\w+['\"]?$",e:"^\\w+;",c:[b.BE]},a,e,{cN:"function",bK:"function",e:/[;{]/,i:"\\$|\\[|%",c:[b.UTM,{cN:"params",b:"\\(",e:"\\)",c:["self",e,b.CBLCLM,c,d]}]},{cN:"class",bK:"class interface",e:"{",i:/[:\(\$"]/,c:[{bK:"extends implements",r:10},b.UTM]},{bK:"namespace",e:";",i:/[\.']/,c:[b.UTM]},{bK:"use",e:";",c:[b.UTM]},{b:"=>"},c,d]}});hljs.registerLanguage("python",function(a){var f={cN:"prompt",b:/^(>>>|\.\.\.) /};var b={cN:"string",c:[a.BE],v:[{b:/(u|b)?r?'''/,e:/'''/,c:[f],r:10},{b:/(u|b)?r?"""/,e:/"""/,c:[f],r:10},{b:/(u|r|ur)'/,e:/'/,r:10},{b:/(u|r|ur)"/,e:/"/,r:10},{b:/(b|br)'/,e:/'/,},{b:/(b|br)"/,e:/"/,},a.ASM,a.QSM]};var d={cN:"number",r:0,v:[{b:a.BNR+"[lLjJ]?"},{b:"\\b(0o[0-7]+)[lLjJ]?"},{b:a.CNR+"[lLjJ]?"}]};var e={cN:"params",b:/\(/,e:/\)/,c:["self",f,d,b]};var c={e:/:/,i:/[${=;\n]/,c:[a.UTM,e]};return{k:{keyword:"and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda nonlocal|10 None True False",built_in:"Ellipsis NotImplemented"},i:/(<\/|->|\?)/,c:[f,d,b,a.HCM,a.inherit(c,{cN:"function",bK:"def",r:10}),a.inherit(c,{cN:"class",bK:"class"}),{cN:"decorator",b:/@/,e:/$/},{b:/\b(print|exec)\(/}]}});hljs.registerLanguage("sql",function(a){return{cI:true,i:/[<>]/,c:[{cN:"operator",b:"\\b(begin|end|start|commit|rollback|savepoint|lock|alter|create|drop|rename|call|delete|do|handler|insert|load|replace|select|truncate|update|set|show|pragma|grant|merge)\\b(?!:)",e:";",eW:true,k:{keyword:"all partial global month current_timestamp using go revoke smallint indicator end-exec disconnect zone with character assertion to add current_user usage input local alter match collate real then rollback get read timestamp session_user not integer bit unique day minute desc insert execute like ilike|2 level decimal drop continue isolation found where constraints domain right national some module transaction relative second connect escape close system_user for deferred section cast current sqlstate allocate intersect deallocate numeric public preserve full goto initially asc no key output collation group by union session both last language constraint column of space foreign deferrable prior connection unknown action commit view or first into float year primary cascaded except restrict set references names table outer open select size are rows from prepare distinct leading create only next inner authorization schema corresponding option declare precision immediate else timezone_minute external varying translation true case exception join hour default double scroll value cursor descriptor values dec fetch procedure delete and false int is describe char as at in varchar null trailing any absolute current_time end grant privileges when cross check write current_date pad begin temporary exec time update catalog user sql date on identity timezone_hour natural whenever interval work order cascade diagnostics nchar having left call do handler load replace truncate start lock show pragma exists number trigger if before after each row merge matched database",aggregate:"count sum min max avg"},c:[{cN:"string",b:"'",e:"'",c:[a.BE,{b:"''"}]},{cN:"string",b:'"',e:'"',c:[a.BE,{b:'""'}]},{cN:"string",b:"`",e:"`",c:[a.BE]},a.CNM]},a.CBLCLM,{cN:"comment",b:"--",e:"$"}]}});hljs.registerLanguage("ini",function(a){return{cI:true,i:/\S/,c:[{cN:"comment",b:";",e:"$"},{cN:"title",b:"^\\[",e:"\\]"},{cN:"setting",b:"^[a-z0-9\\[\\]_-]+[ \\t]*=[ \\t]*",e:"$",c:[{cN:"value",eW:true,k:"on off true false yes no",c:[a.QSM,a.NM],r:0}]}]}});hljs.registerLanguage("perl",function(c){var d="getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qqfileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmgetsub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedirioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when";var f={cN:"subst",b:"[$@]\\{",e:"\\}",k:d};var g={b:"->{",e:"}"};var a={cN:"variable",v:[{b:/\$\d/},{b:/[\$\%\@\*](\^\w\b|#\w+(\:\:\w+)*|{\w+}|\w+(\:\:\w*)*)/},{b:/[\$\%\@\*][^\s\w{]/,r:0}]};var e={cN:"comment",b:"^(__END__|__DATA__)",e:"\\n$",r:5};var h=[c.BE,f,a];var b=[a,c.HCM,e,{cN:"comment",b:"^\\=\\w",e:"\\=cut",eW:true},g,{cN:"string",c:h,v:[{b:"q[qwxr]?\\s*\\(",e:"\\)",r:5},{b:"q[qwxr]?\\s*\\[",e:"\\]",r:5},{b:"q[qwxr]?\\s*\\{",e:"\\}",r:5},{b:"q[qwxr]?\\s*\\|",e:"\\|",r:5},{b:"q[qwxr]?\\s*\\<",e:"\\>",r:5},{b:"qw\\s+q",e:"q",r:5},{b:"'",e:"'",c:[c.BE]},{b:'"',e:'"'},{b:"`",e:"`",c:[c.BE]},{b:"{\\w+}",c:[],r:0},{b:"-?\\w+\\s*\\=\\>",c:[],r:0}]},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{b:"(\\/\\/|"+c.RSR+"|\\b(split|return|print|reverse|grep)\\b)\\s*",k:"split return print reverse grep",r:0,c:[c.HCM,e,{cN:"regexp",b:"(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*",r:10},{cN:"regexp",b:"(m|qr)?/",e:"/[a-z]*",c:[c.BE],r:0}]},{cN:"sub",bK:"sub",e:"(\\s*\\(.*?\\))?[;{]",r:5},{cN:"operator",b:"-\\w\\b",r:0}];f.c=b;g.c=b;return{k:d,c:b}});hljs.registerLanguage("objectivec",function(a){var d={keyword:"int float while char export sizeof typedef const struct for union unsigned long volatile static bool mutable if do return goto void enum else break extern asm case short default double register explicit signed typename this switch continue wchar_t inline readonly assign self synchronized id nonatomic super unichar IBOutlet IBAction strong weak @private @protected @public @try @property @end @throw @catch @finally @synthesize @dynamic @selector @optional @required",literal:"false true FALSE TRUE nil YES NO NULL",built_in:"NSString NSDictionary CGRect CGPoint UIButton UILabel UITextView UIWebView MKMapView UISegmentedControl NSObject UITableViewDelegate UITableViewDataSource NSThread UIActivityIndicator UITabbar UIToolBar UIBarButtonItem UIImageView NSAutoreleasePool UITableView BOOL NSInteger CGFloat NSException NSLog NSMutableString NSMutableArray NSMutableDictionary NSURL NSIndexPath CGSize UITableViewCell UIView UIViewController UINavigationBar UINavigationController UITabBarController UIPopoverController UIPopoverControllerDelegate UIImage NSNumber UISearchBar NSFetchedResultsController NSFetchedResultsChangeType UIScrollView UIScrollViewDelegate UIEdgeInsets UIColor UIFont UIApplication NSNotFound NSNotificationCenter NSNotification UILocalNotification NSBundle NSFileManager NSTimeInterval NSDate NSCalendar NSUserDefaults UIWindow NSRange NSArray NSError NSURLRequest NSURLConnection UIInterfaceOrientation MPMoviePlayerController dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once"};var c=/[a-zA-Z@][a-zA-Z0-9_]*/;var b="@interface @class @protocol @implementation";return{k:d,l:c,i:"</",c:[a.CLCM,a.CBLCLM,a.CNM,a.QSM,{cN:"string",b:"'",e:"[^\\\\]'",i:"[^\\\\][^']"},{cN:"preprocessor",b:"#import",e:"$",c:[{cN:"title",b:'"',e:'"'},{cN:"title",b:"<",e:">"}]},{cN:"preprocessor",b:"#",e:"$"},{cN:"class",b:"("+b.split(" ").join("|")+")\\b",e:"({|$)",k:b,l:c,c:[a.UTM]},{cN:"variable",b:"\\."+a.UIR,r:0}]}});hljs.registerLanguage("coffeescript",function(c){var b={keyword:"in if for while finally new do return else break catch instanceof throw try this switch continue typeof delete debugger super then unless until loop of by when and or is isnt not",literal:"true false null undefined yes no on off",reserved:"case default function var void with const let enum export import native __hasProp __extends __slice __bind __indexOf",built_in:"npm require console print module exports global window document"};var a="[A-Za-z$_][0-9A-Za-z$_]*";var f=c.inherit(c.TM,{b:a});var e={cN:"subst",b:/#\{/,e:/}/,k:b};var d=[c.BNM,c.inherit(c.CNM,{starts:{e:"(\\s*/)?",r:0}}),{cN:"string",v:[{b:/'''/,e:/'''/,c:[c.BE]},{b:/'/,e:/'/,c:[c.BE]},{b:/"""/,e:/"""/,c:[c.BE,e]},{b:/"/,e:/"/,c:[c.BE,e]}]},{cN:"regexp",v:[{b:"///",e:"///",c:[e,c.HCM]},{b:"//[gim]*",r:0},{b:"/\\S(\\\\.|[^\\n])*?/[gim]*(?=\\s|\\W|$)"}]},{cN:"property",b:"@"+a},{b:"`",e:"`",eB:true,eE:true,sL:"javascript"}];e.c=d;return{k:b,c:d.concat([{cN:"comment",b:"###",e:"###"},c.HCM,{cN:"function",b:"("+a+"\\s*=\\s*)?(\\(.*\\))?\\s*\\B[-=]>",e:"[-=]>",rB:true,c:[f,{cN:"params",b:"\\(",rB:true,c:[{b:/\(/,e:/\)/,k:b,c:["self"].concat(d)}]}]},{cN:"class",bK:"class",e:"$",i:/[:="\[\]]/,c:[{bK:"extends",eW:true,i:/[:="\[\]]/,c:[f]},f]},{cN:"attribute",b:a+":",e:":",rB:true,eE:true,r:0}])}});hljs.registerLanguage("nginx",function(c){var b={cN:"variable",v:[{b:/\$\d+/},{b:/\$\{/,e:/}/},{b:"[\\$\\@]"+c.UIR}]};var a={eW:true,l:"[a-z/_]+",k:{built_in:"on off yes no true false none blocked debug info notice warn error crit select break last permanent redirect kqueue rtsig epoll poll /dev/poll"},r:0,i:"=>",c:[c.HCM,{cN:"string",c:[c.BE,b],v:[{b:/"/,e:/"/},{b:/'/,e:/'/}]},{cN:"url",b:"([a-z]+):/",e:"\\s",eW:true,eE:true},{cN:"regexp",c:[c.BE,b],v:[{b:"\\s\\^",e:"\\s|{|;",rE:true},{b:"~\\*?\\s+",e:"\\s|{|;",rE:true},{b:"\\*(\\.[a-z\\-]+)+"},{b:"([a-z\\-]+\\.)+\\*"}]},{cN:"number",b:"\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b"},{cN:"number",b:"\\b\\d+[kKmMgGdshdwy]*\\b",r:0},b]};return{c:[c.HCM,{b:c.UIR+"\\s",e:";|{",rB:true,c:[c.inherit(c.UTM,{starts:a})],r:0}],i:"[^\\s\\}]"}});hljs.registerLanguage("json",function(a){var e={literal:"true false null"};var d=[a.QSM,a.CNM];var c={cN:"value",e:",",eW:true,eE:true,c:d,k:e};var b={b:"{",e:"}",c:[{cN:"attribute",b:'\\s*"',e:'"\\s*:\\s*',eB:true,eE:true,c:[a.BE],i:"\\n",starts:c}],i:"\\S"};var f={b:"\\[",e:"\\]",c:[a.inherit(c,{cN:null})],i:"\\S"};d.splice(d.length,0,b,f);return{c:d,k:e,i:"\\S"}});hljs.registerLanguage("apache",function(a){var b={cN:"number",b:"[\\$%]\\d+"};return{cI:true,c:[a.HCM,{cN:"tag",b:"</?",e:">"},{cN:"keyword",b:/\w+/,r:0,k:{common:"order deny allow setenv rewriterule rewriteengine rewritecond documentroot sethandler errordocument loadmodule options header listen serverroot servername"},starts:{e:/$/,r:0,k:{literal:"on off all"},c:[{cN:"sqbracket",b:"\\s\\[",e:"\\]$"},{cN:"cbracket",b:"[\\$%]\\{",e:"\\}",c:["self",b]},b,a.QSM]}}],i:/\S/}});hljs.registerLanguage("cpp",function(a){var b={keyword:"false int float while private char catch export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const struct for static_cast|10 union namespace unsigned long throw volatile static protected bool template mutable if public friend do return goto auto void enum else break new extern using true class asm case typeid short reinterpret_cast|10 default double register explicit signed typename try this switch continue wchar_t inline delete alignof char16_t char32_t constexpr decltype noexcept nullptr static_assert thread_local restrict _Bool complex _Complex _Imaginary",built_in:"std string cin cout cerr clog stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap array shared_ptr abort abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf"};return{aliases:["c"],k:b,i:"</",c:[a.CLCM,a.CBLCLM,a.QSM,{cN:"string",b:"'\\\\?.",e:"'",i:"."},{cN:"number",b:"\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)"},a.CNM,{cN:"preprocessor",b:"#",e:"$",c:[{b:"include\\s*<",e:">",i:"\\n"},a.CLCM]},{cN:"stl_container",b:"\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",e:">",k:b,r:10,c:["self"]}]}});hljs.registerLanguage("makefile",function(a){var b={cN:"variable",b:/\$\(/,e:/\)/,c:[a.BE]};return{c:[a.HCM,{b:/^\w+\s*\W*=/,rB:true,r:0,starts:{cN:"constant",e:/\s*\W*=/,eE:true,starts:{e:/$/,r:0,c:[b],}}},{cN:"title",b:/^[\w]+:\s*$/},{cN:"phony",b:/^\.PHONY:/,e:/$/,k:".PHONY",l:/[\.\w]+/},{b:/^\t+/,e:/$/,c:[a.QSM,b]}]}});

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
//todo: add 'flip' option for if a picture is clicked.
if (typeof toolkit==='undefined') toolkit={};
toolkit.lightbox = (function ($, keyboardFocus, hash) {
    
	var scrollbarWidth,
        lightboxId = 1,
        classes = {
            main: 'lightbox',
            closing: 'lightbox-closing',
            content: 'lightbox-content',
            closeButton: 'lightbox-close',
            open: 'lightbox-open',
            large: 'skycom-10 skycom-offset1',
            small: 'skycom-5 skycom-offset3'
        },
        getSrollbarWidth = function() {
            //cant self execute if toolkit.js is in the head as document.body doesnt exist yet
            var scrollDiv = document.createElement("div");
            scrollDiv.className = "lightbox-scrollbar-measure";
            document.body.appendChild(scrollDiv);
            scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            return scrollbarWidth;
        },
        html = {
            waitingForAjax: '<div style="margin:0 auto;width: 150px;"><div class="spinner-blue"><p>Please wait...</p></div></div>',
            closeButton: '<a class="internal-link ' + classes.closeButton + ' skycon-close" href="#!"><span class="speak">Close</span></a>',
            container: '<div class="skycom-container lightbox-container clearfix"></div>',
            contents: '<div class="' + classes.content + '" role="dialog"></div>',
            lightboxWrapper: '<div class="' + classes.main + '"></div>'
        },
        defaults = {
            size: 'large',
            closeButtonColour: 'white'
        };

    function nextLightboxId() {
        return lightboxId++;
    }

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
            'padding-right': (scrollbarWidth || getSrollbarWidth()) + 'px'
        });
    }
    function showBodyScrollBar(){
        $('body').removeAttr('style');
    }

    function Lightbox( lightboxLink, options){
        this.$lightboxLink = $(lightboxLink);
        this.href = this.$lightboxLink.attr('href');
        this.options = $.extend( {}, defaults, options) ;
        this.init();
    }

	Lightbox.prototype = {

        init: function() {
            this.isAjaxRequest = (this.href.substring(0,1) !== '#');
            var restfulHash = this.getRestfulHash();
            this.$lightboxLink.on("click", this.open.bind(this));
            hash.register([restfulHash],this.open.bind(this));
        },

        getRestfulHash: function(){
            if (this.isAjaxRequest){
                this.restfulHash = '#!' + (this.href.split('#!')[1]);
            } else {
                this.restfulHash = this.href;
            }
            return this.restfulHash;
        },

        getAjaxContent: function() {
            var lightbox = this;
            var $spinner = $( html.waitingForAjax );
            lightbox.$contents.append($spinner);

            $.get(lightbox.href).done(function(data) {
                lightbox.$lightboxLink.attr('href', lightbox.restfulHash);
                lightbox.href = lightbox.restfulHash;
                hash.change(hash.cleanHash(lightbox.href));
                $spinner.remove();
                lightbox.populate(null,data);
            });

            return false;

        },

        bindEvents: function() {
            var lightbox = this;

            this.$container.on('click', function(e) {
                var $target = $(e.target);

                if ($target.hasClass(classes.closeButton) ) {
                    e.preventDefault();
                    lightbox.close();
                }
                if ($target.closest('.' + classes.content).length) {
                    return false;
                }

                lightbox.close();
            });

		},

        populate: function(e, data){
            data = data || $('#' + hash.cleanHash(this.restfulHash.replace(/\//g,'-'))).removeClass('hidden');
            if (data.length>0) {
                this.$container.find('.' + classes.content).append(data);
            } else {
                if (e && e.preventDefault){ e.preventDefault(); }
                this.getAjaxContent();
            }
        },

        create: function(){
            var $lightboxDiv = $(html.lightboxWrapper),
                $contents = $(html.contents),
                $container = $(html.container),
                $close = $(html.closeButton).addClass(this.options.closeButtonColour);

            this.$contents = $contents;
            $contents.attr('aria-labelledby',this.$lightboxLink.id).attr('role','dialog').addClass(classes[this.options.size]);
            $contents.prepend($close);
            $container.append($contents);
            $lightboxDiv.append($container);

            $('body').append($lightboxDiv);

            this.$container = $lightboxDiv;
        },

		open: function(e) {
            if (!this.$container){
                this.create();
                this.populate(e);
                this.bindEvents();
            }
            if (this.$container.hasClass(classes.open)) { return ; }
            if (this.options.onShow){
                this.options.onShow();
            }
            hideBodyScrollBar();

            this.$container.addClass(classes.open);

            focusOnCloseButton(this.$lightboxLink, this.$container.find('.' + classes.closeButton));
            disablePageTabbing();
            enablePageTabbing(this.$container);

		},

		close: function(event) {
            var lightbox = this;
            if (this.$container.hasClass(classes.closing)) { return ; }

            this.$container.addClass(classes.closing);
            hash.remove();

            window.setTimeout(function() {
                lightbox.$container.removeClass(classes.open + ' ' + classes.closing);
                focusOnLightboxLink(lightbox.$lightboxLink);
                showBodyScrollBar();
                enablePageTabbing($('body'));
                if (lightbox.options.onClose){
                    lightbox.options.onClose();
                }

            }, 500);
		}
	};

	$.fn.lightbox = function(options) {
		return this.each(function() {
			var lb = new Lightbox( this, options);
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
        $(document).on('mouseenter mouseleave', '[data-tooltip]', hover);
        $("[data-tooltip] .tooltip-content").on('click', preventClicksToParent);
    }

    function preventClicksToParent(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function hover(event) {
        var $hoveredElement = $(this),
            $tooltip = $hoveredElement.find('.tooltip-content');
        clearTimeout($tooltip.attr('data-tooltip-entry-timeout'));
        clearTimeout($tooltip.attr('data-tooltip-exit-timeout'));
        if (event.type == 'mouseenter') {
            if ($tooltip.text() !== "") {
                show($tooltip);
            }
        } else {
                hide($tooltip);
        }
    }

    function position($tooltip) {
        $tooltip.toggleClass("top", !detect.elementVisibleBottom($tooltip));
    }

    function show($tooltip) {
        $tooltip.attr('data-tooltip-entry-timeout', setTimeout(function () {
            $tooltip.addClass('show');
            setTimeout(function() {
                $tooltip.addClass('fade');
                position($tooltip);
            }, 15);
        }, 500));
    }

    function hide($tooltip) {
        var transitionDuration=250;
        $tooltip.attr('data-tooltip-exit-timeout', setTimeout(function () {
            $tooltip.removeClass('fade');
            setTimeout(function() {
                $tooltip.removeClass('show top');
            }, transitionDuration);
        },300));

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
toolkit.carousel = (function(video, detect) {
    

    var has3d = detect.css('support3D');
    var hasTransform = detect.css('transform');

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

            this.$slideContainer.find('figure').on('click', function (e) {
                if (e.target.parentNode.className.indexOf('play-video') >= 0 || e.target.className.indexOf('play-video') >= 0) {
                    return;
                }
                document.location = $(this).closest('.slide').find('figcaption a').attr('href');
            });

            this.$slideContainer.on('hover', '.slide figure', function (e) {
                $(this).closest('.slide').find('figcaption a').toggleClass('hover', e.type === 'mouseenter');
            });
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
    define('components/carousel', ['components/video', 'utils/detect'], function(video, detect) {
        return toolkit.carousel(video, detect);
    });
} else {
    toolkit.carousel = toolkit.carousel(toolkit.video, toolkit.detect);
}
;
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