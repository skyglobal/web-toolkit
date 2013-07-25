Sky Global Web Toolkit
========================

Look and feel for sky.com

Soon you will find an exciting and wonderful array of widgets that can be inserted directly into your site!

See the [reference page](http://skyglobal.github.io/web-toolkit/) for a description of each component.


## Using the Toolkit
### CSS
- "//web-toolkit.global.sky.com/<version-number>/stylesheets/sky_web_toolkit.css"

### JS
- "//web-toolkit.global.sky.com/<version-number>/js/toolkit.js"

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

### Running

1. In the root of the project, run the following:
  - bundle
  - jekyll serve --watch
2. In another terminal run 'grunt watch'
3. You should be able to see the documentation site in your browser on http://localhost:4000

### Deployment
In order to release a new version of the library, the version number in _config.yml must be
incremented following the rules below:

#### Versioning
This library should follow the [Semantic versioning
specification](http://semver.org/). In short, that means the following:

Version: X.Y.Z

- API changes that are **not backwards compatible**, and break existing
  calls using the API must increment the X value.

- API changes that introduce **new backwards compatible changes**, or **change the
  internals**, but not the interface, of existing methods will increment the
  Y value.

- **Patches or bug fixes** that are backwards compatible should increment the
  Z value.


Upon commiting and pushing your code to Github, the CI server will run through
the functional tests and - if there are no errors - a new version of the library
will be deployed to the CDN using the version number specified in the
_config.yml file.
