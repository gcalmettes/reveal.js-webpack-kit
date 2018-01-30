// START CUSTOM REVEAL.JS INTEGRATION
(function() {
  // Function to perform a better "data-trim" on code snippets
  // Will slice an indentation amount on each line of the snippet (amount based on the line having the lowest indentation length)
  function betterTrim(snippetEl) {
    // Helper functions
    function trimLeft(val) {
      // Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
      return val.replace(/^[\s\uFEFF\xA0]+/g, '');
    }
    function trimLineBreaks(input) {
      var lines = input.split('\n');

      // Trim line-breaks from the beginning
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '') {
          lines.splice(i--, 1);
        } else break;
      }

      // Trim line-breaks from the end
      for (var i = lines.length-1; i >= 0; i--) {
        if (lines[i].trim() === '') {
          lines.splice(i, 1);
        } else break;
      }

      return lines.join('\n');
    }

    // Main function for betterTrim()
    return (function(snippetEl) {
      var content = trimLineBreaks(snippetEl.innerHTML);
      var lines = content.split('\n');
      // Calculate the minimum amount to remove on each line start of the snippet (can be 0)
      var pad = lines.reduce(function(acc, line) {
        if (line.length > 0 && trimLeft(line).length > 0 && acc > line.length - trimLeft(line).length) {
          return line.length - trimLeft(line).length;
        }
        return acc;
      }, Number.POSITIVE_INFINITY);
      // Slice each line with this amount
      return lines.map(function(line, index) {
        return line.slice(pad);
      })
      .join('\n');
    })(snippetEl);
  }

  if( typeof window.addEventListener === 'function' ) {
    var hljs_nodes = document.querySelectorAll( 'pre code' );

    for( var i = 0, len = hljs_nodes.length; i < len; i++ ) {
      var element = hljs_nodes[i];

      // trim whitespace if data-trim attribute is present
      if( element.hasAttribute( 'data-trim' ) && typeof element.innerHTML.trim === 'function' ) {
        element.innerHTML = betterTrim(element);
      }

      // Now escape html unless prevented by author
      if( ! element.hasAttribute( 'data-noescape' )) {
        element.innerHTML = element.innerHTML.replace(/</g,"&lt;").replace(/>/g,"&gt;");
      }

      // re-highlight when focus is lost (for edited code)
      element.addEventListener( 'focusout', function( event ) {
        hljs.highlightBlock( event.currentTarget );
      }, false );
    }
  }
})();
// END CUSTOM REVEAL.JS INTEGRATION