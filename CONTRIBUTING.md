# Contributing

Please contribute!  But first, read the [ReadMe](https://github.com/skyglobal/web-toolkit#setup).

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
 6. Push your branch to github
   * `git push origin feature-my-new-stuff`
 7. open a Pull request within github.

If you would like the feature to go live sooner, mention this in the comments/commit. We will provide a temporary live url that will allow you to carry on without getting blocked.

You can also run the cross-browser suite yourself if you have a Browsers Stack account. See `test/README.md`.

## Coding Rules

 * CSS: Use hyphens '-' within all class, ID and name attribute. Never camelCase or underscore.
 * JS: Where possible, use 'camelCase' for function/variable names.
 * Files / Directories: Where possible, use 'camelCase'.
 * JQuery: Where possible, please don't rely on jQuery. To be lean, Toolkit is working towards freeing itself of jQuery dependency.
 * Events: We suggest using Toolkit's own events module: toolkit.event
 * Variable Names: If name refers to a jQuery object/element always prefix the name with $ i.e. $container
 * Animations: Use CSS3 animations/transitions where possible over jQuery and JavaScript. This will improve performance, especially for mobile devices.

## Accessibility

Don't forget to make sure your code is accessible.
Add about half a day to each client-side card to give you time to check:
 * colour contrast
 * Keyboard 'tabbing' (make the elements background blue and text and icons white)
 * VoiceOver

For page text that is needed only for screen readers, add the class `speak`.
