module.exports = {
    icons: {
        src: 'src/fonts/min/*.svg',
        dest: 'dist/fonts',
        destCss: 'dist/fonts',
        options: {
            font : 'skycons',
            template : 'src/fonts/template/skycon-template.css',
            htmlDemoTemplate : 'src/fonts/template/skycon-template.html',
            htmlDemo : true,
//                    engine : 'node',
            destHtml : 'jekyll/_includes/base-styles/icons',
            hashes : false,
            embed : true
        }
    }
};
