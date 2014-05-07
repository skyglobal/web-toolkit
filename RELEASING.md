# Releasing the Web Toolkit

## CHANGELOG

Always update the [CHANGELOG.md](./CHANGELOG.md) with a summary of changes!! Please use the following format:
```
 * Component 
   * [added/update/removed/fixed] short description
```

## Branches

* `master` does nothing
* `feature-*` and `rc-*` get deployed to CDN (http://web-toolkit.global.sky.com)
* `stable` gets deployed to CDN and homepage (http://skyglobal.github.io/web-toolkit)

## Process

### 1. Development

E.g., new mobile spinners:

  * developers branch out `master` to `feature-mobile-spinners`
  * developers develop and test
  * developers change version in `package.json` to `2.2.13-feature-mobile-spinners-v1` (keep incrementing v1 for more deployments)
    * version has to contain `-feature`
    * version has to be unique for a deployment to S3
  * developers commit and push
  * developers check all's good on http://web-toolkit.global.sky.com/2.2.13-feature-mobile-spinners-v1/_site/index.html
  * developers do a `pull request` to `master` when finished

### 2. Release Candidate

E.g., new 2.2.13 release:

  * developers branch out `master` to `rc-2.2.13`
  * developers change version in `package.json` to `2.2.13-rc-v1` (keep incrementing v1 for more deployments)
  * developers commit and push
  * developers check all's good on http://web-toolkit.global.sky.com/2.2.13-rc-v1/_site/index.html

### 3. RELEASE!

E.g., new 2.2.13 release:

  * developers merge `rc-2.2.13` (from above) into `stable`
  * developers change version in `package.json` to `2.2.13`
  * developers commit and push
  * developers check all's good on http://skyglobal.github.io/web-toolkit

## Versioning Rules

  - Code changes
    - increment the version number in `package.json` following `semantic versioning` described below.
  - Documentation changes
    - Don't increment the version number.

This library should follow the [Semantic versioning specification](http://semver.org/).
In short, that means the following:

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
`package.json` file.
