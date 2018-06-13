Reveal.js powered by Webpack 4
==================

Reveal.js webpack-based build system:

* [Webpack](https://webpack.js.org) as a versatile build system setup. Serve your presentation and enjoy the Hot Module Reloading capabilities or just build your slide for production.
* [Babel](https://babeljs.io/) to enjoy the most up-to-date javascript syntax
* [Sass](http://sass-lang.com/) because CSS preprocessors are pretty useful and Reveal.js uses that one (enabling us to easily reuse or modify variables)

Come with lots of Reveal.js goodies:

* [Reveal.js-d3](https://github.com/gcalmettes/reveal.js-d3) for interactive figures embedding
* [Reveal_external](https://github.com/janschoepke/reveal_external) to load external files into your presentation and allow for nested slide loading
* [Reveal.js-menu](https://github.com/denehyg/reveal.js-menu) to have a very handy slideout menu and quickly jump to any slide by title
* [Font Awesome 5](https://fontawesome.com) to fully enjoy the brand new SVG-based framework (can choose CSS or SVG framework)
* [Mathjax](https://www.mathjax.org) for beautiful math in all browsers
* Modified Reveal.js [Math.js](https://github.com/gcalmettes/revealjs-webpack-sauce/blob/master/src/scripts/math-gc.js) file to allow more fragment kungfu moves in your Mathjax equations


Motivation?
----

I needed a robust system to build several presentations sharing a common library of slides without the hassle of copy-pasting and that was easily upgradable to the latest versions of the dependencies.

This way, everything stays separated, content (slides), tools (libraries) and configurations files (for the different tools). Just bump the version of any dependencies by doing `npm update` and rebuild your presentation(s). Done.

How?
----

```console
$ # Install deps
$ npm install
$ # Do an initial build
$ npm run build
$ # Launch the dev server with hot module replacement
$ npm live
```

Look at what the output tells you: There will a server be running (usually on http://localhost:9000) with your presentation. Any changes to the source files will trigger a reload of the presentation (you’ll stay on the current slide of course).

Configuration
-------------

At the top of the `webpack.config.js` file are some of the configurations that you can setup:

- Programming languages supported by `highlight.js` for code presention (reveal.js `<pre><code>` tags) in the slides (to minimize the bundle size, you have the possibility to only select only the languages that you are using in your presentation)
- Font Awesome Backend (css or svg).

Font Awesome Framework
----------------------
By choosing the `svg` framework, you'll have access to the [SVG with Javascript](https://fontawesome.com/how-to-use/svg-with-js) framework of [Font Awesome 5](https://fontawesome.com), and you'll be able to directly use the latest features directly in the slides (e.g.: see the [layering](https://fontawesome.com/how-to-use/svg-with-js#layering) or [power-transform](https://fontawesome.com/how-to-use/svg-with-js#power-transforms) new capabilities).

Only the needed icons will be included in the bundle (tree-shaking) and a js icons file per html file will be generated.

Note when Hot reloading is used:
--------------------------------
- HR can deal with files already present in the `dist` (built) folder. So make a build before (e.g.: `npm run dev-fa-svg`) before launching the dev-server to make sure all the files in your `src` folder have been transfered to the `build` folder.
- If FA svg framework is used in development mode, the tree-shaked js file created for each html entry won't be updated, so you'll need to rebuild to see the icons. (this won't happen if the css framework is used as all the icons will be accessible). 
- The same problem applies for the `external` plugin. You need to make sure the files are also in the build folder, since this is where your app will look for it, so rebuild.






