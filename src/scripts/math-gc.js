//==========================================
//======== MODIFICATION OF REVEAL MATHS.JS PLUGIN TO HAVE FRAGMENTS IN MATHJAX
//==========================================
import Reveal from 'reveal.js/js/reveal.js'


const RevealMath = window.RevealMath || (function(){

  const options = Reveal.getConfig().math || {};
  options.mathjax = options.mathjax || 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js';
  // options.mathjax = options.mathjax || 'js/reveal.js-dependencies/MathJax.js';
  options.config = options.config || 'TeX-AMS_HTML-full';

  loadScript( options.mathjax + '?config=' + options.config, function() {

    MathJax.Hub.Config({
      messageStyle: 'none',
      tex2jax: {
        inlineMath: [['$','$'],['\\(','\\)']] ,
        skipTags: ['script','noscript','style','textarea','pre']
      },
      skipStartupTypeset: true
    });

    // Typeset followed by an immediate reveal.js layout since
    // the typesetting process could affect slide height
    MathJax.Hub.Queue( [ 'Typeset', MathJax.Hub ] );
    MathJax.Hub.Queue( Reveal.layout );

    //=====================================
    // Fragments in Mathjax equations
    // usage \fragment{1}{x_1} and \fraglight{highlight-blue}{x_1}
    // and \fragindex{1}{\fraglight{highlight-blue}{x_1}}

        MathJax.Hub.Register.StartupHook("TeX Jax Ready",function () {
            const TEX = MathJax.InputJax.TeX;

            TEX.Definitions.Add({macros: {'fragment': 'FRAGMENT_INDEX_attribute'}}); // regular fragments
            TEX.Definitions.Add({macros: {'fraglight': 'FRAGMENT_highlight'}}); // highlighted fragments
            TEX.Definitions.Add({macros: {'fragindex': 'FRAGMENT_add_INDEX'}}); // add fragment index to highlighted fragments
            TEX.Definitions.Add({macros: {'texclass': 'TEX_APPLY_class'}}); // add fragment index to highlighted fragments

            TEX.Parse.Augment({
              FRAGMENT_INDEX_attribute: function (name) {
                  const index = this.GetArgument(name);
                  const arg   = this.ParseArg(name);
                  this.Push(arg.With({
                     'class': 'fragment',
                     attrNames: ['data-fragment-index'],
                     attr: {'data-fragment-index':index}
                  }));
              },
              FRAGMENT_highlight: function (name) {
                  const highlight_kind = this.GetArgument(name);
                  const arg   = this.ParseArg(name);
                  this.Push(arg.With({
                     'class': 'fragment ' + highlight_kind
                  }));
              },
              FRAGMENT_add_INDEX: function (name) {
                  const index = this.GetArgument(name);
                  const arg   = this.ParseArg(name);
                  this.Push(arg.With({
                     attrNames: ['data-fragment-index'],
                     attr: {'data-fragment-index':index}
                  }));
              },
              TEX_APPLY_class: function (name) {
                  const class_kind = this.GetArgument(name);
                  const arg   = this.ParseArg(name);
                  this.Push(arg.With({
                     'class': class_kind
                  }));
              }
            });
        });

    //=====================================

    // Reprocess equations in slides when they turn visible
    Reveal.addEventListener( 'slidechanged', function( event ) {
      MathJax.Hub.Queue( [ 'Typeset', MathJax.Hub, event.currentSlide ] );
    } );
  });

  function loadScript( url, callback ) {

    const head = document.querySelector( 'head' );
    const script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.src = url;

    // Wrapper for callback to make sure it only fires once
    const finish = function() {
      if( typeof callback === 'function' ) {
        callback.call();
        callback = null;
      }
    }

    script.onload = finish;

    // IE
    script.onreadystatechange = function() {
      if ( this.readyState === 'loaded' ) {
        finish();
      }
    }

    // Normal browsers
    head.appendChild( script );

  }

})();
