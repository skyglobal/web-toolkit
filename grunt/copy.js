module.exports = {
  dist: {
    src: 'dist/**',
    dest: '_site/'
  },
  test: {
    src: 'test/**',
    dest: '_site/'
  },
  skycons: {
    expand: true,
    flatten: true,
    cwd: 'generated-skycons',
    src: '*',
    dest: '_site/dist/fonts/'
  },
  skyconscss: {
    src: 'generated-skycons/skycons.css',
    dest: 'generated-skycons/skycons.non-minified.css'
  }
};
