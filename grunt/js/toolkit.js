if (typeof window.define === "function" && window.define.amd) {
//    explicitly call all js files here to ensure all files are available
    define('toolkit',[
        'utils/polyfill',
        'utils/detect',
        'utils/skycons',
        'utils/hashmanager',
        'utils/popup',
        'utils/toggle',
        'utils/diff',
        'utils/focus',
        'modules/inPageNav',
        'modules/accordion',
        'modules/datePicker',
        'modules/validation',
        'modules/lightbox',
        'modules/share',
        'modules/video',
        'modules/carousel'], function(polyfill, detect, skycons, hashmanager, popup,toggle, diff, focus, inPageNav, accordion, datePicker, validation, lightbox, share, video, carousel){

        return {
            polyfill: polyfill,
            detect: detect,
            skycons: skycons,
            hashmanager: hashmanager,
            popup: popup,
            diff: diff,
            focus: focus,
            inPageNav: inPageNav,
            accordion: accordion,
            datePicker: datePicker,
            validation: validation,
            lightbox: lightbox,
            share: share,
            video: video,
            carousel: carousel
        };
    });
}