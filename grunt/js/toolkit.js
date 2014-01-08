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
        'utils/elementVisible',
        'components/inPageNav',
        'components/accordion',
        'components/datePicker',
        'components/lightbox',
        'components/share',
        'components/tooltip',
        'components/video',
        'components/carousel'], function(polyfill, detect, skycons, hashManager, popup,toggle, diff, focus, validation,elementVisible, inPageNav, accordion, datePicker, lightbox, share, tooltip, video, carousel){

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
            elementVisible: elementVisible,
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