(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dropkickjs"] = factory();
	else
		root["dropkickjs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

var _defaults = __webpack_require__(2);

var _defaults2 = _interopRequireDefault(_defaults);

var _customEvent = __webpack_require__(3);

var _customEvent2 = _interopRequireDefault(_customEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var isIframe = window.parent !== window.self;
var noop = function noop() {};
var _docListener = void 0;

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

var Dropkick = function () {
  function Dropkick(select, options) {
    _classCallCheck(this, Dropkick);

    this.sel = select;
    var i = void 0,
        dk = void 0;
    var globalDK = window.Dropkick;

    if (typeof this.sel === "string" && this.sel[0] === "#") {
      this.sel = document.getElementById(select.substr(1));
    }

    // Check if select has already been DK'd and return the DK Object
    for (i = 0; i < globalDK.uid; i++) {
      dk = globalDK.cache[i];

      if (dk instanceof Dropkick && dk.data.select === this.sel) {
        _utils2.default.extend(dk.data.settings, options);
        return dk;
      }
    }

    if (!this.sel) {
      throw "You must pass a select to DropKick";
      return false;
    }

    if (this.sel.length < 1) {
      throw 'You must have options inside your <select>: ' + select;
      return false;
    }

    if (this.sel.nodeName === "SELECT") {
      return this.init(this.sel, options);
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


  _createClass(Dropkick, [{
    key: 'init',
    value: function init(sel, opts) {
      var globalDK = window.Dropkick;
      var i,
          dk = Dropkick.build(sel, "dk" + globalDK.uid);

      // Set some data on the DK Object
      this.data = {};
      this.data.select = sel;
      this.data.elem = dk.elem;
      this.data.settings = _utils2.default.extend({}, _defaults2.default, opts);

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
      this.options = dk.options.slice(0);

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
      this.selectedOptions = dk.selected.slice(0);

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
      globalDK.cache[this.data.cacheID] = this;

      // Call the optional initialize function
      this.data.settings.initialize.call(this);

      // Increment the index
      globalDK.uid += 1;

      // Add the change listener to the select
      if (!this._changeListener) {
        sel.addEventListener("change", this);
        this._changeListener = true;
      }

      // Don't continue if we're not rendering on mobile
      if (!(isMobile && !this.data.settings.mobile)) {

        // Insert the DK element before the original select
        sel.parentNode.insertBefore(this.data.elem, sel);
        sel.setAttribute("data-dkCacheId", this.data.cacheID);

        // Bind events
        this.data.elem.addEventListener("click", this);
        this.data.elem.addEventListener("keydown", this);
        this.data.elem.addEventListener("keypress", this);

        if (this.form) {
          this.form.addEventListener("reset", this);
        }

        if (!this.multiple) {
          for (i = 0; i < this.options.length; i++) {
            this.options[i].addEventListener("mouseover", this);
          }
        }

        if (!_docListener) {
          document.addEventListener("click", Dropkick.onDocClick);

          if (isIframe) {
            parent.document.addEventListener("click", Dropkick.onDocClick);
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

  }, {
    key: 'add',
    value: function add(elem, before) {
      var text, option, i;

      if (typeof elem === "string") {
        text = elem;
        elem = document.createElement("option");
        elem.text = text;
      }

      if (elem.nodeName === "OPTION") {
        option = _utils2.default.create("li", {
          "class": "dk-option",
          "data-value": elem.value,
          "text": elem.text,
          "innerHTML": elem.innerHTML,
          "role": "option",
          "aria-selected": "false",
          "id": "dk" + this.data.cacheID + "-" + (elem.id || elem.value.replace(" ", "-"))
        });

        _utils2.default.addClass(option, elem.className);
        this.length += 1;

        if (elem.disabled) {
          _utils2.default.addClass(option, "dk-option-disabled");
          option.setAttribute("aria-disabled", "true");
        }

        if (elem.hidden) {
          _utils2.default.addClass(option, "dk-option-hidden");
          option.setAttribute("aria-hidden", "true");
        }

        this.data.select.add(elem, before);

        if (typeof before === "number") {
          before = this.item(before);
        }

        i = this.options.indexOf(before);

        if (i > -1) {
          before.parentNode.insertBefore(option, before);
          this.options.splice(i, 0, option);
        } else {
          this.data.elem.lastChild.appendChild(option);
          this.options.push(option);
        }

        option.addEventListener("mouseover", this);

        if (elem.selected) {
          this.select(i);
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

  }, {
    key: 'item',
    value: function item(index) {
      index = index < 0 ? this.options.length + index : index;
      return this.options[index] || null;
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

  }, {
    key: 'remove',
    value: function remove(index) {
      var dkOption = this.item(index);
      dkOption.parentNode.removeChild(dkOption);
      this.options.splice(index, 1);
      this.data.select.remove(index);
      this.select(this.data.select.selectedIndex);
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

  }, {
    key: 'close',
    value: function close() {
      var i,
          dk = this.data.elem;

      if (!this.isOpen || this.multiple) {
        return false;
      }

      for (i = 0; i < this.options.length; i++) {
        _utils2.default.removeClass(this.options[i], "dk-option-highlight");
      }

      dk.lastChild.setAttribute("aria-expanded", "false");
      _utils2.default.removeClass(dk.lastChild, "dk-select-options-highlight");
      _utils2.default.removeClass(dk, "dk-select-open-(up|down)");
      this.isOpen = false;

      this.data.settings.close.call(this);
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

  }, {
    key: 'open',
    value: function open() {
      var dropHeight = void 0,
          above = void 0,
          below = void 0,
          direction = void 0,
          dkTop = void 0,
          dkBottom = void 0;
      var dk = this.data.elem;
      var dkOptsList = dk.lastChild;
      // Using MDNs suggestion for crossbrowser scrollY:
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
      var supportPageOffset = window.pageXOffset !== undefined;
      var isCSS1Compat = (document.compatMode || "") === "CSS1Compat";
      var scrollY = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

      dkTop = _utils2.default.offset(dk).top - scrollY;
      dkBottom = window.innerHeight - (dkTop + dk.offsetHeight);

      if (this.isOpen || this.multiple) {
        return false;
      }

      dkOptsList.style.display = "block";
      dropHeight = dkOptsList.offsetHeight;
      dkOptsList.style.display = "";

      above = dkTop > dropHeight;
      below = dkBottom > dropHeight;
      direction = above && !below ? "-up" : "-down";

      this.isOpen = true;
      _utils2.default.addClass(dk, "dk-select-open" + direction);
      dkOptsList.setAttribute("aria-expanded", "true");
      this._scrollTo(this.options.length - 1);
      this._scrollTo(this.selectedIndex);

      this.data.settings.open.call(this);
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

  }, {
    key: 'disable',
    value: function disable(elem, disabled) {
      var disabledClass = "dk-option-disabled";

      if (arguments.length === 0 || typeof elem === "boolean") {
        disabled = elem === undefined ? true : false;
        elem = this.data.elem;
        disabledClass = "dk-select-disabled";
        this.disabled = disabled;
      }

      if (disabled === undefined) {
        disabled = true;
      }

      if (typeof elem === "number") {
        elem = this.item(elem);
      }

      if (disabled) {
        elem.setAttribute('aria-disabled', true);
        _utils2.default.addClass(elem, disabledClass);
      } else {
        elem.setAttribute('aria-disabled', false);
        _utils2.default.removeClass(elem, disabledClass);
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

  }, {
    key: 'hide',
    value: function hide(elem, hidden) {
      var hiddenClass = "dk-option-hidden";

      if (hidden === undefined) {
        hidden = true;
      }

      elem = this.item(elem);

      if (hidden) {
        elem.setAttribute('aria-hidden', true);
        _utils2.default.addClass(elem, hiddenClass);
      } else {
        elem.setAttribute('aria-hidden', false);
        _utils2.default.removeClass(elem, hiddenClass);
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

  }, {
    key: 'select',
    value: function select(elem, disabled) {
      var i,
          index,
          option,
          combobox,
          select = this.data.select;

      if (typeof elem === "number") {
        elem = this.item(elem);
      }

      if (typeof elem === "string") {
        for (i = 0; i < this.length; i++) {
          if (this.options[i].getAttribute("data-value") === elem) {
            elem = this.options[i];
          }
        }
      }

      // No element or enabled option
      if (!elem || typeof elem === "string" || !disabled && _utils2.default.hasClass(elem, "dk-option-disabled")) {
        return false;
      }

      if (_utils2.default.hasClass(elem, "dk-option")) {
        index = this.options.indexOf(elem);
        option = select.options[index];

        if (this.multiple) {
          _utils2.default.toggleClass(elem, "dk-option-selected");
          option.selected = !option.selected;

          if (_utils2.default.hasClass(elem, "dk-option-selected")) {
            elem.setAttribute("aria-selected", "true");
            this.selectedOptions.push(elem);
          } else {
            elem.setAttribute("aria-selected", "false");
            index = this.selectedOptions.indexOf(elem);
            this.selectedOptions.splice(index, 1);
          }
        } else {
          combobox = this.data.elem.firstChild;

          if (this.selectedOptions.length) {
            _utils2.default.removeClass(this.selectedOptions[0], "dk-option-selected");
            this.selectedOptions[0].setAttribute("aria-selected", "false");
          }

          _utils2.default.addClass(elem, "dk-option-selected");
          elem.setAttribute("aria-selected", "true");

          combobox.setAttribute("aria-activedescendant", elem.id);
          combobox.className = "dk-selected " + option.className;
          combobox.innerHTML = option.innerHTML;

          this.selectedOptions[0] = elem;
          option.selected = true;
        }

        this.selectedIndex = select.selectedIndex;
        this.value = select.value;

        if (!disabled) {
          this.data.select.dispatchEvent(new _customEvent2.default("change", { bubbles: this.data.settings.bubble }));
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

  }, {
    key: 'selectOne',
    value: function selectOne(elem, disabled) {
      this.reset(true);
      this._scrollTo(elem);
      return this.select(elem, disabled);
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

  }, {
    key: 'search',
    value: function search(pattern, mode) {
      var i,
          tokens,
          str,
          tIndex,
          sIndex,
          cScore,
          tScore,
          reg,
          options = this.data.select.options,
          matches = [];

      if (!pattern) {
        return this.options;
      }

      // Fix Mode
      mode = mode ? mode.toLowerCase() : "strict";
      mode = mode === "fuzzy" ? 2 : mode === "partial" ? 1 : 0;

      reg = new RegExp((mode ? "" : "^") + pattern, "i");

      for (i = 0; i < options.length; i++) {
        str = options[i].text.toLowerCase();

        // Fuzzy
        if (mode == 2) {
          tokens = pattern.toLowerCase().split("");
          tIndex = sIndex = cScore = tScore = 0;

          while (sIndex < str.length) {
            if (str[sIndex] === tokens[tIndex]) {
              cScore += 1 + cScore;
              tIndex++;
            } else {
              cScore = 0;
            }

            tScore += cScore;
            sIndex++;
          }

          if (tIndex === tokens.length) {
            matches.push({ e: this.options[i], s: tScore, i: i });
          }

          // Partial or Strict (Default)
        } else {
          reg.test(str) && matches.push(this.options[i]);
        }
      }

      // Sort fuzzy results
      if (mode === 2) {
        matches = matches.sort(function (a, b) {
          return b.s - a.s || a.i - b.i;
        }).reduce(function (p, o) {
          p[p.length] = o.e;
          return p;
        }, []);
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

  }, {
    key: 'focus',
    value: function focus() {
      if (!this.disabled) {
        (this.multiple ? this.data.elem : this.data.elem.children[0]).focus();
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

  }, {
    key: 'reset',
    value: function reset(clear) {
      var i,
          select = this.data.select;

      this.selectedOptions.length = 0;

      for (i = 0; i < select.options.length; i++) {
        select.options[i].selected = false;
        _utils2.default.removeClass(this.options[i], "dk-option-selected");
        this.options[i].setAttribute("aria-selected", "false");
        if (!clear && select.options[i].defaultSelected) {
          this.select(i, true);
        }
      }

      if (!this.selectedOptions.length && !this.multiple) {
        this.select(0, true);
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

  }, {
    key: 'refresh',
    value: function refresh() {
      if (Object.keys(this).length > 0 && !(isMobile && !this.data.settings.mobile)) {
        this.dispose().init(this.data.select, this.data.settings);
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

  }, {
    key: 'dispose',
    value: function dispose() {
      var globalDK = window.Dropkick;

      if (Object.keys(this).length > 0 && !(isMobile && !this.data.settings.mobile)) {
        delete globalDK.cache[this.data.cacheID];
        this.data.elem.parentNode.removeChild(this.data.elem);
        this.data.select.removeAttribute("data-dkCacheId");
      }

      return this;
    }

    // Private Methods

    /**
     * @method handleEvent
     * @private
     */

  }, {
    key: 'handleEvent',
    value: function handleEvent(event) {
      if (this.disabled) {
        return;
      }

      switch (event.type) {
        case "click":
          this._delegate(event);
          break;
        case "keydown":
          this._keyHandler(event);
          break;
        case "keypress":
          this._searchOptions(event);
          break;
        case "mouseover":
          this._highlight(event);
          break;
        case "reset":
          this.reset();
          break;
        case "change":
          this.data.settings.change.call(this);
          break;
      }
    }

    /**
     * @method delegate
     * @private
     */

  }, {
    key: '_delegate',
    value: function _delegate(event) {
      var selection,
          index,
          firstIndex,
          lastIndex,
          target = event.target;

      if (_utils2.default.hasClass(target, "dk-option-disabled")) {
        return false;
      }

      if (!this.multiple) {
        this[this.isOpen ? "close" : "open"]();
        if (_utils2.default.hasClass(target, "dk-option")) {
          this.select(target);
        }
      } else {
        if (_utils2.default.hasClass(target, "dk-option")) {
          selection = window.getSelection();
          if (selection.type === "Range") selection.collapseToStart();

          if (event.shiftKey) {
            firstIndex = this.options.indexOf(this.selectedOptions[0]);
            lastIndex = this.options.indexOf(this.selectedOptions[this.selectedOptions.length - 1]);
            index = this.options.indexOf(target);

            if (index > firstIndex && index < lastIndex) index = firstIndex;
            if (index > lastIndex && lastIndex > firstIndex) lastIndex = firstIndex;

            this.reset(true);

            if (lastIndex > index) {
              while (index < lastIndex + 1) {
                this.select(index++);
              }
            } else {
              while (index > lastIndex - 1) {
                this.select(index--);
              }
            }
          } else if (event.ctrlKey || event.metaKey) {
            this.select(target);
          } else {
            this.reset(true);
            this.select(target);
          }
        }
      }
    }

    /**
     * @method highlight
     * @private
     */

  }, {
    key: '_highlight',
    value: function _highlight(event) {
      var i,
          option = event.target;

      if (!this.multiple) {
        for (i = 0; i < this.options.length; i++) {
          _utils2.default.removeClass(this.options[i], "dk-option-highlight");
        }

        _utils2.default.addClass(this.data.elem.lastChild, "dk-select-options-highlight");
        _utils2.default.addClass(option, "dk-option-highlight");
      }
    }

    /**
     * @method keyHandler
     * @private
     */

  }, {
    key: '_keyHandler',
    value: function _keyHandler(event) {
      var lastSelected,
          j,
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

      switch (event.keyCode) {
        case keys.up:
          i = -1;
        // deliberate fallthrough
        case keys.down:
          event.preventDefault();
          lastSelected = selected[selected.length - 1];

          if (_utils2.default.hasClass(this.data.elem.lastChild, "dk-select-options-highlight")) {
            _utils2.default.removeClass(this.data.elem.lastChild, "dk-select-options-highlight");
            for (j = 0; j < options.length; j++) {
              if (_utils2.default.hasClass(options[j], "dk-option-highlight")) {
                _utils2.default.removeClass(options[j], "dk-option-highlight");
                lastSelected = options[j];
              }
            }
          }

          i = options.indexOf(lastSelected) + i;

          if (i > options.length - 1) {
            i = options.length - 1;
          } else if (i < 0) {
            i = 0;
          }

          if (!this.data.select.options[i].disabled) {
            this.reset(true);
            this.select(i);
            this._scrollTo(i);
          }
          break;
        case keys.space:
          if (!this.isOpen) {
            event.preventDefault();
            this.open();
            break;
          }
        // deliberate fallthrough
        case keys.tab:
        case keys.enter:
          for (i = 0; i < options.length; i++) {
            if (_utils2.default.hasClass(options[i], "dk-option-highlight")) {
              this.select(i);
            }
          }
        // deliberate fallthrough
        case keys.esc:
          if (this.isOpen) {
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

  }, {
    key: '_searchOptions',
    value: function _searchOptions(event) {
      var results,
          self = this,
          keyChar = String.fromCharCode(event.keyCode || event.which),
          waitToReset = function waitToReset() {
        if (self.data.searchTimeout) {
          clearTimeout(self.data.searchTimeout);
        }

        self.data.searchTimeout = setTimeout(function () {
          self.data.searchString = "";
        }, 1000);
      };

      if (this.data.searchString === undefined) {
        this.data.searchString = "";
      }

      waitToReset();

      this.data.searchString += keyChar;
      results = this.search(this.data.searchString, this.data.settings.search);

      if (results.length) {
        if (!_utils2.default.hasClass(results[0], "dk-option-disabled")) {
          this.selectOne(results[0]);
        }
      }
    }

    /**
     * @method scrollTo
     * @private
     */

  }, {
    key: '_scrollTo',
    value: function _scrollTo(option) {
      var optPos,
          optTop,
          optBottom,
          dkOpts = this.data.elem.lastChild;

      if (option === -1 || typeof option !== "number" && !option || !this.isOpen && !this.multiple) {
        return false;
      }

      if (typeof option === "number") {
        option = this.item(option);
      }

      optPos = _utils2.default.position(option, dkOpts).top;
      optTop = optPos - dkOpts.scrollTop;
      optBottom = optTop + option.offsetHeight;

      if (optBottom > dkOpts.offsetHeight) {
        optPos += option.offsetHeight;
        dkOpts.scrollTop = optPos - dkOpts.offsetHeight;
      } else if (optTop < 0) {
        dkOpts.scrollTop = optPos;
      }
    }
  }]);

  return Dropkick;
}();

;

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
Dropkick.build = function (sel, idpre) {
  var selOpt,
      optList,
      i,
      options = [],
      ret = {
    elem: null,
    options: [],
    selected: []
  },
      addOption = function addOption(node) {
    var option,
        optgroup,
        optgroupList,
        i,
        children = [];

    switch (node.nodeName) {
      case "OPTION":
        option = _utils2.default.create("li", {
          "class": "dk-option ",
          "data-value": node.value,
          "text": node.text,
          "innerHTML": node.innerHTML,
          "role": "option",
          "aria-selected": "false",
          "id": idpre + "-" + (node.id || node.value.replace(" ", "-"))
        });

        _utils2.default.addClass(option, node.className);

        if (node.disabled) {
          _utils2.default.addClass(option, "dk-option-disabled");
          option.setAttribute("aria-disabled", "true");
        }

        if (node.hidden) {
          _utils2.default.addClass(option, "dk-option-hidden");
          option.setAttribute("aria-hidden", "true");
        }

        if (node.selected) {
          _utils2.default.addClass(option, "dk-option-selected");
          option.setAttribute("aria-selected", "true");
          ret.selected.push(option);
        }

        ret.options.push(this.appendChild(option));
        break;
      case "OPTGROUP":
        optgroup = _utils2.default.create("li", { "class": "dk-optgroup" });

        if (node.label) {
          optgroup.appendChild(_utils2.default.create("div", {
            "class": "dk-optgroup-label",
            "innerHTML": node.label
          }));
        }

        optgroupList = _utils2.default.create("ul", {
          "class": "dk-optgroup-options"
        });

        for (i = node.children.length; i--; children.unshift(node.children[i])) {}

        if (node.disabled) {
          optgroup.classList.add('dk-optgroup-disabled');

          children.forEach(function (option) {
            option.disabled = node.disabled;
          });
        }

        children.forEach(addOption, optgroupList);

        this.appendChild(optgroup).appendChild(optgroupList);
        break;
    }
  };

  ret.elem = _utils2.default.create("div", {
    "class": "dk-select" + (sel.multiple ? "-multi" : "")
  });

  optList = _utils2.default.create("ul", {
    "class": "dk-select-options",
    "id": idpre + "-listbox",
    "role": "listbox"
  });

  if (sel.disabled) {
    _utils2.default.addClass(ret.elem, "dk-select-disabled");
    ret.elem.setAttribute('aria-disabled', true);
  }
  ret.elem.id = idpre + (sel.id ? "-" + sel.id : "");
  _utils2.default.addClass(ret.elem, sel.className);

  if (!sel.multiple) {
    selOpt = sel.options[sel.selectedIndex];
    ret.elem.appendChild(_utils2.default.create("div", {
      "class": "dk-selected " + (selOpt ? selOpt.className : ""),
      "tabindex": sel.tabindex || 0,
      "innerHTML": selOpt ? selOpt.text : '&nbsp;',
      "id": idpre + "-combobox",
      "aria-live": "assertive",
      "aria-owns": optList.id,
      "role": "combobox"
    }));
    optList.setAttribute("aria-expanded", "false");
  } else {
    ret.elem.setAttribute("tabindex", sel.getAttribute("tabindex") || "0");
    optList.setAttribute("aria-multiselectable", "true");
  }

  for (i = sel.children.length; i--; options.unshift(sel.children[i])) {}
  options.forEach(addOption, ret.elem.appendChild(optList));

  return ret;
};

/**
 * Focus DK Element when corresponding label is clicked; close all other DK's
 *
 * @method  onDocClick
 * @private
 * @param {Object} event  Event from document click
 */
Dropkick.onDocClick = function (event) {
  var tId, i;
  var globalDK = window.Dropkick;

  if (event.target.nodeType !== 1) {
    return false;
  }

  if ((tId = event.target.getAttribute("data-dkcacheid")) !== null) {
    globalDK.cache[tId].focus();
  }

  for (i in globalDK.cache) {
    if (!_utils2.default.closest(event.target, globalDK.cache[i].data.elem) && i !== tId) {
      globalDK.cache[i].disabled || globalDK.cache[i].close();
    }
  }
};

// Add jQuery method
if (window.jQuery !== undefined) {
  window.jQuery.fn.dropkick = function () {
    var args = Array.prototype.slice.call(arguments);
    return jQuery(this).each(function () {
      if (!args[0] || _typeof(args[0]) === 'object') {
        new Dropkick(this, args[0] || {});
      } else if (typeof args[0] === 'string') {
        Dropkick.prototype[args[0]].apply(new Dropkick(this), args.slice(1));
      }
    });
  };
}

exports.default = Dropkick;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var isIE = navigator.appVersion.indexOf("MSIE") !== -1;
var Utils = {
  hasClass: function hasClass(elem, classname) {
    var reg = new RegExp("(^|\\s+)" + classname + "(\\s+|$)");

    return elem && reg.test(elem.className);
  },
  addClass: function addClass(elem, classname) {
    if (elem && !this.hasClass(elem, classname)) {
      elem.className += " " + classname;
    }
  },
  removeClass: function removeClass(elem, classname) {
    var reg = new RegExp("(^|\\s+)" + classname + "(\\s+|$)");

    elem && (elem.className = elem.className.replace(reg, " "));
  },
  toggleClass: function toggleClass(elem, classname) {
    var fn = this.hasClass(elem, classname) ? "remove" : "add";

    this[fn + "Class"](elem, classname);
  },


  // Shallow object extend
  extend: function extend(obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function (source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });

    return obj;
  },


  // Returns the top and left offset of an element
  offset: function offset(elem) {
    var box = elem.getBoundingClientRect() || { top: 0, left: 0 };
    var docElem = document.documentElement;
    var offsetTop = isIE ? docElem.scrollTop : window.pageYOffset;
    var offsetLeft = isIE ? docElem.scrollLeft : window.pageXOffset;

    return {
      top: box.top + offsetTop - docElem.clientTop,
      left: box.left + offsetLeft - docElem.clientLeft
    };
  },


  // Returns the top and left position of an element relative to an ancestor
  position: function position(elem, relative) {
    var pos = { top: 0, left: 0 };

    while (elem && elem !== relative) {
      pos.top += elem.offsetTop;
      pos.left += elem.offsetLeft;
      elem = elem.parentNode;
    }

    return pos;
  },


  // Returns the closest ancestor element of the child or false if not found
  closest: function closest(child, ancestor) {
    while (child) {
      if (child === ancestor) {
        return child;
      }
      child = child.parentNode;
    }

    return false;
  },


  // Creates a DOM node with the specified attributes
  create: function create(name, attrs) {
    var a = void 0;
    var node = document.createElement(name);

    if (!attrs) {
      attrs = {};
    }

    for (a in attrs) {
      if (attrs.hasOwnProperty(a)) {
        if (a === "innerHTML") {
          node.innerHTML = attrs[a];
        } else {
          node.setAttribute(a, attrs[a]);
        }
      }
    }

    return node;
  },
  deferred: function deferred(fn) {
    return function () {
      var _this = this,
          _arguments = arguments;

      window.setTimeout(function () {
        fn.apply(_this, _arguments);
      }, 1);
    };
  }
};

exports.default = Utils;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaults = {
  /**
   * Called once after the DK element is inserted into the DOM.
   * The value of `this` is the Dropkick object itself.
   *
   * @config initialize
   * @type Function
   *
   */
  initialize: function initialize() {},


  /**
   * Whether or not you would like Dropkick to render on mobile devices.
   *
   * @default false
   * @property {boolean} mobile
   * @type boolean
   *
   */
  mobile: true,

  /**
   * Called whenever the value of the Dropkick select changes (by user action or through the API).
   * The value of `this` is the Dropkick object itself.
   *
   * @config change
   * @type Function
   *
   */
  change: function change() {},


  /**
   * Called whenever the Dropkick select is opened. The value of `this` is the Dropkick object itself.
   *
   * @config open
   * @type Function
   *
   */
  open: function open() {},


  /**
   * Called whenever the Dropkick select is closed. The value of `this` is the Dropkick object itself.
   *
   * @config close
   * @type Function
   *
   */
  close: function close() {},


  // Search method; "strict", "partial", or "fuzzy"
  /**
   * `"strict"` - The search string matches exactly from the beginning of the option's text value (case insensitive).
   *
   * `"partial"` - The search string matches part of the option's text value (case insensitive).
   *
   * `"fuzzy"` - The search string matches the characters in the given order (not exclusively).
   * The strongest match is selected first. (case insensitive).
   *
   * @default "strict"
   * @config search
   * @type string
   *
   */
  search: "strict",

  /**
   * Bubble up the custom change event attached to Dropkick to the original element (select).
   */
  bubble: true
};

exports.default = defaults;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
var NativeCustomEvent = global.CustomEvent;

function useNative () {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return  'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {
  }
  return false;
}

/**
 * Cross-browser `CustomEvent` constructor.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 *
 * @public
 */

module.exports = useNative() ? NativeCustomEvent :

// IE >= 9
'undefined' !== typeof document && 'function' === typeof document.createEvent ? function CustomEvent (type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :

// IE <= 8
function CustomEvent (type, params) {
  var e = document.createEventObject();
  e.type = type;
  if (params) {
    e.bubbles = Boolean(params.bubbles);
    e.cancelable = Boolean(params.cancelable);
    e.detail = params.detail;
  } else {
    e.bubbles = false;
    e.cancelable = false;
    e.detail = void 0;
  }
  return e;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
});