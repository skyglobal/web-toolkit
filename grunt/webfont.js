module.exports = {
    icons: {
        src: 'app/src/fonts/min/*.svg',
        dest: '_site/dist/fonts/',
        destCss: '_site/dist/fonts/',
        options: {
            ie7 : true,
            font : 'skycons',
            template : 'app/src/fonts/template/skycon-template.css',
            htmlDemoTemplate : 'app/src/fonts/template/skycon-template.html',
            htmlDemo : true,
            ligatures : false,
            engine : 'node', //'fontforge',
            destHtml : 'app/_includes/base-styles/icons',
            hashes : false,
            embed : true
        }
    }
};
