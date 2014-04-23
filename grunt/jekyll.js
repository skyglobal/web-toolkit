module.exports = {
    options: {                          // Universal options
        bundleExec: true,
        src: 'app',
        dest: '_site'
    },
    build:{
        options: {
            watch: false,
            serve: false
        }
    }
};
