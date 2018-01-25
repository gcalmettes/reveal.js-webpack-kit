///////////////////////////
// JS IMPORTS
//////////////////////////

// Reveal library and specific config
import './reveal-config.js';

// Import FontAwesome: https://fontawesome.com/how-to-use/use-with-node-js
import fontawesome from './../../node_modules/@fortawesome/fontawesome'

// It's better to import icons individually to keep bundle size down but we'll
// load entire styles to have access to all the icons
import solid from './../../node_modules/@fortawesome/fontawesome-free-solid';
import regular from './../../node_modules/@fortawesome/fontawesome-free-regular';
import brands from './../../node_modules/@fortawesome/fontawesome-free-brands';
fontawesome.library.add(solid, regular, brands)

// // If Mathjax referenced locally
// import './../../node_modules/mathjax/MathJax.js'


/////////////////////////
// STYLE IMPORTS
////////////////////////

// Reveal js styles and theme
import './../styles/main.scss';

// custom css to handle inline svg of new FontAwesome 5 in Reveal.js menu plugin
import './../styles/menu-inline-svg.css';
