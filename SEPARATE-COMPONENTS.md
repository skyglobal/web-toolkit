### Separating Components

> We are now breaking the toolkit up into smaller chunks.
> The aim of this is to make it simpler, easier and quicker to contribute, add enhancements and fix bugs.
> As a bonus, this will allow us to play with new techonolgoies without worrying about breaking everything!

## All we ask is:

* A demopage using gh-pages branch is visible 
   * i.e. skyglobal.github.io/component
* The component is tested and can be run locally 
   * `gulp test`
* The project can be run locally using port 3456 and the command serve 
   * `gulp serve`
* The component can be released to bower  
   * `gulp release:bower` 
* The component demo page can be updated easily 
   * `gulp release:gh-pages` 
* The component should be on a cdn (available behind akamai) 
   * `gulp release:cdn` 
* The finished component is made available on bower 
   * i.e. `bower install --save-dev bskyb-component`
* Any dependencies are also made into separate components too

The `gulp` command mentioned in the above is optional.   Feel free to use `grunt` if it fits your needs better, but please keep `test`, `serve`, `release:bower`, `release:gh-pages` and `release:cdn`.

### Naming Conventions

Within bower.json and package.json use :
 * bskyb-**component-name**

Please, no mention of `toolkit`!

## First gh-pages Release

If you decide to use gulp-gh-pages (which is amazing and highly recommended) for demo page releases.  Please follow the instructions the plugins instructions before manually creating a gh-pages branch.

https://www.npmjs.org/package/gulp-gh-pages

## First Bower Release

The following step only needs to be done the first time you release to Bower:

`bower register bskyb-component-name git@github.com:skyglobal/component-name.git`
