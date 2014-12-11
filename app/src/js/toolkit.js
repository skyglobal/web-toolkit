if (typeof window.define === "function" && window.define.amd) {
    define([
        'bower_components/bskyb-polyfill/dist/js/polyfill',
        'utils/detect',
        'utils/hash-manager',
        'utils/popup',
        'utils/toggle',
        'utils/focus',
        'utils/event',
        'components/in-page-nav',
        'components/accordion',
        'components/form',
        'components/lightbox',
        'components/share',
        'components/tooltip',
        'components/video',
        'components/carousel'], function(
            polyfill, detect, hashManager, popup,toggle, focus, validation, event,
            inPageNav, accordion, datePicker, lightbox, share, tooltip, video, carousel){
        return {
            polyfill: polyfill,
            detect: detect,
            hashManager: hashManager,
            popup: popup,
            toggle: toggle,
            focus: focus,
            validation: validation,
            event: event,
            inPageNav: inPageNav,
            accordion: accordion,
            datePicker: datePicker,
            lightbox: lightbox,
            share: share,
            tooltip: tooltip,
            video: video,
            carousel: carousel
        };
    });
}
