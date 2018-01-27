// loads the PDF print stylesheet if ?print-pdf is appended to the URL
export default (function loadPrintCSS() {
	const cssPrefix = 'lib/css'

	let link = document.createElement('link')
	link.rel = 'stylesheet'
	link.type = 'text/css'
	link.href = `${cssPrefix}/${window.location.search.match( /print-pdf/gi ) ? 'pdf' : 'paper'}.css`
	document.getElementsByTagName('head')[0].appendChild(link)
})()
