module.exports = {
        svgs: {
            files: [{
                expand: true,
                cwd: 'build/minified/svgs',
                src: ['*.svg'],
                dest: 'dist/svgs/'
            }]
        }
};
