module.exports = function(grunt){
    return {
        options: {
            preserveLicenseComments: false,
            baseUrl: "src/js",
            dir: "dist/scripts",
            removeCombined: true,
            generateSourceMaps: false,
            modules:[{
                name: 'toolkit'
            },{
                name: 'demo'
            },{
                name: 'changes'
            },{
                name: 'testIFrame'
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