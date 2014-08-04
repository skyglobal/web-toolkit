module.exports = {
    icons: {
        src: 'build/minified/skycons/*.svg',
        dest: 'dist/fonts/',
        destCss: 'dist/fonts/',
        options: {
            ie7 : true,
            font : 'skycons',
            template : 'app/src/skycons/skycon-template.css',
            htmlDemoTemplate : 'app/src/skycons/skycon-template.html',
            htmlDemo : true,
            ligatures : false,
            engine : 'node', //'fontforge',
            destHtml : 'app/_includes/base-styles/icons',
            hashes : false,
            embed : true
        }
    }
};
