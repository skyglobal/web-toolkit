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
        website: {
            options: {
                optimize: "none",
                modules: [{
                    name: 'demo'
                },{
                    name: 'tests'
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
