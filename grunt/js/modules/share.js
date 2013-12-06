if (typeof toolkit==='undefined') toolkit={};
toolkit.share = (function() {

    var $document = $(document);

    function bindEvents() {
        $document.on('click keypress', '.share-popup .summary', toggleSharePopover);
    }

    function toggleSharePopover(e) {
        e.preventDefault();
        var $section = $(this).parent(),
            triggerEvents = 'keypress ' + ('ontouchend' in document.documentElement ? 'touchend' : 'click');
        if(e.type === 'click' || e.type === 'touchend' || (e.type === 'keypress' && e.which === 13)) {
            $section.toggleClass('active');
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
    define('modules/share', [], function() {
        return toolkit.share();
    });
} else {
    toolkit.share = toolkit.share();
}
