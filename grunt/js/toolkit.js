if (typeof window.define === "function" && window.define.amd) {
//    explicitly call all js files here to ensure all files are available
    define('toolkit',[
        'utils/polyfill',
        'utils/detect',
        'utils/skycons',
        'utils/hashManager',
        'utils/popup',
        'utils/toggle',
        'utils/diff',
        'utils/focus',
        'utils/validation',
        'modules/inPageNav',
        'modules/accordion',
        'modules/datePicker',
        'modules/lightbox',
        'modules/share',
        'modules/video',
        'modules/carousel'], function(polyfill, detect, skycons, hashManager, popup,toggle, diff, focus, validation, inPageNav, accordion, datePicker, lightbox, share, video, carousel){

        return {
            polyfill: polyfill,
            detect: detect,
            skycons: skycons,
            hashManager: hashManager,
            popup: popup,
            toggle: toggle,
            diff: diff,
            focus: focus,
            validation: validation,
            inPageNav: inPageNav,
            accordion: accordion,
            datePicker: datePicker,
            lightbox: lightbox,
            share: share,
            video: video,
            carousel: carousel
        };
    });
}