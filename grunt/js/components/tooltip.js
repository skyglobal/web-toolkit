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
