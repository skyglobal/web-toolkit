module.exports = function() {
    if (window.pageYOffset === undefined) {
        Object.defineProperty(window, "pageYOffset", {
            get : function () { return this.document.documentElement.scrollTop; }
        });
    }
};
