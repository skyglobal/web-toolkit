if (typeof toolkit === 'undefined') toolkit = {};
toolkit.tooltip = (function (detect) {

    function bindEvents() {
        $(document).on('mouseenter mouseleave', '[data-tooltip]', hover);
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
        $tooltip.toggleClass("top", !detect.elementVisibleBottom($tooltip));
    }

    function show($tooltip) {
        position($tooltip);
        $tooltip.attr('data-tooltip-content-timeout', setTimeout(function () {
            $tooltip.addClass('show');
        }, 750));
    }

    function hide($tooltip) {
        $tooltip.removeClass('show top');
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
