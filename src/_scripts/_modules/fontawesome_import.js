// const path = require('path')
console.log(FONTAWESOME_ENGINE)


const getFontAwesome = (local, engine, download) => {
  const fontawesome = (local && engine=='svg') ? (() => {
		// Adds all the icons from the Solid, Regular and Brands style into our library for easy lookup
		const fa = require('nodePath/@fortawesome/fontawesome').default;
		const solid = require('nodePath/@fortawesome/fontawesome-free-solid').default;
		const regular = require('nodePath/@fortawesome/fontawesome-free-regular').default;
		const brands = require('nodePath/@fortawesome/fontawesome-free-brands').default;
		fa.library.add(solid, regular, brands)
		// allow search pseudo elements in CSS (e.g. :after )
		fa.config['searchPseudoElements'] = true
		return fa
		})() : false

	return fontawesome
}

// Return a new instance of a Dummy plugin to use in conditional plugin syntax
exports.getCorrectFA = getFontAwesome(!FOR_WEB, FONTAWESOME_ENGINE, FONTAWESOME_DOWNLOAD)