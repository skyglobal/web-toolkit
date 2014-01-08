/*toolkit util to check if a given element is visible within the view port.
* returns TRUE or False
* Usage:
* elementVisible($('h1'))
* */
if (typeof toolkit==='undefined') toolkit={};
toolkit.elementVisible = (function () {

    var $w = $(window);

    function visible($el) {
            if ($el.length < 1)
        return;

    var vpWidth = $w.width(),
        vpHeight = $w.height();

    var viewTop = $w.scrollTop(),
        viewBottom = viewTop + vpHeight,
        viewLeft = $w.scrollLeft(),
        viewRight = viewLeft + vpWidth,

        offset = $el.offset(),
        _top = offset.top,
        _bottom = _top + $el.height(),
        _left = offset.left,
        _right = _left + $el.width();

    return ((_bottom <= viewBottom) && (_top >= viewTop) && (_right <= viewRight) && (_left >= viewLeft));
    }

   return visible;
});
if (typeof window.define === "function" && window.define.amd) {
    define('utils/elementVisible', [], function() {
        return toolkit.elementVisible();
    });
} else {
    toolkit.elementVisible = toolkit.elementVisible();
}