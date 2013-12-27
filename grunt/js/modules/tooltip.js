if (typeof toolkit==='undefined') toolkit={};
toolkit.tooltip = (function() {

    function bindEvents() {
        $(document).on('mouseenter mouseleave ', '[data-tooltip-content-id], [title]', function (e) {

            var content = $(this).data('tooltip-content');
            if (!content) {
                console.log($(this).attr('id'));
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
            }
            clearTimeout(content.attr('data-tooltip-content-timeout'));
            if (e.type == 'mouseenter') {
                $(this).attr('data-tooltip-original-title', $(this).attr('title')).attr('title', '');
                content.fadeIn();
            } else {
                $(this).attr('title', $(this).attr('data-tooltip-original-title')).attr('data-tooltip-original-title', '');
                    content.attr('data-tooltip-content-timeout', setTimeout(function() {
                    content.fadeOut();
                }, 1000));
            }
        });
    }

    bindEvents();

    return {};

}());

if (typeof window.define === "function" && window.define.amd) {
    define('modules/tooltip', [], function() {
        return toolkit.tooltip;
    });
}
