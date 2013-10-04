define(function() {

        var $el = {
            document: $(document),
            shareCount: $('.share-popup .summary')
        };

        function bindEvents() {
            $el.shareCount.on('click keypress', toggleSharePopover);
        }

        function toggleSharePopover(e) {
            e.preventDefault();
            var $section = $(this).parent(),
                triggerEvents = 'keypress ' + ('ontouchend' in document.documentElement ? 'touchend' : 'click');
            if(e.type === 'click' || e.type === 'touchend' || (e.type === 'keypress' && e.which === 13)) {
                $section.toggleClass('active');
                $el.document.on(triggerEvents, function hidePopover(e) {
                    if(!$.contains($section[0], e.target)) {
                        $section.removeClass('active');
                        $el.document.off(triggerEvents, hidePopover);
                    }
                });
            }
        }

        function init() {
            bindEvents();
        }

        return {
            init: init,
            toggleSharePopover: toggleSharePopover
        };
    }
);