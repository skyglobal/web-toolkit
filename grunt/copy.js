module.exports = {
  dist: {
    src: 'dist/**',
    dest: '_site/'
  },
  test: {
    src: 'test/**',
    dest: '_site/'
  },
  bower_fonts: {
      files: [
        {   expand: true,
            cwd: 'bower_components/',
            src: 'bskyb-skycons/dist/**',
            flatten: true,
            filter: 'isFile',
            dest: 'dist/fonts/'
        }
      ]
  }
};
