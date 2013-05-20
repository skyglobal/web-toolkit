/**
 purpose:
 to let 'anchor' tags do their job and change the hash in the url for internal links.
 this will execute the associated callback with that hash.
 no onclick events needed.
 **/
bootstrap['hash-manager'] = (function() {

    var vars = {
        globalHashList: {},
        hasLoaded: false
    };

    function bindEvents() {
        $(window).on('hashchange load', onHashChange);
    }

    function onHashChange(e) {
        var evt = vars.globalHashList[location.hash];
        if (!evt) { return; }
        evt.callback(location.hash);
    }


    function remove(scroll) {
        var loc = window.location;
        if ("pushState" in history) {
            history.pushState("", document.title, loc.pathname + loc.search);
        } else {
            loc.hash = "";
            if (!scroll){
                scroll = {
                    top: document.body.scrollTop,
                    left: document.body.scrollLeft
                };
            }
            window.scrollTo(scroll.left, scroll.top);
        }
    }

    function change(newHash){
        location.hash = newHash;
    }

    function register(hashList, callback){
        var globalHashList = vars.globalHashList;
        $(hashList).each(function(){
            var hash = (this.indexOf('#') === 0) ? this : '#' + this;
            if (globalHashList[hash]){
                var err = 'hashManager: hash (' + hash + ') already exists';
                throw new Error(err);
            }

            globalHashList[hash] = {
                callback: callback
            };
        });
    }

    bindEvents();

    return {
        register: register,
        change: change,
        remove: remove,
        onHashChange: onHashChange
    };
}());
