const isIE = navigator.appVersion.indexOf("MSIE")!==-1;
const Utils = {
  hasClass( elem, classname ) {
    let reg = new RegExp( "(^|\\s+)" + classname + "(\\s+|$)" );

    return elem && reg.test( elem.className );
  },

  addClass( elem, classname ) {
    if( elem && !this.hasClass( elem, classname ) ) {
      elem.className += " " + classname;
    }
  },

  removeClass( elem, classname ) {
    let reg = new RegExp( "(^|\\s+)" + classname + "(\\s+|$)" );

    elem && ( elem.className = elem.className.replace( reg, " " ) );
  },

  toggleClass( elem, classname ) {
    let fn = this.hasClass( elem, classname ) ? "remove" : "add";

    this[ fn + "Class" ]( elem, classname );
  },

  // Shallow object extend
  extend( obj ) {
    Array.prototype.slice.call( arguments, 1 ).forEach( function( source ) {
      if ( source ) {
        for ( let prop in source ) obj[ prop ] = source[ prop ];
      }
    });

    return obj;
  },

  // Returns the top and left offset of an element
  offset( elem ) {
    let box = elem.getBoundingClientRect() || { top: 0, left: 0 };
    let docElem = document.documentElement;
    let offsetTop = isIE ? docElem.scrollTop : window.pageYOffset;
    let offsetLeft = isIE ? docElem.scrollLeft : window.pageXOffset;

    return {
      top: box.top + offsetTop - docElem.clientTop,
      left: box.left + offsetLeft - docElem.clientLeft
    };
  },

  // Returns the top and left position of an element relative to an ancestor
  position( elem, relative ) {
    let pos = { top: 0, left: 0 };

    while ( elem && elem !== relative ) {
      pos.top += elem.offsetTop;
      pos.left += elem.offsetLeft;
      elem = elem.parentNode;
    }

    return pos;
  },

  // Returns the closest ancestor element of the child or false if not found
  closest( child, ancestor ) {
    while ( child ) {
      if ( child === ancestor ) { return child; }
      child = child.parentNode;
    }

    return false;
  },

  // Creates a DOM node with the specified attributes
  create( name, attrs ) {
    let a;
    let node = document.createElement( name );

    if ( !attrs ) { attrs = {}; }

    for ( a in attrs ) {
      if ( attrs.hasOwnProperty( a ) ) {
        if ( a === "innerHTML" ) {
          node.innerHTML = attrs[ a ];
        } else {
          node.setAttribute( a, attrs[ a ] );
        }
      }
    }

    return node;
  },

  deferred( fn ) {
    return function() {
      window.setTimeout(() => {
        fn.apply(this, arguments);
      }, 1);
    };
  }
};

export default Utils;
