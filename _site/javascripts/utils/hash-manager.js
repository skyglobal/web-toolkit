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

    function change(hashList, callback){
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
        return {
            with: ''
        };
    }

    bindEvents();

    return {

        change: change,
        onHashChange: onHashChange

    }
}());