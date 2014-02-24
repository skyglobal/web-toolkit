module.exports = {
    icons: {
        src: 'grunt/fonts/min/*.svg',
        dest: 'dist/fonts',
        destCss: 'dist/fonts',
        options: {
            font : 'skycons',
            template : 'grunt/fonts/template/skycon-template.css',
            htmlDemoTemplate : 'grunt/fonts/template/skycon-template.html',
            htmlDemo : true,
//                    engine : 'node',
            destHtml : '_includes/base-styles/icons',
            hashes : false,
            embed : true
        }
    }
};