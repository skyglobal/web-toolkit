if (typeof toolkit==='undefined') toolkit={};
toolkit.tooltip = (function(detect) {

    var $document = $(document);

    function bindEvents() {
        $document.on('mouseenter mouseleave ', '[data-tooltip-content-id], [title]', getTooltipContent);
    }



    function getTooltipContent(event) {
        var content = $(this).data('tooltip-content');

        if (!content) {

            content = $('#' + $(this).attr('data-tooltip-content-id'), $(this).parent());

            if (!content) {
                var title = $(this).attr('title');
                content = $('<div/>').text(title);
                $(this).prepend(content);
            }

            content.addClass('tltp').hide();
            $(this).data('tooltip-content', content);
        }
        clearTimeout(content.attr('data-tooltip-content-timeout'));
        displayToolTip(event, content);
    }

    function displayToolTip(event, content) {
        if (event.type == 'mouseenter') {
            $(this).attr('data-tooltip-original-title', $(this).attr('title')).attr('title', '');

            if (detect.elementVisibleBottom(content) === false) {
                content.addClass("top");
            } else {
                content.removeClass("top");
            }
            content.fadeIn();
        } else {
            $(this).attr('title', $(this).attr('data-tooltip-original-title')).attr('data-tooltip-original-title', '');
            content.attr('data-tooltip-content-timeout', setTimeout(function () {
                content.fadeOut();
            }, 1000));
        }
    }

    bindEvents();

    return {
        displayTooltip: getTooltipContent
    };
});

if (typeof window.define === "function" && window.define.amd) {
    define('components/tooltip', ['utils/detect'], function(detect) {
        return toolkit.tooltip(ev);
    });
} else {
    toolkit.tooltip = toolkit.tooltip(toolkit.detect);
}
