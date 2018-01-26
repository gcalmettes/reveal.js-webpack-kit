////////////////////////////
// Reveal.js and extensions
///////////////////////////

// import head from 'reveal.js/lib/js/head.min'


///////////////////////////
// initialization
//////////////////////////

import hljs from './../../node_modules/highlight.js/lib/index.js'


// const dependencyPath = 'js/reveal.js-dependencies/';

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