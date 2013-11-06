// Enable some stuff for IE 8
(function(){Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){var c,e,d=b?b:0;if(!this)throw new TypeError;if(e=this.length,0===e||d>=e)return-1;for(0>d&&(d=e-Math.abs(d)),c=d;e>c;c++)if(this[c]===a)return c;return-1});if(Event.prototype.preventDefault||(Event.prototype.preventDefault=function(){this.returnValue=!1}),Event.prototype.stopPropagation||(Event.prototype.stopPropagation=function(){this.cancelBubble=!0}),!Element.prototype.addEventListener){var a=[],b=function(b,c){var d=this,e=function(a){a.target=a.srcElement,a.currentTarget=d,c.handleEvent?c.handleEvent(a):c.call(d,a)};if("DOMContentLoaded"==b){var f=function(a){"complete"==document.readyState&&e(a)};if(document.attachEvent("onreadystatechange",f),a.push({object:this,type:b,listener:c,wrapper:f}),"complete"==document.readyState){var g=new Event;g.srcElement=window,f(g)}}else this.attachEvent("on"+b,e),a.push({object:this,type:b,listener:c,wrapper:e})},c=function(b,c){for(var d=0;d<a.length;){var e=a[d];if(e.object==this&&e.type==b&&e.listener==c){"DOMContentLoaded"==b?this.detachEvent("onreadystatechange",e.wrapper):this.detachEvent("on"+b,e.wrapper);break}++d}};Element.prototype.addEventListener=b,Element.prototype.removeEventListener=c,HTMLDocument&&(HTMLDocument.prototype.addEventListener=b,HTMLDocument.prototype.removeEventListener=c),Window&&(Window.prototype.addEventListener=b,Window.prototype.removeEventListener=c)}})();

(function( window, document, undefined ) {

var

  // Cache of DK Objects
  dkCache = [],

  // The Dropkick Object
  Dropkick = function( sel, opts ) {
    var i;

    if ( this === window ) {
      return new Dropkick( sel, opts );
    }

    for ( i = 0; i < dkCache.length; i++ ) {
      if ( dkCache[ i ].data.select == sel ) {
        utils.extend( dkCache[ i ].data.settings, opts );
        return dkCache[ i ];
      }
    }

    if ( sel.nodeName === "SELECT" ) {
      return this.init( sel, opts );
    }
  },

  noop = function() {},

  // DK default options
  defaults = {
    initialize: noop,
    change: noop
  },

  // Default Templates
  tmpl = {

    // The select template
    // The original select element is passed
    select: [
      '<div class="dk-select',
      '<%=( select.multiple ? "-multi" : "" )%> ',
      '<%=( select.className )%>" ',
      '<%=( select.id ? "id=\'dk-" + select.id + "\'" : "" )%> ',
      'tabindex="0">',
        '<% if ( !select.multiple ) { %>',
          '<div class="dk-selected">',
            '<%= select.options[ select.selectedIndex ].text %>',
          '</div>',
        '<% } %>',
        '<ul class="dk-select-options">',
          '<%=( options )%>',
        '</ul>',
      '</div>'
    ].join(""),

    // The optgroup template
    // An HTML string containing any sub-options is passed
    optgroup: [
      '<li class="dk-optgroup">',
        '<ul class="dk-optgroup-options">',
          '<%=( options )%>',
        '</ul>',
      '</li>'
    ].join(""),

    // The option template
    // The original option element is passed
    option: [
      '<li class="dk-option ',
      '<%=( option.className )%>',
      '<%=( option.selected ? " dk-option-selected" : "")%>',
      '<%=( option.disabled ? " dk-option-disabled" : "")%>" ',
      'data-value="<%=( option.value )%>">',
        '<%=( option.text )%>',
      '</li>'
    ].join("")
  },

  // Common Utilities
  utils = {

    hasClass: function( elem, classname ) {
      var reg = new RegExp( "(^|\\s+)" + classname + "(\\s+|$)" ); 
      return reg.test( elem.className );
    },

    addClass: function( elem, classname ) {
      if( !utils.hasClass( elem, classname ) ) { 
        elem.className += " " + classname; 
      }
    },

    removeClass: function( elem, classname ) {
      var reg = new RegExp( "(^|\\s+)" + classname + "(\\s+|$)" );
      elem.className = elem.className.replace( reg, " " );
    },

    toggleClass: function( elem, classname ) {
      var fn = utils.hasClass( elem, classname ) ? "remove" : "add";
      utils[ fn + "Class" ]( elem, classname );
    },

    // jQuery-like extend
    extend: function() {
      var p, options, i,
        target = arguments[ 0 ];

      for ( i = 1; i < arguments.length; i++ ) {
        options = arguments[ i ];
        for ( p in options ) {
          if ( options.hasOwnProperty( p ) ) {
            try {
              if ( options[ p ].constructor == Object ) {
                target[ p ] = utils.extend( target[ p ], options[ p ] );
              } else {
                target[ p ] = options[ p ];
              }
            } catch( e ) {
              target[ p ] = options[ p ];
            }
          }
        }
      }

      return target;
    },

    // Modified John Resig's Micro-Templating
    tmpl: function( str, data ) {
      var fn = new Function( "obj",
        "p=[]; with(obj){p.push('" +
        str.replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'") +
        "')} return p.join('')");
      return data ? fn( data ) : fn;
    },

    // Converts an HTML string to a single DOM node
    parseHTML: function( html ) {
      var tmp = document.createElement( "div" );
      tmp.innerHTML = html;
      return tmp.lastChild;
    },

    // Finds all DK options in the DK element
    findOptions: function( elems ) {
      var el, i,
        options = [];

      for ( i = 0; i < elems.length; i++ ) {
        el = elems[ i ];
        if ( utils.hasClass( el, "dk-option" ) ) {
          options.push( el );
        } 
        if ( el.children.length ) {
          options = options.concat( 
            utils.findOptions( el.children ) 
          );
        }
      }

      return options;
    },

    // Finds any selected options out of the passed DK options
    getSelected: function( dkOptions ) {
      var opt, i,
        selected = [];

      for ( i = 0; i < dkOptions.length; i++ ) {
        opt = dkOptions[ i ];
        if ( utils.hasClass( opt, "dk-option-selected" ) ) {
          selected.push( opt );
        }
      }

      return selected;
    }
  };


// Extends the DK objects's Prototype
Dropkick.prototype = {

  // An object for any data to be stored
  data: {},

  // Emulate some of HTMLSelectElement's methods

  add: function( elem, before ) {
    var dkHTML, dkElem;

    if ( elem.nodeName === "OPTION" ) {
      dkHTML = utils.tmpl( tmpl.option, { option: elem });
      dkElem = utils.parseHTML( dkHTML );

      this.data.select.add( elem, before );

      if ( typeof before === "number" ) {
        before = this.options[ before ];
      } 

      if ( this.options.indexOf( before ) > -1 ) {
        before.parentNode.insertBefore( dkElem, before );
      } else {
        this.data.dk.lastChild.appendChild( dkElem );
      }

      if ( elem.selected ) {
        this.selectedOptions.push( dkElem );
      }

      this.options.push( dkElem );
    }
  },

  item: function( index ) {
    index = index < 0 ? this.options.length + index : index;
    return this.options[ index ] || null;
  },

  remove: function( index ) {
    var dkOption = this.options[ index ];
    dkOption.parentNode.removeChild( dkOption );
    this.options.splice( index, 1 );
    this.data.select.remove( index );
    this.select( this.data.select.selectedIndex );
  },

  // Initializes the DK Object
  init: function( sel, opts ) {
    var i, direction, dk,
      self = this;

    // Set some data on the DK Object
    this.data.dk = dk = Dropkick.build( sel );
    this.data.select = sel;
    this.data.settings = utils.extend( {}, defaults, opts );

    // Emulate some of HTMLSelectElement's properties
    this.value = sel.value;
    this.disabled = sel.disabled;
    this.form = sel.form;
    this.length = sel.length;
    this.options = utils.findOptions( this.data.dk.children );
    this.multiple = sel.multiple;
    this.selectedIndex = sel.selectedIndex;
    this.selectedOptions = utils.getSelected( this.options );

    if ( !this.multiple ) {
      this.close = function() {
        self.isOpen = false;

        for ( i = 0; i < self.options.length; i++ ) {
          utils.removeClass( self.options[ i ], "dk-option-highlight" );
        }

        utils.removeClass( dk.lastChild, "dk-select-options-highlight" );
        utils.removeClass( dk, "dk-select-open" + direction );

        document.removeEventListener( "click", self.close );
      };

      this.open = function() {
        var dropHeight, above, below,
          dk = self.data.dk,
          dkOptsList = dk.lastChild,
          dkBottom = dk.offsetTop + dk.offsetHeight;

        dkOptsList.style.display = "block";
        dropHeight = dkOptsList.offsetHeight;
        dkOptsList.style.display = "";

        below = window.innerHeight - dkBottom + window.scrollY;
        above = dk.offsetTop- window.scrollY > dropHeight;
        below = below > dropHeight;
        direction = above && !below ? "-up" : "-down";

        self.isOpen = true;
        utils.addClass( dk, "dk-select-open" + direction );
        document.addEventListener( "click", self.close );
      };
    }

    // Insert the DK element before the original select
    sel.parentNode.insertBefore( this.data.dk, sel );

    // Bind events
    this.data.dk.addEventListener( "click", this );
    this.data.dk.addEventListener( "keydown", this );
    this.data.dk.addEventListener( "keypress", this );

    for ( i = 0; i < this.options.length; i++ ) {
      if ( !this.multiple ) {
        this.options[ i ].addEventListener( "mouseover", this );
      }
    }

    // Add the DK Object to the cache
    dkCache.push( this );

    // Call the optional initialize funciton
    this.data.settings.initialize( this );

    return this;
  },

  select: function( elem ) {
    var index, option,
      select = this.data.select;

    if ( typeof elem === "number" ) {
      elem = this.item( elem );
    }

    if ( utils.hasClass( elem, "dk-option" ) ) {
      index = this.options.indexOf( elem );
      option = select.options[ index ];

      if ( this.multiple ) {
        utils.toggleClass( elem, "dk-option-selected" );
        option.selected = !option.selected;

        if ( utils.hasClass( elem, "dk-option-selected" ) ) {
          this.selectedOptions.push( elem );
        } else {
          index = this.selectedOptions.indexOf( elem );
          this.selectedOptions.splice( index, 1 );
        }
      } else {
        utils.removeClass( this.selectedOptions[0], "dk-option-selected" );
        utils.addClass( elem, "dk-option-selected" );
        this.data.dk.firstChild.innerText = option.text;
        this.selectedOptions[0] = elem;
        option.selected = true;
      }

      this.selectedIndex = select.selectedIndex;
      this.value = select.value;
      this.data.settings.change( this );
    }
  },

  search: function( string ) {
    var i,
      reg = new RegExp( "^" + string, "i" ),
      options = this.data.select.options;

    for ( i = 0; i < options.length; i++ ) {
      if ( reg.test( options[ i ].text )
          && i !== this.selectedIndex ) {
        return this.options[ i ];
      }
    }

    return false;
  },

  reset: function() {
    var i,
      select = this.data.select;

    for ( i = 0; i < select.options.length; i++ ) {
      select.options[ i ].selected = false;
      utils.removeClass( this.options[ i ], "dk-option-selected" );
    }

    this.selectedOptions.length = 0;

    if ( select.selectedIndex > -1 ) {
      this.selectedOptions.push( this.options[0] );
      this.select( select.selectedIndex );
    }
  },

  handleEvent: function( event ) {
    switch ( event.type ) {
    case "click":
      return this._delegate( event );
    case "keydown":
      return this._keyHandler( event );
    case "keypress":
      return this._searchOptions( event );
    case "mouseover":
      return this._highlight( event.target );
    }
  },

  _delegate: function( event ) {
    var target = event.target;

    if ( !this.isOpen && !this.multiple ) {
      event.stopPropagation();
      this.open();
    }

    if ( utils.hasClass( target, "dk-option" ) ) {
      this.select( target );
    }
  },

  _highlight: function( option ) {
    var i; 

    if ( !this.multiple ) {
      for ( i = 0; i < this.options.length; i++ ) {
        utils.removeClass( this.options[ i ], "dk-option-highlight" );
      }

      utils.addClass( this.data.dk.lastChild, "dk-select-options-highlight" );
      utils.addClass( option, "dk-option-highlight" );
    }
  },

  _keyHandler: function( event ) {
    var lastSelected,
      selected = this.selectedOptions,
      options = this.options,
      i = 1,
      keys = {
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        up: 38,
        down: 40
      };

    switch ( event.keyCode ) {
    case keys.up:
      i = -1;
    case keys.down:
      event.preventDefault();
      lastSelected = selected[ selected.length - 1 ];
      i = options.indexOf( lastSelected ) + i;
      this.reset();
      this.select( i );
      break;
    case keys.tab:
    case keys.enter:
      for ( i = 0; i < options.length; i++ ) {
        if ( utils.hasClass( options[ i ], "dk-option-highlight" ) ) {
          this.select( i );
        }
      }
    case keys.esc:
      event.preventDefault();
      if ( this.isOpen ) {
        this.close();
      }
      break;
    case keys.space:
      break;
    }
  },

  _searchOptions: function( event ) {
    var result,
      self = this,
      keyChar = String.fromCharCode( event.keyCode ),

      waitToReset = function() {
        if ( self.data.searchTimeout ) {
          clearTimeout( self.data.searchTimeout );
        }

        self.data.searchTimeout = setTimeout(function() { 
          self.data.searchString = ""; 
        }, 1000 );
      };

    if ( this.data.searchString === undefined ) {
      this.data.searchString = "";
    }

    waitToReset();

    this.data.searchString += keyChar;
    result = this.search( this.data.searchString );

    if ( result ) {
      this.reset();
      this.select( result );
    }
  }
};

// A static method that builds a DK element from the passed select
Dropkick.build = function( select ) {
  var dkHTML, dkSelect,

    buildInner = function( children ) {
      var child, i,
        inner = "";

      for ( i = 0; i < children.length; i++ ) {
        child = children[ i ];
        if ( child.nodeName === "OPTION" ) {
          inner += utils.tmpl( tmpl.option, { option: child });
        } else if ( child.nodeName === "OPTGROUP" ) {
          inner += utils.tmpl( tmpl.optgroup, {
            options: buildInner( child.children )
          });
        }
      }

      return inner;
    };
  
  if ( select.nodeName === "SELECT" ) {

    dkHTML = utils.tmpl( tmpl.select, {
      select: select,
      options: buildInner( select.children )
    });

    dkSelect = utils.parseHTML( dkHTML );

    return dkSelect;
  }
};

window.Dropkick = Dropkick;

})( window, document );