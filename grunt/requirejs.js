module.exports = function(grunt){
        return {
            options: {
                preserveLicenseComments: false,
                baseUrl: "grunt/js",
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
                optimize: grunt.option('beautify') ? "none" : "uglify2"
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