jQuery.fn.dropkick = function ( opts, args ) {
  return $( this ).each(function() {
    if ( !opts || typeof opts === 'object' ) {
      new Dropkick( this, opts || {} );
    } else if ( typeof opts === 'string' ) {
      new Dropkick( this )[ opts ]( args );
    }
  });
};