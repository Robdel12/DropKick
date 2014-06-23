jQuery.fn.dropkick = function ( opts ) {
  return $( this ).each(function() {
    var dk;

    if ( !opts || typeof opts === 'object' ) {
      new Dropkick( this, opts || {} );
    } else if ( typeof opts === 'string' ) {
      dk = new Dropkick( this );
      dk[ opts ].apply( dk, Array.prototype.slice.call( arguments, 1 ) );
    }
  });
};
