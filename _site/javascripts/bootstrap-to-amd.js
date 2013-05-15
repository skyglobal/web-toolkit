
if ( typeof module === "object" && typeof module.exports === "object" ) {
    module.exports = bootstrap;
} else {
    if ( typeof define === "function" && define.amd ) {
        define( "bootstrap", [], function () { return bootstrap; } );
    }
}