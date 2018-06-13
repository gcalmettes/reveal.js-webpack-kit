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
* [Font Awesome 5](https://fontawesome.com) to fully enjoy the brand new SVG-based framework
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
$ npm run-script build
$ # Launch the dev server with hot module replacement
$ npm start
```

Look at what the output tells you: There will a server be running (usually on http://localhost:9000) with your presentation. Any changes to the source files will trigger a reload of the presentation (you’ll stay on the current slide of course).

Configuration
-------------

At the top of the `webpack.config.js` file are some of the configurations that you can setup:

- Programming languages supported by `highlight.js` for code presention (reveal.js `<pre><code>` tags) in the slides (to minimize the bundle size, you can only select only the languages that you are using in your presentation)
- Font Awesome Backend (css or svg). Note that performance (slide transitions, etc ) can be reduced if svg used.





