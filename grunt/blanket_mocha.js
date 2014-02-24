module.exports = {
    all : ['_site/test.html'],
    options : {
        reporter: 'Spec',
        threshold : 70, // <- percetage of files that have to pass coverage rules
        globalThreshold : 80, // <- coverage rule
        log : true
    }
};