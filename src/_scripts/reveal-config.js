////////////////////////////
// Reveal.js initialization
///////////////////////////

/* Register only the selected languages (defined in webpack.config.js) 
   in highlight.js and initialize highlight.js when Reveal itself initialize
   (see intialization step at the end of Reveal.initialize) */
import hljs from 'nodePath/highlight.js/lib/highlight.js';
Object.keys(HIGHLIGHT_LANGUAGES).forEach(key => {
  let languageName = HIGHLIGHT_LANGUAGES[key]

  // Using require() here because import() support hasn't landed in Webpack yet
  const languageModule = require(`highlight.js/lib/languages/${languageName}`);
  hljs.registerLanguage(languageName, languageModule);
});

document.addEventListener('DOMContentLoaded', (event) => {
  window.Reveal = Reveal // plugins need that

  Reveal.initialize({
    width: 960,
    height: 700,
    // margin: 0.05, // Factor of the display size that should remain empty around the content
    controls: false, // Display controls in the bottom right corner
    progress: true, // Display a presentation progress bar
    slideNumber: false, // Display the page number of the current slide
    history: true, // Push each slide change to the browser history
    keyboard: true, // Enable keyboard shortcuts for navigation
    center: false, // Vertical centering of slide
    overview: true,
    transition: 'slide', // Transition style: none/fade/slide/convex/concave/zoom
    transitionSpeed: 'default', // Transition speed: default/fast/slow

    keyboard: {
      80: function() {
        if (! window.location.search.match( /print-pdf/gi )) {
          var uri = window.location.toString().split("#")
          window.location.replace(uri[0] + "?print-pdf");
        }
      }
    }
  });

  // callback function needed for syntax highlithging to work
  hljs.initHighlightingOnLoad()

})
