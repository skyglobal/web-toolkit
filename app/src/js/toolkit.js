if (typeof window.define === "function" && window.define.amd) {
    define([
        'bower_components/bskyb-polyfill/dist/scripts/polyfill.requirejs',
        'bower_components/bskyb-hash-manager/dist/scripts/hash-manager.requirejs',
        'utils/toggle',
        'utils/focus',
        'utils/validation',
        'bower_components/bskyb-core/dist/scripts/core.requirejs',
        'components/in-page-nav',
        'components/accordion',
        'components/form',
        'components/lightbox',
        'bower_components/bskyb-share/dist/scripts/share.requirejs',
        'components/tooltip',
        'components/video',
        'components/carousel'], function(
            polyfill, hashManager, toggle, focus, validation, core,
            inPageNav, accordion, datePicker, lightbox, share, tooltip, video, carousel){

        toolkit.detect = core.detect;
        toolkit.event = core.event;
        toolkit.polyfill = polyfill;
        toolkit.hashManager = hashManager;
        toolkit.share = share;

        return {
            polyfill: polyfill,
            detect: core.detect,
            hashManager: hashManager,
            toggle: toggle,
            focus: focus,
            validation: validation,
            event: core.event,
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
