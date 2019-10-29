//==========================================
//======== MODIFICATION OF REVEAL MATHS.JS PLUGIN TO HAVE FRAGMENTS IN MATHJAX
//==========================================

// Mathjax config
MathJax = {
  loader: {
    load: ['[custom]/tex_fragments.min.js'],
    // load: ['[custom]/mml.min.js'],
    paths: {custom: 'lib/mathjax/tex-components'} // custom tex extensions
    // paths: {custom: 'lib/mathjax'} // custom tex extensions
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

// require('./../../node_modules/mathjax/es5/tex-mml-chtml.js')
// require('mathjax/es5/tex-mml-chtml.js')

require('mathjax-full/es5/tex-mml-chtml.js')

// const RevealMath = window.RevealMath || (function(){

  // // loadScript( options.mathjax + '?config=' + options.config, function() {
  // loadScript( options.mathjax, function() {
  //   console.log('2 ###########################')
  //   // console.log(Mathjax)

  //   // Typeset followed by an immediate reveal.js layout since
  //   // the typesetting process could affect slide height
  //   // MathJax.Hub.Queue( [ 'Typeset', MathJax.Hub ] );
  //   // MathJax.Hub.Queue( Reveal.layout );
  //   // Reveal.layout()

  //   //=====================================
  //   // Fragments in Mathjax equations
  //   // usage :
  //   // simple fragment appearing, e.g.: \fragment{1}{x_1}
  //   // apply style change to present fragment, e.g.: \fragapply{highlight-blue}{x_1}
  //   // add specific index to trigger style change for fragment: \fragindex{1}{\fragapply{highlight-blue}{x_1}}

  //   // MathJax.Hub.Register.StartupHook("TeX Jax Ready",function () {
  //   //   const TEX = MathJax.InputJax.TeX;

  //   //   TEX.Definitions.Add({macros: {
  //   //     'fragment': 'FRAGMENT_INDEX_attribute', // regular fragments
  //   //     'fragapply': 'FRAGMENT_apply', // style change to fragments
  //   //     'texclass': 'TEX_APPLY_class' // add any class to an element
  //   //   }}); 

  //   //   TEX.Parse.Augment({
  //   //     FRAGMENT_INDEX_attribute: function (name) {
  //   //       const index = this.GetArgument(name);
  //   //       const arg   = this.ParseArg(name);
  //   //       this.Push(arg.With({
  //   //         'class': 'fragment fragment-mjx',
  //   //         attrNames: ['data-fragment-index'],
  //   //         attr: {'data-fragment-index':index}
  //   //       }));
  //   //     },
  //   //     FRAGMENT_apply: function (name) {
  //   //       const input = this.GetArgument(name)
  //   //       let [apply_kind, index] = [...input.split(" ")];
  //   //       const arg   = this.ParseArg(name);
  //   //       if (index) {
  //   //         this.Push(arg.With({
  //   //           'class': 'fragapply fragment fragment-mjx ' + apply_kind,
  //   //           attrNames: ['data-fragment-index'],
  //   //           attr: {'data-fragment-index':index}
  //   //         }));
  //   //       } else {
  //   //         this.Push(arg.With({
  //   //           'class': 'fragapply fragment fragment-mjx ' + apply_kind
  //   //         }));
  //   //       }
  //   //     },
  //   //     TEX_APPLY_class: function (name) {
  //   //       const class_kind = this.GetArgument(name);
  //   //       const arg   = this.ParseArg(name);
  //   //       this.Push(arg.With({
  //   //          'class': class_kind
  //   //       }));
  //   //     }
  //   //   }); // TEX.parse.argument
  //   // }); // Mathjax.hub.register

  //   //===================================== END FRAGMENTS

  //   // Reprocess equations in slides when they turn visible
  //   Reveal.addEventListener( 'slidechanged', function( event ) {
  //     MathJax.Hub.Queue( [ 'Typeset', MathJax.Hub, event.currentSlide ] );

  //     // clean up false fragment created during Mathjax process
  //     const slide = event.currentSlide
  //     let slideFragments = Array.prototype.slice.call(slide.querySelectorAll( '.fragment-mjx' ))
  //     slideFragments = slideFragments.filter(d => d.nodeName !== "SPAN")
  //     for (let i=0; i<slideFragments.length; i++){
  //       slideFragments[i].classList.remove("fragment");
  //     }
      
  //   });
  // }); // loadscript


// })();
