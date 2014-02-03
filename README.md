Web Toolkit
========================
[![Build Status](https://circleci.com/gh/skyglobal/web-toolkit.png?circle-token=24eeba25d7352dec038ea9fa25b22671ba28be5e)](https://circleci.com/gh/skyglobal/web-toolkit)

Look and feel for sky.com

Soon you will find an exciting and wonderful array of widgets that can be inserted directly into your site!

See the [reference page](http://skyglobal.github.io/web-toolkit/) for a description of each component.


## Building the Toolkit locally
### Prerequisites

- RVM
- Ruby (version 1.9.3 or later)
- npm

### Setup
1. Fork the repository from Github onto your local machine
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
3. Install grunt either globally, or run the following to use the bundled project grunt
  - npm install

### Code structure
- grunt/
  Dev area - get stuck into css and js here

- dist/
  Compiled code (via grunt)

- _includes/
  Source documentation for using the toolkit.

- _site/
  Compiled documentation (via jekyll) for using the API.

- test/
  the unit tests for the toolkit

- circle.yml
  Configuration for the CI server

- Gruntfile.js
  Configuration for grunt tasks - to do with compiling the javascript

### Testing
These tests are automatically run on the CircleCI server upon pushing to Github
  - `grunt test` for unit (using [mocha](http://visionmedia.github.io/mocha/) and [chai](http://chaijs.com/‎))

*Please note: jQuery 'show' and 'hide' dont work well, please add and remove the class 'hidden' instead.*

### Running

1. In the root of the project, run the following:
  - bundle
  - jekyll serve --watch
2. In another terminal run:
  - grunt watch (add '--beautify' to help when debugging)
3. Browse to
  - http://localhost:4000


### Contributing 

####Fork the repository
  - Using `git` you should fork a version of the toolkit (using github). Clone the fork locally ready to build your new/upgraded feature.
  `git clone` _italic_ clone url _italic_
    
  - Dont forget to set the upstream using:
  `git remote add upstream https://github.com/skyglobal/web-toolkit.git`
    
####Building A New/Updated Feature
  - It is best to code in a new branch allowing you to commit multiple branches/features without having a dependency on the previous request.
    
  - Before you start a feature you should ensure your code is up to date by running:
  `git pull upstream master`

####Committing
  - Before you submit your pull request ensure your code is up to date and merged by running:
  `git pull upstream master`


### Deployment
To release a new version with:
  - Code changes -  increment the version number (described below) in _config.yml. This will update gh-pages and the S3.
  - Documentation changes - Dont increment the version number. This will update gh-pages branch only.
  - Release Candidate changes - Add 'rc' to the end of the version number e.g. '1.0.1rc2'. this will update the S3 only

#### Versioning
This library should follow the [Semantic versioning specification](http://semver.org/).
In short, that means the following:

Version: X.Y.Z(-rc)?

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

