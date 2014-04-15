[Web Toolkit](http://skyglobal.github.io/web-toolkit/) Grunt
========================

The toolkit uses a number of grunt commands in order to build, serve, watch and rebuild the site.


## [Blanket Mocha](https://github.com/ModelN/grunt-blanket-mocha)

Runs our tests with code coverage.

## [Clean](https://github.com/gruntjs/grunt-contrib-clean)

Removes previously compiled files from the `dist`.

## [Compass](https://github.com/gruntjs/grunt-contrib-compass)

Compiles the Sass from `grunt/sass` into `dist`.

## [Connect](https://github.com/gruntjs/grunt-contrib-connect)

Runs the web server from the specified directory.

## [Exec](https://github.com/jharding/grunt-exec)

Executes command line instructions, specifically used from cross browser testing.

## GruntIcon

...forgotten

## [Jekyll](https://github.com/dannygarcia/grunt-jekyll)

Compiles the files needed for a Jekyll server into the `_site` directory.
GHPages serves this directory at <skyglobal.github.io/web-toolkit>.

## [JSHint](https://github.com/gruntjs/grunt-contrib-jshint)

Validates all our JS.

## [Mocha](https://github.com/kmiyashiro/grunt-mocha)

Runs our tests.

## [Open](https://github.com/jsoverson/grunt-open)

Opens the website on your browser.

## [RequireJS](https://github.com/gruntjs/grunt-contrib-requirejs)

Server side dependency management.

## [SVGMin](https://github.com/sindresorhus/grunt-svgmin)

Minify the SVG files used within Skycons

## [Uglify](https://github.com/gruntjs/grunt-contrib-uglify)

Creates a minified and beautified version of the JS within `dist/scripts`. Also adds the version number comment.

## [Version Sync](https://github.com/adgad/grunt-version-sync)

Keeps `_config.yml` version number in sync with the manually changed number from `package.json`.

## [Watch](https://github.com/gruntjs/grunt-contrib-watch)

Watches all the source files (e.g. `grunt/js` and `_include`) for changes and will rebuild the jekyll server automatically.

## [WebFont](https://github.com/sapegin/grunt-webfont)

Takes the font SVG's and using the templates, builds a number of font files and a single css.