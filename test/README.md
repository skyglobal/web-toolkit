[Web Toolkit](http://skyglobal.github.io/web-toolkit/) Tests
========================

## Run tests

Unit tests use [mocha](http://visionmedia.github.io/mocha/) and [chai](http://chaijs.com/‎).

`grunt test`

The toolkit will be rebuilt, and tests run twice: once on the source code (with a coverage report) and once with minified code.
The coverage limit is set to 80%, so please make sure your changes keep it where it is or improve it.

The site is also able to run unit tests online by clicking the `run tests` arrow next to the feature headlines.