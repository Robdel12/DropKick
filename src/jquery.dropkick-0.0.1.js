/**
 * https://github.com/JamieLottering/DropKick
 * 
 * Highly customizable <select> lists
 * © 2011 Jamie Lottering <jamielottering(at)gmail.com>
 * 
 */
(function ( $, window ) {

  var methods = {};
  var lists   = [];

  var keyMap = {
    'left'  : 37,
    'up'    : 38,
    'right' : 39,
    'down'  : 40,
    'enter' : 13
  };

  var menuTemplate = [
    '<div class="dropkick_container" id="dropkick_container_{{ id }}" tabindex="{{ tabindex }}">',
      '<a class="dropkick_toggle">',
        '<span class="dropkick_label">{{ label }}</span>',
      '</a>',
      '<div class="dropkick_options">',
        '<div class="dropkick_options_inner">',
        '</div>',
      '</div>',
    '</div>'
  ].join('');

  var optionTemplate = '<li class="{{ current }}"><a data-dk-menu-value="{{ value }}">{{ text }}</a></li>';

  var defaults = {
    height     : '250px',
    fixed      : true,
    change     : false,
    quickClick : false
  };

  var tabindex;

  methods.init = function ( settings ) {

    settings = $.extend({}, defaults, settings);

    $(document).bind('keydown.dropkick_nav', function (e) {
      var $openMenu    = $('.dropkick_container.open');
      var $focusedMenu = $('.dropkick_container.dropkick_focus');
      var $menu;

      if ($openMenu.length) {
        $menu = $openMenu;
      } else if ($focusedMenu.length && !$openMenu.length) {
        $menu = $focusedMenu;
      }

      if ($menu) _handleKeyBoardNav(e, $menu);
    });

    return this.each(function () {
      var $select   = $(this);
      var $original = $select.find(':selected').first();
      var $options  = $select.find('option');
      var data      = $select.data('dropkick') || {};
      var id        = $select.attr('id') || $select.attr('name');
      var minWidth  = 0;
      var tabindex  = $select.attr('tabindex') ? $select.attr('tabindex') : '';
      var $menu     = false;
      var clickEvt  = settings.quickClick ? 'mousedown' : 'click';

      if (data.id) {
        return $select;
      } else {
        data.tabindex  = tabindex;
        data.id        = id;
        data.$original = $original;
        data.$select     = $select;
        data.value     = _notBlank($select.val()) || _notBlank($original.attr('value'));
        data.label     = $original.text();
        data.options   = $options;
      }

      $menu = _build(menuTemplate, data);

      if (settings.fixed) {
        for (var i = 0, l = $options.length; i < l; i++) {
          var width = $options.eq(i).text().length * 6;
          if (width > minWidth) minWidth = width;
        }
      }

      // Hide the <select> list
      $select.hide().before($menu);

      $menu      = $('#dropkick_container_' + id);
      data.$menu = $menu;

      $select.data('dropkick', data);

      $menu.data('dropkick', $.extend({}, data, {
        isOpen    : $menu.hasClass('open'),
        isFocus   : $menu.hasClass('dropkick_focus'),
        $toggle   : function () {
          return $menu.find('.dropkick_toggle');
        },
        $current  : function () {
          return $menu.find('.dropkick_option_current');
        },
        $options : function () {
          return $menu.find('.dropkick_options a');
        },
        settings: settings
      }));

      lists[lists.length] = $select;

      

      $menu.data('dropkick').$toggle().css({
        'width' : minWidth > 0 ? minWidth + 'px' : 'auto'
      });

      _setupMenuBindings($menu.data('dropkick'), clickEvt);

      tabindex++;
    });
  };

  methods.reset = function () {
    for (var i = 0, l = lists.length; i < l; i++) {
      var data = lists[i].data('dropkick');
      var current = data.$menu.data('dropkick').$current();

      data.$menu.find('.dropkick_label').text(data.options.eq(0).text());
      data.$menu.find('.dropkick_options_inner').animate( { scrollTop: 0 }, 0);

      current.removeClass('dropkick_option_current');
      console.log(data.$original);
    }
  };

  function _setupMenuBindings(dk, clickEvt) {
    var $menu = dk.$menu;

    // Handle click events on the dropdown toggler
    dk.$toggle().bind(clickEvt, function (e) {
      _openMenu($menu);
      e.preventDefault();
      return false;
    });

    // Handle click events on individual dropdown options
    dk.$options().bind(clickEvt, function (e) {
      var $option = $(this);

      _closeMenu($menu);
      _updateFields($option, $menu);
      _setCurrent($option.parent(), $menu.find('.dropkick_option_current'), $menu);

      if (dk.settings.change) {
        dk.settings.change.call($option, $option.attr('data-dk-menu-value'), $option.text());
      }

      e.preventDefault();
      return false;
    });

    // Focus events
    $menu.bind('focus.dropkick', function (e) {
      $menu.addClass('dropkick_focus');
    }).bind('blur.dropkick', function (e) {
      $menu.removeClass('open dropkick_focus');
    });

  }

  function _handleKeyBoardNav(e, $menu) {
    var code    = e.keyCode;
    var options = $menu.find('.dropkick_options');
    var current = options.find('.dropkick_option_current');
    var next, prev;
    var first   = options.find('li').first();
    var last    = options.find('li').last();

    switch (code) {
      case keyMap.enter:
        if ($menu.hasClass('open')) {
          _updateFields(options.find('.dropkick_option_current a'), $menu);
          _closeMenu($menu);
        } else {
          _openMenu($menu);
        }
      break;
      case keyMap.up:
        prev = current.prev('li');
        if (prev.length) {
          _setCurrent(prev, current, $menu);
        } else {
          _setCurrent(last, current, $menu);
        }
        e.preventDefault();
      break;
      case keyMap.down:
        if ($menu.hasClass('open')) {
          next = current.next('li');
          if (next.length) {
            console.log(next);
            _setCurrent(next, current, $menu);
          } else {
            _setCurrent(first, current, $menu);
          }
        } else {
          _openMenu($menu);
        }
        console.log(e);
        e.preventDefault();
      break;
      default:
      break;
    }
  }

  function _updateFields(option, $menu) {
    var value, label;

    value = option.attr('data-dk-menu-value');
    label = option.text();
    $select = $menu.data('dropkick').$select;

    $select.val(value);
    $menu.find('.dropkick_label').text(label);
  }

  function _setCurrent(newOption, oldOption, $menu) {
    oldOption.removeClass('dropkick_option_current');
    newOption.addClass('dropkick_option_current');

    _setScrollPos($menu, newOption.prevAll('li'));
  }

  function _setScrollPos($menu, anchor) {
    var height = anchor.prevAll('li').outerHeight() * anchor.prevAll('li').length;
    $menu.find('.dropkick_options_inner').animate( { scrollTop: height + 'px' }, 0);
  }

  function _closeMenu($menu) {
    $menu.removeClass('open');
  }

  function _openMenu($menu) {
    $menu.toggleClass('open');
    _setScrollPos($menu, $menu.find('.dropkick_option_current'));
  }

  /**
   * _build
   *
   * Turn our menuTemplate a jQuery object 
   * and fill in the variables.
   *
   */
  function _build ( tpl, view ) {
    var
      template  = tpl,             // Template for the dropdown
      options   = [],              // Holder of the dropdowns options
      $dropdown                    // This will be the built jquery object
    ;

    template = template.replace('{{ id }}', view.id);
    template = template.replace('{{ label }}', view.label);
    template = template.replace('{{ tabindex }}', view.tabindex);

    if (view.options && view.options.length) {
      for (var i = 0, l = view.options.length; i < l; i++) {
        var
          $option   = $(view.options[i]),
          current   = 'dropkick_option_current',
          oTemplate = optionTemplate
        ;

        oTemplate = oTemplate.replace('{{ value }}', $option.val());
        oTemplate = oTemplate.replace('{{ current }}', (_notBlank($option.val()) === view.value) ? current : '');
        oTemplate = oTemplate.replace('{{ text }}', $option.text());

        options[options.length] = oTemplate;
      }
    }

    $dropdown = $(template);
    $dropdown.find('.dropkick_options_inner').html(options.join(''));

    return $dropdown;
  }

  function _notBlank( text ) {
    return ($.trim(text).length > 0) ? text : false;
  }

  $.fn.dropkick = function ( method ) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    }
  };

})( jQuery, window );