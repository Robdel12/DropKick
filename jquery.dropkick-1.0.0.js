/**
 * DropKick
 *
 * Highly customizable <select> lists
 * https://github.com/JamieLottering/DropKick
 *
 * © 2011 Jamie Lottering <http://github.com/JamieLottering>
 *                        <http://twitter.com/JamieLottering>
 * 
 */
(function ($, window, document) {

  // Help prevent flashes of unstyled content
  document.documentElement.className = document.documentElement.className + ' dk_fouc';
  
  var
    // Public methods exposed to $.fn.dropkick()
    methods = {},

    // Cache every <select> element that gets dropkicked
    lists   = [],

    // Convenience keys for keyboard navigation
    keyMap = {
      'left'  : 37,
      'up'    : 38,
      'right' : 39,
      'down'  : 40,
      'enter' : 13
    },

    // HTML template for the dropdowns
    dropdownTemplate = [
      '<div class="dk_container" id="dk_container_{{ id }}" tabindex="{{ tabindex }}">',
        '<a class="dk_toggle">',
          '<span class="dk_label">{{ label }}</span>',
        '</a>',
        '<div class="dk_options">',
          '<ul class="dk_options_inner">',
          '</ul>',
        '</div>',
      '</div>'
    ].join('');

    // HTML template for dropdown options
    optionTemplate = '<li class="{{ current }}"><a data-dk-dropdown-value="{{ value }}">{{ text }}</a></li>',

    // Some nice default values
    defaults = {
      startSpeed : 1000,  // I recommend a high value here, I feel it makes the changes less noticeable to the user
      theme  : false,
      change : false
    },

    // Make sure we only bind keydown on the document once
    keysBound = false
  ;

  // Called by using $('foo').dropkick();
  methods.init = function (settings) {
    settings = $.extend({}, defaults, settings);

    if ($.browser.msie && $.browser.version.substr(0, 1) < 7) {
      alert('omg');
      return this;
    }

    // Setup keyboard navigation if it isn't already
    if (!keysBound) {
      $(document).bind('keydown.dk_nav', function (e) {
        var
          // Look for an open dropdown...
          $open    = $('.dk_container.dk_open'),

          // Look for a focused dropdown
          $focused = $('.dk_container.dk_focus'),

          // Will be either $open, $focused, or null
          $dropdown = null
        ;

        // If we have an open dropdown, key events should get sent to that one
        if ($open.length) {
          $dropdown = $open;
        } else if ($focused.length && !$open.length) {
          // But if we have no open dropdowns, use the focused dropdown instead
          $dropdown = $focused;
        }

        if ($dropdown) {
          _handleKeyBoardNav(e, $dropdown.data('dropkick'));
        }
      }).bind('click', function (e) {
        var target = $(e.target);
        if ($('.dk_container.dk_open').length) {
          $('.dk_container.dk_open').removeClass('dk_open dk_focus');
        }
      });

      keysBound = true;
    }

    return this.each(function () {
      var
        // The current <select> element
        $select = $(this),

        // Store a reference to the originally selected <option> element
        $original = $select.find(':selected').first(),

        // Save all of the <option> elements
        $options = $select.find('option'),

        // We store lots of great stuff using jQuery data
        data = $select.data('dropkick') || {},

        // This gets applied to the 'dk_container' element
        id = $select.attr('id') || $select.attr('name'),

        // This gets updated to be equal to the longest <option> element
        width  = settings.width || $select.outerWidth(),

        // Check if we have a tabindex set or not
        tabindex  = $select.attr('tabindex') ? $select.attr('tabindex') : '',

        // The completed dk_container element
        $dropdown = false,

        theme
      ;

      // Dont do anything if we've already setup dropkick on this element
      if (data.id) {
        return $select;
      } else {
        data.settings  = settings;
        data.tabindex  = tabindex;
        data.id        = id;
        data.$original = $original;
        data.$select   = $select;
        data.value     = _notBlank($select.val()) || _notBlank($original.attr('value'));
        data.label     = $original.text();
        data.options   = $options;
      }

      // Build the dropdown HTML
      $dropdown = _build(dropdownTemplate, data);

      // Make the dropdown fixed width if desired
      $dropdown.find('.dk_toggle').css({
        'width' : width + 'px'
      });

      // Hide the <select> list and place our new one in front of it
      $select.before($dropdown);

      // Update the reference to $dropdown
      $dropdown = $('#dk_container_' + id).fadeIn(settings.startSpeed);

      // Save the current theme
      theme = settings.theme ? settings.theme : 'default';
      $dropdown.addClass('dk_theme_' + theme);
      data.theme = theme;

      // Save the updated $dropdown reference into our data object
      data.$dropdown = $dropdown;

      // Save the dropkick data onto the <select> element
      $select.data('dropkick', data);

      // Do the same for the dropdown, but add a few helpers
      $dropdown.data('dropkick', $.extend({}, data, {
        isOpen    : function () { return $dropdown.hasClass('dk_open'); },
        isFocus   : function () { return $dropdown.hasClass('dk_focus'); },
        $toggle   : $dropdown.find('.dk_toggle'),
        $label    : $dropdown.find('.dk_label'),
        $inner    : $dropdown.find('.dk_options_inner'),
        $current  : function () {
          return $dropdown.find('.dk_option_current');
        },
        $options : $dropdown.find('.dk_options')
      }));

      lists[lists.length] = $select;

      _setupDropdownBindings($dropdown.data('dropkick'));

      setTimeout(function () {
        $select.hide();
      }, 100);
    });
  };

  // Allows dynamic theme chnages
  methods.theme = function (newTheme) {
    var
      $select   = $(this),
      list      = $select.data('dropkick'),
      $dropdown = list.$dropdown
      oldtheme  = 'dk_theme_' + list.theme
    ;

    $dropdown.removeClass(oldtheme).addClass('dk_theme_' + newTheme);

    list.theme = newTheme;
  }

  // Reset all <selects and dropdowns in our lists array
  methods.reset = function () {
    for (var i = 0, l = lists.length; i < l; i++) {
      var
        listObj = lists[i].data('dropkick'),
        dkObj = listObj.$dropdown.data('dropkick')
      ;

      dkObj.$label.text(listObj.label);
      dkObj.$inner.animate({ scrollTop: 0 }, 0);

      _setCurrent(dkObj.$options.find('li').first(), dkObj.$current(), dkObj);
    }
  };

  // Expose the plugin
  $.fn.dropkick = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    }
  };

  // Private methods
  function _setupDropdownBindings(dkObj) {
    var $dropdown = dkObj.$dropdown;

    // Handle click events on the dropdown toggler
    dkObj.$toggle.bind('click', function (e) {
      _openDropdown(dkObj);

      if ("ontouchstart" in window) {
        dkObj.$dropdown.addClass('dk_touch');
        dkObj.$inner.addClass('scrollable vertical');
      }

      e.preventDefault();
      return false;
    });

    // Handle click events on individual dropdown options
    dkObj.$options.find('a').live(($.browser.msie ? 'mousedown' : 'click'), function (e) {
      var $option = $(this);

      _closeDropdown(dkObj);
      _updateFields($option, dkObj);
      _setCurrent($option.parent(), dkObj.$current(), dkObj);

      e.preventDefault();
      return false;
    });

    // Focus events
    $dropdown.bind('focus.dropkick', function (e) {
      $dropdown.addClass('dk_focus');
    }).bind('blur.dropkick', function (e) {
      $dropdown.removeClass('dk_open dk_focus');
    });

  }

  function _handleKeyBoardNav(e, dkObj) {
    var
      code     = e.keyCode,
      options  = dkObj.$options,
      current  = dkObj.$current(),
      first    = options.find('li').first(),
      last     = options.find('li').last(),
      next,
      prev
    ;

    switch (code) {
      case keyMap.enter:
        if (dkObj.isOpen()) {
          _updateFields(dkObj.$current().find('a'), dkObj);
          _closeDropdown(dkObj);
        } else {
          _openDropdown(dkObj);
        }
        e.preventDefault();
      break;

      case keyMap.up:
        prev = current.prev('li');
        if (dkObj.isOpen()) {
          if (prev.length) {
            _setCurrent(prev, current, dkObj);
          } else {
            _setCurrent(last, current, dkObj);
          }
        } else {
          _openDropdown(dkObj);
        }
        e.preventDefault();
      break;

      case keyMap.down:
        if (dkObj.isOpen()) {
          next = current.next('li').first();
          if (next.length) {
            _setCurrent(next, current, dkObj);
          } else {
            _setCurrent(first, current, dkObj);
          }
        } else {
          _openDropdown(dkObj);
        }
        e.preventDefault();
      break;

      default:
      break;
    }
  }

  // Update the <select> value, and the dropdown label
  function _updateFields(option, dkObj) {
    var value, label, $dropdown;

    value = option.attr('data-dk-dropdown-value');
    label = option.text();

    $dropdown = dkObj.$dropdown;
    $select   = dkObj.$select

    $select.val(value);

    dkObj.$label.text(label);

    if (dkObj.settings.change) {
      dkObj.settings.change.call($select, value, label);
    }
  }

  // Set the currently selected option
  function _setCurrent(newOption, oldOption, dkObj) {
    var $dropdown = dkObj.$dropdown;

    oldOption.removeClass('dk_option_current');
    newOption.addClass('dk_option_current');

    _setScrollPos(dkObj, newOption.prevAll('li'));
  }

  function _setScrollPos(dkObj, anchor) {
    var height = anchor.prevAll('li').outerHeight() * anchor.prevAll('li').length;
    dkObj.$inner.animate({ scrollTop: height + 'px' }, 0);
  }

  // Close a dropdown
  function _closeDropdown(dkObj) {
    dkObj.$dropdown.removeClass('dk_open');
  }

  // Open a dropdown
  function _openDropdown(dkObj) {
    dkObj.$dropdown.find('.dk_options').css({ top : dkObj.$toggle.outerHeight() - 1 });
    dkObj.$dropdown.toggleClass('dk_open');
    _setScrollPos(dkObj, dkObj.$current());
  }

  /**
   * Turn the dropdownTemplate into a jQuery object and fill in the variables.
   */
  function _build (tpl, view) {
    var
      // Template for the dropdown
      template  = tpl,
      // Holder of the dropdowns options
      options   = [],
      $dropdown
    ;

    template = template.replace('{{ id }}', view.id);
    template = template.replace('{{ label }}', view.label);
    template = template.replace('{{ tabindex }}', view.tabindex);

    if (view.options && view.options.length) {
      for (var i = 0, l = view.options.length; i < l; i++) {
        var
          $option   = $(view.options[i]),
          current   = 'dk_option_current',
          oTemplate = optionTemplate
        ;

        oTemplate = oTemplate.replace('{{ value }}', $option.val());
        oTemplate = oTemplate.replace('{{ current }}', (_notBlank($option.val()) === view.value) ? current : '');
        oTemplate = oTemplate.replace('{{ text }}', $option.text());

        options[options.length] = oTemplate;
      }
    }

    $dropdown = $(template);
    $dropdown.find('.dk_options_inner').html(options.join(''));

    return $dropdown;
  }

  function _notBlank(text) {
    return ($.trim(text).length > 0) ? text : false;
  }

})(jQuery, window, document);