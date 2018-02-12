//==========================================
//======== MODIFICATION OF REVEAL MATHS.JS PLUGIN TO HAVE FRAGMENTS IN MATHJAX
//==========================================

// // If Mathjax referenced locally
// import './../../node_modules/mathjax/MathJax.js'

const RevealMath = window.RevealMath || (function(){

  const options = {
    mathjax: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js',
    config: 'TeX-AMS_HTML-full'
  };

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
    // usage :
    // simple fragment appearing, e.g.: \fragment{1}{x_1}
    // apply style change to present fragment, e.g.: \fragapply{highlight-blue}{x_1}
    // add specific index to trigger style change for fragment: \fragindex{1}{\fragapply{highlight-blue}{x_1}}

    MathJax.Hub.Register.StartupHook("TeX Jax Ready",function () {
      const TEX = MathJax.InputJax.TeX;

      TEX.Definitions.Add({macros: {
        'fragment': 'FRAGMENT_INDEX_attribute', // regular fragments
        'fragapply': 'FRAGMENT_apply', // style change to fragments
        'texclass': 'TEX_APPLY_class' // add any class to an element
      }}); 

      TEX.Parse.Augment({
        FRAGMENT_INDEX_attribute: function (name) {
          const index = this.GetArgument(name);
          const arg   = this.ParseArg(name);
          this.Push(arg.With({
            'class': 'fragment fragment-mjx',
            attrNames: ['data-fragment-index'],
            attr: {'data-fragment-index':index}
          }));
        },
        FRAGMENT_apply: function (name) {
          const input = this.GetArgument(name)
          let [apply_kind, index] = [...input.split(" ")];
          const arg   = this.ParseArg(name);
          if (index) {
            this.Push(arg.With({
              'class': 'fragapply fragment fragment-mjx ' + apply_kind,
              attrNames: ['data-fragment-index'],
              attr: {'data-fragment-index':index}
            }));
          } else {
            this.Push(arg.With({
              'class': 'fragapply fragment fragment-mjx ' + apply_kind
            }));
          }
        },
        TEX_APPLY_class: function (name) {
          const class_kind = this.GetArgument(name);
          const arg   = this.ParseArg(name);
          this.Push(arg.With({
             'class': class_kind
          }));
        }
      }); // TEX.parse.argument
    }); // Mathjax.hub.register

    //===================================== END FRAGMENTS

    // Reprocess equations in slides when they turn visible
    Reveal.addEventListener( 'slidechanged', function( event ) {
      MathJax.Hub.Queue( [ 'Typeset', MathJax.Hub, event.currentSlide ] );

      // clean up false fragment created during Mathjax process
      const slide = event.currentSlide
      let slideFragments = Array.prototype.slice.call(slide.querySelectorAll( '.fragment-mjx' ))
      slideFragments = slideFragments.filter(d => d.nodeName !== "SPAN")
      for (let i=0; i<slideFragments.length; i++){
        slideFragments[i].classList.remove("fragment");
      }
      
    });
  }); // loadscript

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
