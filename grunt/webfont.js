module.exports = {
    icons: {
        src: 'generated-skycons/min/*.svg',
        dest: 'generated-skycons',
        destCss: 'generated-skycons',
        options: {
            ie7 : true,
            font : 'skycons',
            template : 'app/src/webfont-templates/skycon-template.css',
            htmlDemoTemplate : 'app/src/webfont-templates/skycon-template.html',
            htmlDemo : true,
            ligatures : false,
            engine : 'node', //'fontforge',
            destHtml : 'app/_includes/base-styles/icons',
            hashes : false,
            embed : true
        }
    }
};
