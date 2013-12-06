if (typeof toolkit==='undefined') toolkit={};
toolkit.polyfill = (function () {
    "use strict";

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

}());

if (typeof window.define === "function" && window.define.amd) {
    define('utils/polyfill', [], function() {
        'use strict';
        return toolkit.polyfill;
    });
}