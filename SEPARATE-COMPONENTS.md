### Separating Components

> We are now breaking the toolkit up into smaller chunks.
> The aim of this is to make it simpler, easier and quicker to contribute, add enhancements and fix bugs.
> As a bonus, this will allow us to play with new techonolgoies without worrying about breaking everything!

## All we ask is:

* A demopage using gh-pages branch is visible 
   * i.e. skyglobal.github.io/component
* The component is tested and can be run locally 
   * `grunt test`
* The project can be run locally using port 3456 and the command serve 
   * `grunt serve`
* The component can be released to bower  
   * `grunt release:bower` 
* The component demo page can be updated easily using 
   * `grunt release:gh-pages` 
* The finished component is made available on bower 
   * i.e. `bower install --save-dev bskyb-component`
* Any dependencies are also made into separate components too

The `grunt` command mentioned in the above is optional.   Feel free to use `gulp` if it fits your needs better, but please keep `test`, `serve`, `release:bower` and `release:gh-pages`.

### Naming Conventions

Within bower.json and package.json use :
 * bskyb-**component-name**

Please, no mention of `toolkit`!
