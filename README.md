Web Toolkit
========================

Look and feel for sky.com

Soon you will find an exciting and wonderful array of widgets that can be inserted directly into your site!

See the [reference page](http://skyglobal.github.io/web-toolkit/) for a description of each component.


## Using the Toolkit
//web-toolkit.global.sky.com/version-number/stylesheets/toolkit.css
//web-toolkit.global.sky.com/version-number/scripts/toolkit.js
//web-toolkit.global.sky.com/version-number/images/icons.png

## Wiki
[You can contribute to the wiki!!!](https://github.com/bskyb-commerce/bskyb-commerce.github.io/wiki)


## Building the Toolkit locally
### Prerequisites

- RVM
- Ruby (version 1.9.3 or later)
- npm

### Setup
1. Clone the repository from Github onto your local machine
2. Install npm
  - echo 'export PATH=/usr/local/bin:$PATH' >> ~/.bashrc
  - . ~/.bashrc
  - mkdir /usr/local
  - mkdir ~/node-latest-install
  - cd ~/node-latest-install
  - curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1
  - ./configure --prefix=/usr/local
  - make install # ok, fine, this step probably takes more than 30 seconds...
  - curl https://npmjs.org/install.sh | sh

### Testing
You can run the Javascript Unit tests with the following:
  - grunt test

These tests can also be run individially by specifying a pattern:
  - grunt test --pattern=Hash*

(see [mocha](http://visionmedia.github.io/mocha/) and [chai](http://chaijs.com/‎) )

### Running

1. In the root of the project, run the following:
  - bundle
  - jekyll serve --watch
2. In another terminal run:
  - grunt watch #(add '--beautify' to help when debugging)
3. Browse to http://localhost:4000

### Deployment
To release a new version with:
  Code changes -  increment the version number (described below) in _config.yml. This will update gh-pages and the S3.
  Documentation changes - Dont increment the version number. This will update gh-pages branch only.
  Release Candidate changes - Add 'rc' to the end of the version number e.g. '1.0.1rc2'. this will update the S3 only

#### Versioning
This library should follow the [Semantic versioning specification](http://semver.org/).
In short, that means the following:

Version: X.Y.Z(rc)?

- API changes that are **not backwards compatible**, and break existing
  calls using the API must increment the X value.

- API changes that introduce **new backwards compatible changes**, or **change the
  internals**, but not the interface, of existing methods will increment the
  Y value.

- **Patches or bug fixes** that are backwards compatible should increment the
  Z value.

- rc Represents 'release candidates'.  This is to create a public available url for testing purposes.

Upon commiting and pushing your code to Github, the CI server will run through
the functional tests and - if there are no errors - a new version of the library
will be deployed to the CDN using the version number specified in the
_config.yml file.

