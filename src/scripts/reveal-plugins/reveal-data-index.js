// From Alexandre Decan
/* Fragment numbering using data-index */
const fragmentNumbering = function ( event ) {
  const fragments = $(event.currentSlide).find('.fragment');
  const order = new Array(fragments.length);
  
  $(fragments).filter('[data-index]').each( function () { 
    const index = parseInt($(this).attr('data-index')) - 1;
    if (index < 0 || index >= order.length) {
      alert(`Invalid data-index: ${index}`);
      return;
    }
    if (typeof order[index] == 'undefined') {
      order[index] = [ $(this) ];
    } else {
      order[index].push($(this));
    }
  });
  
  let index = 0;
  $(fragments).not('[data-index]').each( function () {
    while(typeof order[index] != 'undefined') {
      index = index + 1;
    }
    order[index] = [ $(this) ];
  });
  
  $(order).each( function (index) {
    $(this).each( function () { 
      $(this).attr('data-fragment-index', index);
    })
  });
};
Reveal.addEventListener('ready', fragmentNumbering);
Reveal.addEventListener('slidechanged', fragmentNumbering);