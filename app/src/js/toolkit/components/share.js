if (typeof toolkit==='undefined') toolkit={};
toolkit.share = (function(detect) {

    var $document = $(document);

    function bindEvents() {
        $document.on('click keypress', '.share-popup .summary', toggleSharePopover);
    }

    function toggleSharePopover(e) {
        e.preventDefault();
        var $section = $(this).parent(),
            $popover = $section.parent().find('.popover'),
            triggerEvents = 'keypress ' + ('ontouchend' in document.documentElement ? 'touchend' : 'click');
        if(e.type === 'click' || e.type === 'touchend' || (e.type === 'keypress' && e.which === 13)) {
            $section.toggleClass('active');
            $popover.toggleClass("top", !detect.elementVisibleBottom($popover[0]));
            $popover.toggleClass("left", !detect.elementVisibleRight($popover[0]));

            $document.on(triggerEvents, function hidePopover(e) {
                if(!$.contains($section[0], e.target)) {
                    $section.removeClass('active');
                    $document.off(triggerEvents, hidePopover);
                }
            });
        }
    }

    bindEvents();

    return {
        toggleSharePopover: toggleSharePopover
    };
});

if (typeof window.define === "function" && window.define.amd) {
    define('components/share', ['bower_components/bskyb-detect/dist/js/detect.requirejs'], function(detect) {
        return toolkit.share(detect);
    });
} else {
    toolkit.share = toolkit.share(skyComponents.detect);
}
