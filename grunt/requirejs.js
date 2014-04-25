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
            packages: [ 'toolkit', 'demo', 'tests', 'changes' ],
            modules: [{
                name: 'toolkit'
            },{
                name: 'demo'
            },{
                name: 'tests'
            },{
                name: 'changes'
            }]
        },
        toolkit: {
            options: {
                optimize: "none"
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
