# Releasing the Web Toolkit

Always update the [CHANGELOG.md](./CHANGELOG.md) with a summary of changes!! Please use the following format:
 * Component 
   * [added/update/removed/fixed] short description

To release a new version with:
  - Code changes
    - increment the version number in package.json following `semantic versioning` described below.
    - This will update gh-pages and the S3.
  - Documentation changes
    - Don't increment the version number.
    - This will update gh-pages branch only.
  - Feature releases
    - To be used when contributers want to integration test a new feature/proposed pull requrest.
    - Ensure that the code is committed in a branch that starts with `feature-xxx`. Where xxx is feature.
    - Add `-feature-xxx` to the end of the version number e.g. `1.0.1-feature-fancy-carousel`.
    - This will update the S3 only
  - Release Candidate changes
    - To be used when new features/bugs fixes have been merged and is ready to be integration test by toolkit owners.
    - Commit the code into a branch that starts with `rc-111`. Where 111 is the version number.
    - Add `-rc-111` to the end of the version number e.g. `1.0.1-rc-2`.
    - This will update the S3 only.

Feature and RC releases will be available by going to http://web-toolkit.global.sky.com/ and adding either `x.x.x-feature-111/` or `x.x.x-rc-111`. where x.x.x is the current toolkit version number.  Please give the contributor the full URL in a comment along side their pull request / issue.

## Versioning

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

- -rc Represents 'release candidates'.  This is to create a public available url for testing purposes.

Upon commiting and pushing your code to Github, the CI server will run through
the functional tests and - if there are no errors - a new version of the library
will be deployed to the CDN using the version number specified in the
package.json file.
