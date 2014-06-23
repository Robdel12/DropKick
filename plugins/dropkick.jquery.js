jQuery.fn.dropkick = function () {
  var args = Array.prototype.slice.call( arguments );
  return $( this ).each(function() {
    if ( !args[0] || typeof args[0] === 'object' ) {
      new Dropkick( this, args[0] || {} );
    } else if ( typeof args[0] === 'string' ) {
      Dropkick.prototype[ args[0] ].apply( new Dropkick( this ), args.slice( 1 ) );
    }
  });
};
