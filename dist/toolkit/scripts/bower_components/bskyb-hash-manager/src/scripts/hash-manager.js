var core = require('../../bower_components/bskyb-core/src/scripts/core');
var event = core.event;

var vars = {
    globalHashList: {},
    eventsAlreadyBound: false,
    lastExecutor: null,
    hash: null
};

function bindEvents() {
    event.on(window, "hashchange", onHashChange);
    var doc_mode = document.documentMode,
        hashChangeSupport = 'onhashchange' in window && ( doc_mode === undefined || doc_mode > 7 );
    if (!hashChangeSupport){ //IE7 support
        vars.hash = document.location.hash;
        setInterval(function(){
            if (document.location.hash !== vars.hash){
                event.trigger(window,'hashchange');
            }
        },200);
    }
    vars.eventsAlreadyBound = true;
}

function onHashChange(hash) {
    var evt, fn;
    hash = cleanHash((typeof hash === 'string') ? hash : location.hash);

    if (hash.indexOf('?') > 1) {
        hash = hash.split('?')[0];
    }
    evt = getHashEvent(hash);
    if (hash && evt) {
        fn = 'callback';
        vars.lastExecutor = hash;
    } else if (vars.lastExecutor) {
        evt = getHashEvent(vars.lastExecutor);
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

module.exports = {
    register: register,
    change: change,
    remove: remove,
    onHashChange: onHashChange,
    resetHash: resetHash,
    cleanHash: cleanHash
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents['hash-manager'] = module.exports;