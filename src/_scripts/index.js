///////////////////////////
// JS IMPORTS
//////////////////////////

/* Reveal config and plugins */
import './reveal-dependencies-config.js' // need config before importing plugins
import './reveal-dependencies.js'
import './reveal-config.js';

/////////////////////////
// STYLE IMPORTS
////////////////////////

// Reveal js styles and theme
import 'stylesPath/main.scss';


if (FA_CSS) {
	require('stylesPath/_font-awesome-imports.scss')
}


