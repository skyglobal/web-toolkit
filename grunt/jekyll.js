module.exports = {
    options: {                          // Universal options
        bundleExec: true,
        src: 'jekyll',
        dest: '_site'
    },
    build:{
        options: {
            watch: false,
            serve: false
        }
    }
};
