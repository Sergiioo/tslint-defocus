# tslint-defocus

## About
This is a tslint rule that warns about focussed Jasmine tests - fdescribe and fit

## Usage
* Install with: `npm install tslint-defocus --save-dev`
* Add the rule to your `.tslint.json` file:
```
  "rulesDirectory": "./node_modules/tslint-defocus/dist",
  "rules": {
    "defocus": true,
    ...
```
(as per the [instructions for custom rules](http://palantir.github.io/tslint/usage/custom-rules/))
* Run tslint as you usually would (gulp plugin, directly from node, etc)
* If you forget to remove a call to `fdescribe` or `fit` then you will see something like from tslint:
```
(defocus) app.ts[4, 1]: Calls to 'fdescribe' are not allowed.
(defocus) app.ts[8, 5]: Calls to 'fit' are not allowed.
```

## Developer instructions
* installed the required global npm packages: `npm install gulp --global --no-optional`.
* Clone [from github](https://github.com/Sergiioo/tslint-defocus)
* Run `npm run setup` to install and get started
* Build, lint and unit test by running the default gulp task with: `gulp`
