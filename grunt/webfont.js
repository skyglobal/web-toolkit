module.exports = {
    icons: {
        src: 'grunt/fonts/min/*.svg',
        dest: 'dist/fonts',
        destCss: 'dist/fonts',
        options: {
            ie7:false,
            font : 'skycons',
            template : 'grunt/fonts/template/skycon-template.css',
            htmlDemoTemplate : 'grunt/fonts/template/skycon-template.html',
            htmlDemo : true,
            ligatures : false,
//                    engine : 'node',
            destHtml : '_includes/base-styles/icons',
            hashes : false,
            embed : true
        }
    }
};