module.exports = {
    options: {                          // Universal options
        bundleExec: true,
        src: 'src/html',
        dest: '_site'
    },
    build:{
        options: {
            watch: false,
            serve: false
        }
    }
};
