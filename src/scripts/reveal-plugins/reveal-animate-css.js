
// From Alexandre Decan (https://github.com/hakimel/reveal.js/issues/833#issuecomment-272697592)
// CSS animations in Reveal (custom or Animate.css)

const RevealAnimate = window.RevealAnimate || (function(){

/* Animations */
$.fn.findExclude = function( selector, mask, result ) {
  // http://stackoverflow.com/questions/13305514/jquery-find-children-until-a-certain-threshold-element-is-encountered
  var result = typeof result !== 'undefined' ? result : new jQuery();
  this.children().each( function(){
      var thisObject = jQuery( this );
      if( thisObject.is( selector ) && !thisObject.is( mask )) 
          result.push( this );
      if( !thisObject.is( mask ) )
          thisObject.findExclude( selector, mask, result );
  });
  return result;
}

$.fn.alterClass = function (classes, invert) {
  var invert = typeof invert !== 'undefined' ? invert : false;
  
  // alterClass("a +b -c") adds a and b, remove c.
  var classToAdd = new Array();
  var classToRemove = new Array();
  
  classes.split(' ').forEach(function (item) {
    if (item.charAt(0) == '-')
      classToRemove.push(item.substr(1));
    else {
      if (item.charAt(0) == '+')
        classToAdd.push(item.substr(1));
      else
        classToAdd.push(item);
    }
  });
  
  if (invert) { 
    this.addClass(classToRemove.join(' '));
    this.removeClass(classToAdd.join(' '));
  } else {
    this.addClass(classToAdd.join(' '));
    this.removeClass(classToRemove.join(' '));
  }
  return this;
}


Reveal.addEventListener('ready', function ( event ) {
  if (window.location.search.match( /print-pdf/gi )) {
    // Set final classes in case of printing
    $(document).find('*[data-animate]').each(function () {
      $(this).alterClass($(this).attr('data-animate')); 
    });
  } else {
    // Set animation delay if data-delay is specified
    $('*[data-delay]').each( function () { 
      var delay = $(this).attr("data-delay");
      $(this).css("-webkit-animation-delay", delay+"s"); 
      $(this).css("animation-delay", delay+"s"); 
      
      $(this).css("-webkit-transition-delay", delay+"s"); 
      $(this).css("transition-delay", delay+"s"); 
    });
    
    // Set animation duration if data-duration is specified
    $('*[data-duration]').each( function () { 
      var duration = $(this).attr("data-duration");
      $(this).css("-webkit-animation-duration", duration+"s"); 
      $(this).css("animation-duration", duration+"s"); 
      
      $(this).css("-webkit-transition-duration", duration+"s"); 
      $(this).css("transition-duration", duration+"s"); 
    });
  }
});


// Animate items that are not in a fragment
Reveal.addEventListener('slidechanged', function( event ) {
  // Animate elements that are not a fragment (or in a fragment)
  var filter = '*[data-animate]:not(.fragment):not(.fragment *)';

  $(event.currentSlide).find(filter).each( function () {
    $(this).addClass('animated');
    $(this).alterClass($(this).attr('data-animate'));
  });		
  $(event.previousSlide).find(filter).each( function () {
    $(this).removeClass('animated');
    $(this).alterClass($(this).attr('data-animate'), true);
  });		
});

// Animate fragments
Reveal.addEventListener('fragmentshown', function( event ) {
  $(event.fragments).each(function () { 
    $(this).findExclude('*', '.fragment').add(this).each(function () {
      if ($(this).attr('data-animate')) {
        $(this).addClass('animated');
        $(this).alterClass($(this).attr('data-animate'));
      }
    });
  });
});

// Make the animation runnable again if fragment is hidden
Reveal.addEventListener('fragmenthidden', function( event ) {	  
  $(event.fragments).each(function () { 
    $(this).findExclude('*', '.fragment').add(this).each(function () {
      if ($(this).attr('data-animate')) {
        $(this).removeClass('animated');
        $(this).alterClass($(this).attr('data-animate'), true);
      }
    });
  });
});

})();
