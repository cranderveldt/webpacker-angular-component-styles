# Webpacker Angular Component Styles Bug

This is an example app showing how to set up your Rails app with webpacker and Angular using imported HTML and SCSS for each component.

## App Init

* `rails new webpacker-angular-component-styles`
* `bundle exec rails webpacker:install:angular`
* `rails g controller example`
* Create views/example/index.html.erb
* Add `root 'example#index'` to routes.rb
* In `application.html.erb` change the `javascript_pack_tag` to `hello_angular`
* If you get compile-time errors from ActionCable, delete application JS pack and associated files
* In `package.json` change `core-js`'s version to `2.5.7`. There is some incompatibility with version 3 of `core-js` and the `polyfill.ts` that webpacker generates. (https://stackoverflow.com/questions/55308769/module-not-found-error-cant-resolve-core-js-es6)[More info here]
* `rails s`

## Importing component HTML

At this point everything should work, and you should see "Hello Angular!" But using only inline styles and HTML kind of defeats the purpose of using Angular. So let's extract the markup to a separate HTML file.

* `yarn add html-loader`
* In webpacker.yml, add `- .html` to the `extensions:` section
* Create new file `javascript/hello_angular/app/app.component.html`
* Copy markup from from the .ts file into this
* Create a new file `javascript/hello_angular/html.d.ts` which should have the following contents:
```ts
declare module "*.html" {
  const content: string;
  export default content;
}
```
* In app.component.ts, import your HTML file like this:
```ts
import template from './app.component.html';

@Component({
  selector: 'hello-angular',
  template
})
```
* In `webpack/environment.js`, add the following code:
```js
environment.loaders.append('html', {
  test: /\.html$/,
  use: [{
    loader: 'html-loader',
    options: {
      minimize: true,
      exportAsEs6Default: 'es6',
      removeAttributeQuotes: false,
      caseSensitive: true,
      customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
      customAttrAssign: [ /\)?\]?=/ ]
    }
  }]
})
```
* Restart your local server, reload the page, and it should work!

## Importing component SCSS

Now the last piece of the puzzle is using imported styles. The process for this should be very similar.

* `yarn add to-string-loader css-loader postcss-loader resolve-url-loader sass-loader`
* Create new file `javascript/hello_angular/app/app.component.scss`
* Add some distinct style like `h1 { color: red }`
* Create a new file `javascript/hello_angular/scss.d.ts` which should have the following contents:
```ts
declare module "*.scss" {
  const content: string;
  export default content;
}
```
* In app.component.ts, import your SCSS file like this:
```ts
import template from './app.component.html';
import styleString from './app.component.scss';

@Component({
  selector: 'hello-angular',
  template,
  styles: [styleString]
})
```
* In `webpack/environment.js`, add the following code:
```js
environment.loaders.insert('sass', {
  test: /\.scss$/,
  use: [
    { loader: 'to-string-loader' },
    { loader: 'css-loader' },
    { loader: 'postcss-loader' },
    { loader: 'resolve-url-loader' },
    { loader: 'sass-loader' },
  ]
})
```
* Restart your local server, reload the page, and it should work!

## Environment variables:

* Ruby version: 2.6.4
* Rails version: 6.0.0
* Angular version: 8.2.6
* core-js version: 2.5.7 (this is important because later versions cause a compile error)
