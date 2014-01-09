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
        $tooltip.attr('data-tooltip-content-timeout', setTimeout(function () {
            $tooltip.addClass('show');
            setTimeout(function() {
                $tooltip.addClass('fade');
                position($tooltip);
            }, 15);
        }, 500));
    }

    function hide($tooltip) {
        var transitionDuration=250;
        $tooltip.removeClass('fade');
        setTimeout(function() {
            $tooltip.removeClass('show top');
        }, transitionDuration);
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
