///////////////////////////
// JS IMPORTS
//////////////////////////

// Reveal config and plugins
import './reveal-dependencies-config.js' // need config before importing plugins
import './reveal-dependencies.js'
import './reveal-config.js';

let fontawesome
if (!FOR_WEB) {
	// Import FontAwesome: https://fontawesome.com/how-to-use/use-with-node-js
	// import fontawesome from './../../node_modules/@fortawesome/fontawesome';
	// import solid from './../../node_modules/@fortawesome/fontawesome-free-solid';
	// import regular from './../../node_modules/@fortawesome/fontawesome-free-regular';
	// import brands from './../../node_modules/@fortawesome/fontawesome-free-brands';

	fontawesome = require('./../../node_modules/@fortawesome/fontawesome').default;
	const solid = require('./../../node_modules/@fortawesome/fontawesome-free-solid').default;
	const regular = require('./../../node_modules/@fortawesome/fontawesome-free-regular').default;
	const brands = require('./../../node_modules/@fortawesome/fontawesome-free-brands').default;

	fontawesome.library.add(solid, regular, brands)
	
	// allow search pseudo elements in CSS (e.g. :after )
	fontawesome.config['searchPseudoElements'] = true
}

console.log(PRODUCTION)
console.log(ALL_LOCAL)
console.log(FOR_WEB)


/////////////////////////
// STYLE IMPORTS
////////////////////////

// Reveal js styles and theme
import './../styles/main.scss';
