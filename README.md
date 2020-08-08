Reveal.js powered by Webpack 4
==================

Reveal.js webpack-based build system:

* [Webpack](https://webpack.js.org) as a versatile build system setup. Serve your presentation(s) and enjoy the Hot Module Reloading capabilities or just build your slides for production. Multiple entry points (HTML files) are accepted!
* [Babel](https://babeljs.io/) to enjoy the most up-to-date javascript syntax
* [Sass](http://sass-lang.com/) because CSS preprocessors are pretty useful and Reveal.js uses that one (enabling us to easily reuse or modify variables)

Come with lots of Reveal.js goodies:

* [Reveal.js-d3](https://github.com/gcalmettes/reveal.js-d3) for interactive figures embedding
* [Reveal_external](https://github.com/janschoepke/reveal_external) to load external files into your presentation and allow for nested slide loading
* [Reveal.js-menu](https://github.com/denehyg/reveal.js-menu) to have a very handy slideout menu and quickly jump to any slide by title.
* [Font Awesome 5](https://fontawesome.com) to fully enjoy the brand new SVG-based framework (built-in option to choose between the CSS or SVG framework)
* [Mathjax](https://www.mathjax.org) for beautiful math in all browsers
* Modified Reveal.js [Math.js](https://github.com/gcalmettes/reveal.js-webpack-kit/blob/master/src/_scripts/reveal-plugins/math-gc.js) file to allow customized fragment events in your Mathjax equations (see below)


Motivation?
----

I needed a robust system to build several presentations sharing a common library of slides (to develop a class) without the hassle of copy-pasting. I wanted a system that was easily upgradable to the latest versions of the dependencies.

This way, everything stays separated, content (slides), tools (libraries) and configurations files (for the different tools). Just bump the version of any dependencies by doing `yarn upgrade` and rebuild your presentation(s). Done.

How?
----

Download this repository, go in it and then:

```console
$ # Install dependencies
$ yarn install
$ # Do an initial build with the Font Awesome framework of your choice
$ yarn dev-fa-svg
$ # Launch the dev server with hot module replacement
$ yarn live-fa-svg
```

Look at what the output tells you: There will a server be running (usually on http://localhost:9000) with your presentation. Any changes to the source files will trigger a reload of the presentation (you’ll stay on the current slide of course).

Work in the `src` folder!

Configuration
-------------

# Font Awesome Framework

The project has been build to work with the [Font Awesome 5](https://fontawesome.com). You can choose between:
- the new [SVG with Javascript](https://fontawesome.com/how-to-use/svg-with-js) framework and enjoy the latest features (e.g.: [layering](https://fontawesome.com/how-to-use/svg-with-js#layering) or [power-transform](https://fontawesome.com/how-to-use/svg-with-js#power-transforms) new capabilities).
- the well established [Webfonts with CSS](https://fontawesome.com/how-to-use/web-fonts-with-css) framework.

Note that when the SVG framework is selected, every html files will be scanned and only the icons used will be included in the final bundle (tree-shaking).
The `svg` and `css` frameworks can be called directly using the yarn run-script command (see below).
 
# Dev-server, development-build and production-build

Unminified files will be generated for the developent builds. Minification of the files will be done in all the production build (but building time will be increased, especially if the Font Awesome SVG framework is used). All the build will be generated in the `dist` folder

```console

$ # Development build, font awesome css framework
$ yarn dev-fa-css

$ # Development build, font awesome svg framework
$ yarn dev-fa-svg

$ # Production build, font awesome css framework
$ yarn build-fa-css

$ # Production build, font awesome svg framework
$ yarn build-fa-svg

$ # Launch the dev-server with hot module replacement with font awesome css framework
$ yarn live-fa-css

$ # Launch the dev-server with hot module replacement with font awesome svg framework
$ yarn live-fa-svg
```

Note when Hot Module Replacement is used (dev-server):
- HMR can deal with files already present in the `dist` (built) folder. So make a build (e.g.: `yarn dev-fa-svg`) before launching the dev-server to make sure all the files in your `src` folder have been transfered to the `build` folder.
- If FA svg framework is used in development mode, the tree-shaked js file created for each html entry won't be updated, so you'll need to rebuild to see the icons. (this won't happen if the css framework is used since all the icons will be accessible via the webfonts). 
- The same applies if you're using the `reveal-external` plugin (the dev-server search the file in the `dist` folder, not the `src`). You need to make sure the files are also in the build folder, since this is where your app will look for it, so rebuild.

# Programming languages supported for code presentation

At the top of the `webpack.config.js` file are some of the configurations that you can setup, in particular you can select the programming languages supported by `highlight.js` for code presention (reveal.js `<pre><code>` tags) in the slides. To minimize the bundle size, you have the possibility to only include the languages that you are using in your presentation(s).


Project structure
-----------------

Below is an overview of the project structure:

```
reveal.js-webpack-kit/
├── presentation1.html                          # your different slide decks
├── presentation2.html
├── presentation3.html
├── src/
|   ├── _scripts/
|   |      ├── reveal-config.js                 # configuration for reveal
|   |      └── reveal-dependencies-config.js    # configuration for the plugins
│   ├── _styles/
|   |      └── *.scss                           # all the style files
|   └── content/                                # any content that you refer 
|                                               # in your slides (img, etc ...)
|
├── dist/                   # where your builded slides will be
|
└── webpack.config.js       # some configuration for the build can be tweaked 

```








