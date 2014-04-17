module.exports = {
    icons: {
        src: 'app/src/fonts/min/*.svg',
        dest: 'generated-skycons',
        destCss: 'generated-skycons',
        options: {
            font : 'skycons',
            template : 'app/src/fonts/template/skycon-template.css',
            htmlDemoTemplate : 'app/src/fonts/template/skycon-template.html',
            htmlDemo : true,
//                    engine : 'node',
            destHtml : 'app/_includes/base-styles/icons',
            hashes : false,
            embed : true
        }
    }
};
