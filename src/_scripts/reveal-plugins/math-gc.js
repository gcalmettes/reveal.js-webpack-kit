//==========================================
//======== Use MathJax V3 and custom tex extension to get fragments in math equations
//==========================================

// Mathjax config
MathJax = {
  loader: {
    load: ['[custom]/tex_fragments.min.js'],
    paths: {custom: 'lib/mathjax/tex-components'} // custom tex extensions
  },
  tex: {
    inlineMath: [['$','$'],['\\(','\\)']],
    packages: {
      '[+]': ['tex_fragments'] // tex_fragments
    } // custom extension
  },
  options: {
    skipHtmlTags: ['script','noscript','style','textarea','pre']
  },
  startup: {
    typeset: true
  },
  chtml: {
    scale: 1,                      // global scaling factor for all expressions
    minScale: .5,                  // smallest scaling factor to use
    matchFontHeight: true,         // true to match ex-height of surrounding font
    mtextInheritFont: false,       // true to make mtext elements use surrounding font
    merrorInheritFont: true,       // true to make merror text use surrounding font
    mathmlSpacing: false,          // true for MathML spacing rules, false for TeX rules
    skipAttributes: {},            // RFDa and other attributes NOT to copy to the output
    exFactor: .5,                  // default size of ex in em units
    displayAlign: 'center',        // default for indentalign when set to 'auto'
    displayIndent: '0',            // default for indentshift when set to 'auto'
    fontURL: 'lib/mathjax/chtml/fonts/woff-v2',   // The URL where the fonts are found
    adaptiveCSS: true              // true means only produce CSS that is used in the process
  }
};


// require('mathjax-full/es5/tex-mml-chtml.js')
// require('mathjax-full/es5/tex-chtml-full.js') // when Mathjax will be updated
require('./tex-chtml-full.js')

