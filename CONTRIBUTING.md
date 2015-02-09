# Contributing

Please contribute!  But first, make sure you have [Set Up](./README.md#setup) the project correctly, and understand our [Supported Browsers](./README.md#supported-browsers).

## Contributing your changes

 1. Make sure the code is up to date
   * `git pull upstream master`
 2. add your feature in a new branch
   * `git checkout -b feature-my-new-stuff`
 3. Write and run tests as you go, and keep the test coverage above 80%.
   * `grunt test`
 4. Keep the code clean and self documenting
 5. Make sure you are still up to date with master
   * `git pull upstream master`
 6. Make sure [HISTORY.md](./HISTORY.md) includes a summary of your changes in a new version number heading
 7. Push your branch to github
   * `git push origin feature-my-new-stuff`
 8. open a Pull request within github.

If you would like the feature to go live sooner, mention this in the comments/commit. We will provide a temporary live url that will allow you to carry on without getting blocked.

You can also run the cross-browser suite yourself if you have a Browsers Stack account. See `test/README.md`.

## Fonts/SVGs

When adding a new icon:
 1. put the .svg in the `app/src/skycons` folder
 2. run `grunt fonts`
 3. run `grunt && grunt serve` and verify that the icon appears
 4. commit away and do a pull request. :)

## Coding Rules

### CSS
 * Use hyphens '-' within all class, ID and name attribute. 
 * Never camelCase or underscore.

### JS
 * Where possible, use 'camelCase' for function/variable names.

### Files / Directories: 
 * Where possible, use 'camelCase'.
 
### JQuery
 * Where possible, please don't rely on jQuery. 
 * Be lean, the Toolkit is working towards freeing itself of jQuery dependency. help us!
 * For events, We suggest using Toolkit's own events component:  [`skyComponents.event`](https://github.com/skyglobal/event)
 * JQuery Variable Names (a jQuery object/element) should always be prefixed with `$` i.e. `$container`

### Animations
  * Use CSS3 animations/transitions where possible over jQuery or JavaScript. This will improve performance, especially for mobile devices.

## Accessibility

Don't forget to make sure your code is accessible.
Add about half a day to each client-side card to give you time to check:
 * colour contrast
 * Keyboard 'tabbing' (make the elements background blue and text and icons white)
 * VoiceOver

For page text that is needed only for screen readers, add the class `speak`.
