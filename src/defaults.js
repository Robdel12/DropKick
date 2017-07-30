const defaults = {
  /**
   * Called once after the DK element is inserted into the DOM.
   * The value of `this` is the Dropkick object itself.
   *
   * @config initialize
   * @type Function
   *
   */
  initialize() {},

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
  change() {},

  /**
   * Called whenever the Dropkick select is opened. The value of `this` is the Dropkick object itself.
   *
   * @config open
   * @type Function
   *
   */
  open() {},

  /**
   * Called whenever the Dropkick select is closed. The value of `this` is the Dropkick object itself.
   *
   * @config close
   * @type Function
   *
   */
  close() {},

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

export default defaults;
