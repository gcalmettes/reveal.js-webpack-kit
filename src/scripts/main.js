///////////////////////////
// JS IMPORTS
//////////////////////////

// Reveal config and plugins
import './reveal-dependencies-config.js' // need config before importing plugins
import './reveal-dependencies.js'
import './reveal-config.js';

// Bundle Font Awesome svg with JS framework if not FOR_WEB
const fontawesome = (!FOR_WEB) ? (() => {
	// Adds all the icons from the Solid, Regular and Brands style into our library for easy lookup
	const fa = require('./../../node_modules/@fortawesome/fontawesome').default;
	const solid = require('./../../node_modules/@fortawesome/fontawesome-free-solid').default;
	const regular = require('./../../node_modules/@fortawesome/fontawesome-free-regular').default;
	const brands = require('./../../node_modules/@fortawesome/fontawesome-free-brands').default;
	fa.library.add(solid, regular, brands)
	// allow search pseudo elements in CSS (e.g. :after )
	fa.config['searchPseudoElements'] = true
	return fa
	})() : false

/////////////////////////
// STYLE IMPORTS
////////////////////////

// Reveal js styles and theme
import './../styles/main.scss';
