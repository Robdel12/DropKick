import _ from './utils';
import defaults from './defaults';
import CustomEvent from 'custom-event';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent );
const isIframe = window.parent !== window.self;
const noop = function() {};
let _docListener;

/**
 * # Getting started
 * After you've cloned the repo you will need to add the library to your page. In the `build/js` folder use
 * one of the two DropKick files given. One has a version number in the file name and the other is a version
 * number-less version. You will also need to grab the css from `build/css` and load it on the page.
 *
 * Once those files are imported into the page you can call DropKick on any HTMLSelectElement:
 * `new Dropkick( HTMLSelectElement, Options );` or `new Dropkick( "ID", Options );`. This returns the dropkick
 * object to you. It may be useful for you to store this in a var to reference later.
 *
 * If you're using jQuery you can do this instead:
 * `$('#select').dropkick( Options );`
 *
 *
 * @class Dropkick
 * @return { object } DropKick Object for that select. You can call your methods on this if stored in a var
 * @param {elem} sel HTMLSelect Element being passed.
 * @param {opts} options See list of [properties you can pass in here](#list_of_properties)
 * @constructor
 * @example
 * // Pure JS
 * var select = new Dropkick("#select");
 * @example
 * // jQuery
 * $("#select").dropkick();
 */
class Dropkick {
  constructor(select, options) {
    this.sel = select;
    let i, dk;
    let globalDK = window.Dropkick;

    if ( typeof this.sel === "string" && this.sel[0] === "#" ) {
      this.sel = document.getElementById( select.substr( 1 ) );
    }

    // Check if select has already been DK'd and return the DK Object
    for ( i = 0; i < globalDK.uid; i++) {
      dk = globalDK.cache[ i ];

      if ( dk instanceof Dropkick && dk.data.select === this.sel ) {
        _.extend( dk.data.settings, options );
        return dk;
      }
    }

    if ( !this.sel ) {
      throw "You must pass a select to DropKick";
      return false;
    }

    if ( this.sel.length < 1 ) {
      throw `You must have options inside your <select>: ${select}`;
      return false;
    }

    if ( this.sel.nodeName === "SELECT" ) {
      return this.init( this.sel, options );
    }
  }

  /**
   * Initializes the DK Object
   *
   * @method init
   * @private
   * @param  {Node}   sel  [description]
   * @param  {Object} opts Options to override defaults
   * @return {Object}      The DK Object
   */
  init( sel, opts ) {
    let globalDK = window.Dropkick;
    var i,
        dk =  Dropkick.build( sel, "dk" + globalDK.uid );

    // Set some data on the DK Object
    this.data = {};
    this.data.select = sel;
    this.data.elem = dk.elem;
    this.data.settings = _.extend({}, defaults, opts );

    // Emulate some of HTMLSelectElement's properties

    /**
     * Whether the form is currently disabled or not
     *
     * @property {boolean} disabled
     * @example
     * var select = new Dropkick("#select");
     *
     * select.disabled;
     */
    this.disabled = sel.disabled;

    /**
     * The form associated with the select
     *
     * @property {node} form
     * @example
     * var select = new Dropkick("#select");
     *
     * select.form;
     */
    this.form = sel.form;

    /**
     * The number of options in the select
     *
     * @property {integer} length
     * @example
     * var select = new Dropkick("#select");
     *
     * select.length;
     */
    this.length = sel.length;

    /**
     * If this select is a multi-select
     *
     * @property {boolean} multiple
     * @example
     * var select = new Dropkick("#select");
     *
     * select.multiple;
     */
    this.multiple = sel.multiple;

    /**
     * An array of Dropkick options
     *
     * @property {array} options
     * @example
     * var select = new Dropkick("#select");
     *
     * select.options;
     */
    this.options = dk.options.slice( 0 );

    /**
     * An index of the first selected option
     *
     * @property {integer} selectedIndex
     * @example
     * var select = new Dropkick("#select");
     *
     * select.selectedIndex;
     */
    this.selectedIndex = sel.selectedIndex;

    /**
     * An array of selected Dropkick options
     *
     * @property {array} selectedOptions
     * @example
     * var select = new Dropkick("#select");
     *
     * select.selectedOptions;
     */
    this.selectedOptions = dk.selected.slice( 0 );

    /**
     * The current value of the select
     *
     * @property {string} value
     * @example
     * var select = new Dropkick("#select");
     *
     * select.value;
     */
    this.value = sel.value;

    // Add the DK Object to the cache
    this.data.cacheID = globalDK.uid;
    globalDK.cache[ this.data.cacheID ] = this;

    // Call the optional initialize function
    this.data.settings.initialize.call( this );

    // Increment the index
    globalDK.uid += 1;

    // Add the change listener to the select
    if ( !this._changeListener ) {
      sel.addEventListener( "change", this );
      this._changeListener = true;
    }

    // Don't continue if we're not rendering on mobile
    if ( !( isMobile && !this.data.settings.mobile ) ) {

      // Insert the DK element before the original select
      sel.parentNode.insertBefore( this.data.elem, sel );
      sel.setAttribute( "data-dkCacheId", this.data.cacheID );

      // Bind events
      this.data.elem.addEventListener( "click", this );
      this.data.elem.addEventListener( "keydown", this );
      this.data.elem.addEventListener( "keypress", this );

      if ( this.form ) {
        this.form.addEventListener( "reset", this );
      }

      if ( !this.multiple ) {
        for ( i = 0; i < this.options.length; i++ ) {
          this.options[ i ].addEventListener( "mouseover", this );
        }
      }

      if ( !_docListener ) {
        document.addEventListener( "click", Dropkick.onDocClick );

        if ( isIframe ){
          parent.document.addEventListener( "click", Dropkick.onDocClick );
        }

        _docListener = true;
      }
    }

    return this;
  }
  // Emulate some of HTMLSelectElement's methods

  /**
   * Adds an element to the select. This option will not only add it to the original
   * select, but create a Dropkick option and add it to the Dropkick select.
   *
   * @method add
   * @param {string} elem   HTMLOptionElement
   * @param {Node/Integer} before HTMLOptionElement/Index of Element
   * @example
   * var select = new Dropkick("#select");
   *
   * select.add("New option", 5);
   */
  add( elem, before ) {
    var text, option, i;

    if ( typeof elem === "string" ) {
      text = elem;
      elem = document.createElement("option");
      elem.text = text;
    }

    if ( elem.nodeName === "OPTION" ) {
      option = _.create( "li", {
        "class": "dk-option",
        "data-value": elem.value,
        "text": elem.text,
        "innerHTML": elem.innerHTML,
        "role": "option",
        "aria-selected": "false",
        "id": "dk" + this.data.cacheID + "-" + ( elem.id || elem.value.replace( " ", "-" ) )
      });

      _.addClass( option, elem.className );
      this.length += 1;

      if ( elem.disabled ) {
        _.addClass( option, "dk-option-disabled" );
        option.setAttribute( "aria-disabled", "true" );
      }

      if ( elem.hidden ) {
        _.addClass( option, "dk-option-hidden" );
        option.setAttribute( "aria-hidden", "true" );
      }

      this.data.select.add( elem, before );

      if ( typeof before === "number" ) {
        before = this.item( before );
      }

      i = this.options.indexOf( before );

      if ( i > -1 ) {
        before.parentNode.insertBefore( option, before );
        this.options.splice( i, 0, option );
      } else {
        this.data.elem.lastChild.appendChild( option );
        this.options.push( option );
      }

      option.addEventListener( "mouseover", this );

      if ( elem.selected ) {
        this.select( i );
      }
    }
  }

  /**
   * Selects an option in the list at the desired index (negative numbers select from the end).
   *
   * @method item
   * @param  {Integer} index Index of element (positive or negative)
   * @return {Node}          The DK option from the list, or null if not found
   * @example
   * var select = new Dropkick("#select");
   *
   * select.item(4); //returns DOM node of index
   */
  item( index ) {
    index = index < 0 ? this.options.length + index : index;
    return this.options[ index ] || null;
  }

  /**
   * Removes the option (from both the select and Dropkick) at the given index.
   *
   * @method  remove
   * @param  {Integer} index Index of element (positive or negative)
   * @example
   * var select = new Dropkick("#select");
   *
   * select.remove(4);
   */
  remove( index ) {
    let dkOption = this.item( index );
    dkOption.parentNode.removeChild( dkOption );
    this.options.splice( index, 1 );
    this.data.select.remove( index );
    this.select( this.data.select.selectedIndex );
    this.length -= 1;
  }

  /**
   * Closes the DK dropdown
   *
   * @method close
   * @example
   * var select = new Dropkick("#select");
   *
   * select.close(); //closes dk dropdown
   */
  close() {
    var i,
        dk = this.data.elem;

    if ( !this.isOpen || this.multiple ) {
      return false;
    }

    for ( i = 0; i < this.options.length; i++ ) {
      _.removeClass( this.options[ i ], "dk-option-highlight" );
    }

    dk.lastChild.setAttribute( "aria-expanded", "false" );
    _.removeClass( dk.lastChild, "dk-select-options-highlight" );
    _.removeClass( dk, "dk-select-open-(up|down)" );
    this.isOpen = false;

    this.data.settings.close.call( this );
  }

  /**
   * Opens the DK dropdown
   *
   * @method open
   * @example
   * var select = new Dropkick("#select");
   *
   * select.open(); //Opens the dk dropdown
   */
  // TODO: This used to run with the deffered util method
  // is that needed? What problem was that solving?
  // to make sure this runs in the next animation tick?
  open() {
    let dropHeight, above, below, direction, dkTop, dkBottom;
    let dk = this.data.elem;
    let dkOptsList = dk.lastChild;
    // Using MDNs suggestion for crossbrowser scrollY:
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
    let supportPageOffset = window.pageXOffset !== undefined;
    let isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
    let scrollY = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

    dkTop = _.offset( dk ).top - scrollY;
    dkBottom = window.innerHeight - ( dkTop + dk.offsetHeight );

    if ( this.isOpen || this.multiple ) { return false; }

    dkOptsList.style.display = "block";
    dropHeight = dkOptsList.offsetHeight;
    dkOptsList.style.display = "";

    above = dkTop > dropHeight;
    below = dkBottom > dropHeight;
    direction = above && !below ? "-up" : "-down";

    this.isOpen = true;
    _.addClass( dk, "dk-select-open" + direction );
    dkOptsList.setAttribute( "aria-expanded", "true" );
    this._scrollTo( this.options.length - 1 );
    this._scrollTo( this.selectedIndex );

    this.data.settings.open.call( this );
  }

  /**
   * Disables or enables an option; if only a boolean is passed (or nothing),
   * then the entire Dropkick will be disabled or enabled.
   *
   * @method disable
   * @param  {Integer} elem     The element or index to disable
   * @param  {Boolean}      disabled Value of disabled
   * @example
   * var select = new Dropkick("#select");
   *
   * // To disable the entire select
   * select.disable();
   *
   * // To disable just an option with an index
   * select.disable(4, true);
   *
   * // To re-enable the entire select
   * select.disable(false);
   *
   * // To re-enable just an option with an index
   * select.disable(4, false);
   */
  disable( elem, disabled ) {
    var disabledClass = "dk-option-disabled";

    if ( arguments.length === 0 || typeof elem === "boolean" ) {
      disabled = elem === undefined ? true : false;
      elem = this.data.elem;
      disabledClass = "dk-select-disabled";
      this.disabled = disabled;
    }

    if ( disabled === undefined ) {
      disabled = true;
    }

    if ( typeof elem === "number" ) {
      elem = this.item( elem );
    }

    if (disabled) {
      elem.setAttribute( 'aria-disabled', true );
      _.addClass( elem, disabledClass );
    } else {
      elem.setAttribute( 'aria-disabled', false );
      _.removeClass( elem, disabledClass );
    }
  }

  /**
   * Hides or shows an option.
   *
   * @method hide
   * @param  {Integer} elem     The element or index to hide
   * @param  {Boolean} hidden   Whether or not to hide the element
   * @example
   * var select = new Dropkick("#select");
   *
   * // To hide an option with an index
   * select.hide(4, true);
   *
   * // To make an option visible with an index
   * select.hide(4, false);
   */
  hide( elem, hidden ) {
    var hiddenClass = "dk-option-hidden";

    if ( hidden === undefined ) {
      hidden = true;
    }

    elem = this.item( elem );

    if (hidden) {
      elem.setAttribute( 'aria-hidden', true );
      _.addClass( elem, hiddenClass );
    } else {
      elem.setAttribute( 'aria-hidden', false );
      _.removeClass( elem, hiddenClass );
    }
  }

  /**
   * Selects an option from the list
   *
   * @method select
   * @param  {String} elem     The element, index, or value to select
   * @param  {Boolean}             disabled Selects disabled options
   * @return {Node}                         The selected element
   * @example
   * var elm = new Dropkick("#select");
   *
   * // Select by index
   * elm.select(4); //selects & returns 5th item in the list
   *
   * // Select by value
   * elm.select("AL"); // selects & returns option with the value "AL"
   */
  select( elem, disabled ) {
    var i, index, option, combobox,
    select = this.data.select;

    if ( typeof elem === "number" ) {
      elem = this.item( elem );
    }

    if ( typeof elem === "string" ) {
      for ( i = 0; i < this.length; i++ ) {
        if ( this.options[ i ].getAttribute( "data-value" ) === elem ) {
          elem = this.options[ i ];
        }
      }
    }

    // No element or enabled option
    if ( !elem || typeof elem === "string" ||
         ( !disabled && _.hasClass( elem, "dk-option-disabled" ) ) ) {
      return false;
    }

    if ( _.hasClass( elem, "dk-option" ) ) {
      index = this.options.indexOf( elem );
      option = select.options[ index ];

      if ( this.multiple ) {
        _.toggleClass( elem, "dk-option-selected" );
        option.selected = !option.selected;

        if ( _.hasClass( elem, "dk-option-selected" ) ) {
          elem.setAttribute( "aria-selected", "true" );
          this.selectedOptions.push( elem );
        } else {
          elem.setAttribute( "aria-selected", "false" );
          index = this.selectedOptions.indexOf( elem );
          this.selectedOptions.splice( index, 1 );
        }
      } else {
        combobox = this.data.elem.firstChild;

        if ( this.selectedOptions.length ) {
          _.removeClass( this.selectedOptions[0], "dk-option-selected" );
          this.selectedOptions[0].setAttribute( "aria-selected", "false" );
        }

        _.addClass( elem, "dk-option-selected" );
        elem.setAttribute( "aria-selected", "true" );

        combobox.setAttribute( "aria-activedescendant", elem.id );
        combobox.className = "dk-selected " + option.className;
        combobox.innerHTML = option.innerHTML;

        this.selectedOptions[0] = elem;
        option.selected = true;
      }

      this.selectedIndex = select.selectedIndex;
      this.value = select.value;

      if ( !disabled ) {
        this.data.select.dispatchEvent( new CustomEvent("change", {bubbles: this.data.settings.bubble}));
      }

      return elem;
    }
  }

  /**
   * Selects a single option from the list and scrolls to it (if the select is open or on multi-selects).
   * Useful for selecting an option after a search by the user. Important to note: this doesn't close the
   * dropdown when selecting. It keeps the dropdown open and scrolls to proper position.
   *
   * @method selectOne
   * @param  {Integer} elem     The element or index to select
   * @param  {Boolean}      disabled Selects disabled options
   * @return {Node}                  The selected element
   * @example
   * var select = new Dropkick("#select");
   *
   * select.selectOne(4);
   */
  selectOne( elem, disabled ) {
    this.reset( true );
    this._scrollTo( elem );
    return this.select( elem, disabled );
  }

  /**
   * Finds all options who's text matches a pattern (strict, partial, or fuzzy)
   *
   * `"strict"` - The search string matches exactly from the beginning of the
   * option's text value (case insensitive).
   *
   * `"partial"` - The search string matches part of the option's text value
   * (case insensitive).
   *
   * `"fuzzy"` - The search string matches the characters in the given order (not
   * exclusively). The strongest match is selected first. (case insensitive).
   *
   * @method search
   * @param  {String} string  The string to search for
   * @param  {Integer} mode   How to search; "strict", "partial", or "fuzzy"
   * @return {Boolean}  An Array of matched elements
   */
  search( pattern, mode ) {
    var i, tokens, str, tIndex, sIndex, cScore, tScore, reg,
    options = this.data.select.options,
    matches = [];

    if ( !pattern ) { return this.options; }

    // Fix Mode
    mode = mode ? mode.toLowerCase() : "strict";
    mode = mode === "fuzzy" ? 2 : mode === "partial" ? 1 : 0;

    reg = new RegExp( ( mode ? "" : "^" ) + pattern, "i" );

    for ( i = 0; i < options.length; i++ ) {
      str = options[ i ].text.toLowerCase();

      // Fuzzy
      if ( mode == 2 ) {
        tokens = pattern.toLowerCase().split("");
        tIndex = sIndex = cScore = tScore = 0;

        while ( sIndex < str.length ) {
          if ( str[ sIndex ] === tokens[ tIndex ] ) {
            cScore += 1 + cScore;
            tIndex++;
          } else {
            cScore = 0;
          }

          tScore += cScore;
          sIndex++;
        }

        if ( tIndex === tokens.length ) {
          matches.push({ e: this.options[ i ], s: tScore, i: i });
        }

        // Partial or Strict (Default)
      } else {
        reg.test( str ) && matches.push( this.options[ i ] );
      }
    }

    // Sort fuzzy results
    if ( mode === 2 ) {
      matches = matches.sort( function ( a, b ) {
        return ( b.s - a.s ) || a.i - b.i;
      }).reduce( function ( p, o ) {
        p[ p.length ] = o.e;
        return p;
      }, [] );
    }

    return matches;
  }

  /**
   * Brings focus to the proper DK element
   *
   * @method focus
   * @example
   * var select = new Dropkick("#select");
   *
   * $("#some_elm").on("click", function() {
   *   select.focus();
   * });
   */
  focus() {
    if ( !this.disabled ) {
      ( this.multiple ? this.data.elem : this.data.elem.children[0] ).focus();
    }
  }

  /**
   * Resets the Dropkick and select to it's original selected options; if `clear` is `true`,
   * It will select the first option by default (or no options for multi-selects).
   *
   * @method reset
   * @param  {Boolean} clear Defaults to first option if true
   * @example
   * var select = new Dropkick("#select");
   *
   * // Reset to originally `selected` option
   * select.reset();
   *
   * // Reset to first option in select
   * select.reset(true);
   */
  reset( clear ) {
    var i,
    select = this.data.select;

    this.selectedOptions.length = 0;

    for ( i = 0; i < select.options.length; i++ ) {
      select.options[ i ].selected = false;
      _.removeClass( this.options[ i ], "dk-option-selected" );
      this.options[ i ].setAttribute( "aria-selected", "false" );
      if ( !clear && select.options[ i ].defaultSelected ) {
        this.select( i, true );
      }
    }

    if ( !this.selectedOptions.length && !this.multiple ) {
      this.select( 0, true );
    }
  }

  /**
   * Rebuilds the DK Object
   * (use if HTMLSelectElement has changed)
   *
   * @method refresh
   * @example
   * var select = new Dropkick("#select");
   *
   * //... [change original select] ...
   *
   * select.refresh();
   */
  refresh() {
    if(Object.keys(this).length > 0 && !( isMobile && !this.data.settings.mobile )) {
      this.dispose().init( this.data.select, this.data.settings );
    }
  }

  /**
   * Removes the DK Object from the cache and the element from the DOM
   *
   * @method dispose
   * @example
   * var select = new Dropkick("#select");
   *
   * select.dispose();
   */
  dispose() {
    let globalDK = window.Dropkick;

    if (Object.keys(this).length > 0 && !( isMobile && !this.data.settings.mobile )) {
      delete globalDK.cache[ this.data.cacheID ];
      this.data.elem.parentNode.removeChild( this.data.elem );
      this.data.select.removeAttribute( "data-dkCacheId" );
    }

    return this;
  }

  // Private Methods

  /**
   * @method handleEvent
   * @private
   */
  handleEvent( event ) {
    if ( this.disabled ) { return; }

    switch ( event.type ) {
    case "click":
      this._delegate( event );
      break;
    case "keydown":
      this._keyHandler( event );
      break;
    case "keypress":
      this._searchOptions( event );
      break;
    case "mouseover":
      this._highlight( event );
      break;
    case "reset":
      this.reset();
      break;
    case "change":
      this.data.settings.change.call( this );
      break;
    }
  }


  /**
   * @method delegate
   * @private
   */
  _delegate( event ) {
    var selection, index, firstIndex, lastIndex,
    target = event.target;

    if ( _.hasClass( target, "dk-option-disabled" ) ) {
      return false;
    }

    if ( !this.multiple ) {
      this[ this.isOpen ? "close" : "open" ]();
      if ( _.hasClass( target, "dk-option" ) ) { this.select( target ); }
    } else {
      if ( _.hasClass( target, "dk-option" ) ) {
        selection = window.getSelection();
        if ( selection.type === "Range" ) selection.collapseToStart();

        if ( event.shiftKey ) {
          firstIndex = this.options.indexOf( this.selectedOptions[0] );
          lastIndex = this.options.indexOf( this.selectedOptions[ this.selectedOptions.length - 1 ] );
          index =  this.options.indexOf( target );

          if ( index > firstIndex && index < lastIndex ) index = firstIndex;
          if ( index > lastIndex && lastIndex > firstIndex ) lastIndex = firstIndex;

          this.reset( true );

          if ( lastIndex > index ) {
            while ( index < lastIndex + 1 ) { this.select( index++ ); }
          } else {
            while ( index > lastIndex - 1 ) { this.select( index-- ); }
          }
        } else if ( event.ctrlKey || event.metaKey ) {
          this.select( target );
        } else {
          this.reset( true );
          this.select( target );
        }
      }
    }
  }

  /**
   * @method highlight
   * @private
   */
  _highlight( event ) {
    var i, option = event.target;

    if ( !this.multiple ) {
      for ( i = 0; i < this.options.length; i++ ) {
        _.removeClass( this.options[ i ], "dk-option-highlight" );
      }

      _.addClass( this.data.elem.lastChild, "dk-select-options-highlight" );
      _.addClass( option, "dk-option-highlight" );
    }
  }

  /**
   * @method keyHandler
   * @private
   */
  _keyHandler( event ) {
    var lastSelected, j,
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
      // deliberate fallthrough
    case keys.down:
      event.preventDefault();
      lastSelected = selected[ selected.length - 1 ];

      if ( _.hasClass( this.data.elem.lastChild, "dk-select-options-highlight" ) ) {
        _.removeClass( this.data.elem.lastChild, "dk-select-options-highlight" );
        for ( j = 0; j < options.length; j++ ) {
          if ( _.hasClass( options[ j ], "dk-option-highlight" ) ) {
            _.removeClass( options[ j ], "dk-option-highlight" );
            lastSelected = options[ j ];
          }
        }
      }

      i = options.indexOf( lastSelected ) + i;

      if ( i > options.length - 1 ) {
        i = options.length - 1;
      } else if ( i < 0 ) {
        i = 0;
      }

      if ( !this.data.select.options[ i ].disabled ) {
        this.reset( true );
        this.select( i );
        this._scrollTo( i );
      }
      break;
    case keys.space:
      if ( !this.isOpen ) {
        event.preventDefault();
        this.open();
        break;
      }
      // deliberate fallthrough
    case keys.tab:
    case keys.enter:
      for ( i = 0; i < options.length; i++ ) {
        if ( _.hasClass( options[ i ], "dk-option-highlight" ) ) {
          this.select( i );
        }
      }
      // deliberate fallthrough
    case keys.esc:
      if ( this.isOpen ) {
        event.preventDefault();
        this.close();
      }
      break;
    }
  }

  /**
   * @method searchOptions
   * @private
   */
  _searchOptions( event ) {
    var results,
        self = this,
        keyChar = String.fromCharCode( event.keyCode || event.which ),

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
    results = this.search( this.data.searchString, this.data.settings.search );

    if ( results.length ) {
      if ( !_.hasClass( results[0], "dk-option-disabled" ) ) {
        this.selectOne( results[0] );
      }
    }
  }

  /**
   * @method scrollTo
   * @private
   */
  _scrollTo( option ) {
    var optPos, optTop, optBottom,
        dkOpts = this.data.elem.lastChild;

    if ( option === -1 || ( typeof option !== "number" && !option ) ||
         ( !this.isOpen && !this.multiple ) ) {
      return false;
    }

    if ( typeof option === "number" ) {
      option = this.item( option );
    }

    optPos = _.position( option, dkOpts ).top;
    optTop = optPos - dkOpts.scrollTop;
    optBottom = optTop + option.offsetHeight;

    if ( optBottom > dkOpts.offsetHeight ) {
      optPos += option.offsetHeight;
      dkOpts.scrollTop = optPos - dkOpts.offsetHeight;
    } else if ( optTop < 0 ) {
      dkOpts.scrollTop = optPos;
    }
  }
};

// Cache of DK Objects
// currently can't think of a way to do this not in the global space
// since DK isn't a singleton.

// is this cache a must have?
window.Dropkick = Dropkick;
window.Dropkick.cache = {};
window.Dropkick.uid = 0;

// Static Methods

/**
 * Builds the Dropkick element from a select element
 *
 * @method  build
 * @private
 * @param  {Node} sel The HTMLSelectElement
 * @return {Object}   An object containing the new DK element and it's options
 */
Dropkick.build = function( sel, idpre ) {
  var selOpt, optList, i,
      options = [],

      ret = {
        elem: null,
        options: [],
        selected: []
      },

      addOption = function ( node ) {
        var option, optgroup, optgroupList, i,
            children = [];

        switch ( node.nodeName ) {
        case "OPTION":
          option = _.create( "li", {
            "class": "dk-option ",
            "data-value": node.value,
            "text": node.text,
            "innerHTML": node.innerHTML,
            "role": "option",
            "aria-selected": "false",
            "id": idpre + "-" + ( node.id || node.value.replace( " ", "-" ) )
          });

          _.addClass( option, node.className );

          if ( node.disabled ) {
            _.addClass( option, "dk-option-disabled" );
            option.setAttribute( "aria-disabled", "true" );
          }

          if ( node.hidden ) {
            _.addClass( option, "dk-option-hidden" );
            option.setAttribute( "aria-hidden", "true" );
          }

          if ( node.selected ) {
            _.addClass( option, "dk-option-selected" );
            option.setAttribute( "aria-selected", "true" );
            ret.selected.push( option );
          }

          ret.options.push( this.appendChild( option ) );
          break;
        case "OPTGROUP":
          optgroup = _.create( "li", { "class": "dk-optgroup" });

          if ( node.label ) {
            optgroup.appendChild( _.create( "div", {
              "class": "dk-optgroup-label",
              "innerHTML": node.label
            }));
          }

          optgroupList = _.create( "ul", {
            "class": "dk-optgroup-options"
          });

          for ( i = node.children.length; i--; children.unshift( node.children[ i ] ) );

          if (node.disabled) {
            optgroup.classList.add('dk-optgroup-disabled');

            children.forEach(option => {
              option.disabled = node.disabled;
            });
          }

          children.forEach( addOption, optgroupList );

          this.appendChild( optgroup ).appendChild( optgroupList );
          break;
        }
      };

  ret.elem = _.create( "div", {
    "class": "dk-select" + ( sel.multiple ? "-multi" : "" )
  });

  optList = _.create( "ul", {
    "class": "dk-select-options",
    "id": idpre + "-listbox",
    "role": "listbox"
  });

  if (sel.disabled) {
    _.addClass( ret.elem, "dk-select-disabled" );
    ret.elem.setAttribute( 'aria-disabled', true );
  }
  ret.elem.id = idpre + ( sel.id ? "-" + sel.id : "" );
  _.addClass( ret.elem, sel.className );

  if ( !sel.multiple ) {
    selOpt = sel.options[ sel.selectedIndex ];
    ret.elem.appendChild( _.create( "div", {
      "class": "dk-selected " + ( selOpt ? selOpt.className : "" ),
      "tabindex": sel.tabindex || 0,
      "innerHTML": selOpt ? selOpt.innerHTML : '&nbsp;',
      "id": idpre + "-combobox",
      "aria-live": "assertive",
      "aria-owns": optList.id,
      "role": "combobox"
    }));
    optList.setAttribute( "aria-expanded", "false" );
  } else {
    ret.elem.setAttribute( "tabindex", sel.getAttribute( "tabindex" ) || "0" );
    optList.setAttribute( "aria-multiselectable", "true" );
  }

  for ( i = sel.children.length; i--; options.unshift( sel.children[ i ] ) );
  options.forEach( addOption, ret.elem.appendChild( optList ) );

  return ret;
};

/**
 * Focus DK Element when corresponding label is clicked; close all other DK's
 *
 * @method  onDocClick
 * @private
 * @param {Object} event  Event from document click
 */
Dropkick.onDocClick = function( event ) {
  var tId, i;
  let globalDK = window.Dropkick;

  if (event.target.nodeType !== 1) {
    return false;
  }

  if ( ( tId = event.target.getAttribute( "data-dkcacheid" ) ) !== null ) {
    globalDK.cache[ tId ].focus();
  }

  for ( i in globalDK.cache ) {
    if ( !_.closest( event.target, globalDK.cache[ i ].data.elem ) && i !== tId ) {
      globalDK.cache[ i ].disabled || globalDK.cache[ i ].close();
    }
  }
};


// Add jQuery method
if ( window.jQuery !== undefined ) {
  window.jQuery.fn.dropkick = function () {
    var args = Array.prototype.slice.call( arguments );
    return jQuery( this ).each(function() {
      if ( !args[0] || typeof args[0] === 'object' ) {
        new Dropkick( this, args[0] || {} );
      } else if ( typeof args[0] === 'string' ) {
        Dropkick.prototype[ args[0] ].apply( new Dropkick( this ), args.slice( 1 ) );
      }
    });
  };
}

export default Dropkick;
