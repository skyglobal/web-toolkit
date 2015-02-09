module.exports = function(grunt){
    return {
        options: {
            preserveLicenseComments: false,
            baseUrl: "app/src/js",
            removeCombined: true,
            generateSourceMaps: false,
            optimize: "none",
            paths: {
                utils: "toolkit/utils",
                components: "toolkit/components",
                highlight: "vendor/highlight",
                bower_components: "../../../bower_components"
            }
        },
        toolkit: {
            options: {
                dir: "dist/toolkit/scripts",
                modules: [{
                    name: 'toolkit'
                }]
            }
        },
        demo: {
            options: {
                dir: "dist/demo/scripts",
                modules: [{
                    name: 'toolkit'
                },{
                    name: 'demo', exclude: ['toolkit', 'tests']
                },{
                    name: 'tests', exclude: ['toolkit']
                },{
                    name: 'changes'
                }]
            }
        }
    }
};
