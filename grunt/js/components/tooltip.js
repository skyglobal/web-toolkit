if (typeof toolkit==='undefined') toolkit={};
toolkit.tooltip = (function() {

    var $document = $(document);
    var $w = $(window);

    function bindEvents() {
        $document.on('mouseenter mouseleave ', '[data-tooltip-content-id], [title]', displayTooltip);
    }

    function displayTooltip(e) {
        var content = $(this).data('tooltip-content');

        if (!content) {

            var contentId = $(this).attr('data-tooltip-content-id');

            if (contentId) {
                content = $('#' + contentId, $(this).parent());
            }

            if (!content) {
                var title = $(this).attr('title');
                content = $('<div/>').text(title);
                $(this).prepend(content);
            }

            content.addClass('tltp').hide();
            $(this).data('tooltip-content', content);

            if (toolkit.elementVisible(content) === false) {
                content.addClass("top");
            } else {
                content.removeClass("top");
            }

        }
        clearTimeout(content.attr('data-tooltip-content-timeout'));

        if (e.type == 'mouseenter') {
            $(this).attr('data-tooltip-original-title', $(this).attr('title')).attr('title', '');
            if (toolkit.elementVisible(content) === false) {
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
        displayTooltip: displayTooltip
    };
}());

if (typeof window.define === "function" && window.define.amd) {
    define('components/tooltip', [], function() {
        return toolkit.tooltip;
    });
} else {
    toolkit.tooltip = toolkit.tooltip;
}
