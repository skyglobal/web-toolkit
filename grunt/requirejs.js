module.exports = function(grunt){
    return {
        options: {
            preserveLicenseComments: false,
            baseUrl: "app/src/js",
            dir: "dist/scripts",
            removeCombined: true,
            generateSourceMaps: false,
            paths: {
                utils: "toolkit/utils",
                components: "toolkit/components",
                highlight: "vendor/highlight"
            },
            packages: [ 'toolkit', 'demo', 'tests', 'changes' ]
        },
        toolkit: {
            options: {
                optimize: "none",
                modules: [{
                    name: 'toolkit'
                }]
            }
        },
        demo: {
            options: {
                optimize: "none",
                modules: [{
                    name: 'demo', exclude: ['toolkit', 'tests']
                },{
                    name: 'tests', exclude: ['toolkit']
                },{
                    name: 'changes'
                }]
            }
        },
        beautify: {
            options: {
                optimize: "none"
            }
        },
        uglify: {
            options: {
                optimize: "uglify2"
            }
        }
    }
};
