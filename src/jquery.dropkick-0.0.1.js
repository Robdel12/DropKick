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
  var Mustache = (window.Mustache && window.Mustache.to_html) ? window.Mustache : false;

  var keyMap = {
    'left'  : 37,
    'up'    : 38,
    'right' : 39,
    'down'  : 40,
    'enter' : 13
  };

  var menuTemplate = [
    '<div class="dropkick_container" id="dropkick_container_{{ id }}">',
      '<a class="dropkick_toggle">',
        '<span class="dropkick_label">{{ label }}</span>',
        '<span class="dropkick_arrows">&#8227;</span>',
      '</a>',
      '<div class="dropkick_options">',
        '<div class="dropkick_options_inner">',
        '</div>',
      '</div>',
    '</div>'
  ].join('');

  var defaults = {
    height     : '250px',
    fixed      : true,
    quickClick : false
  };

  var cid = 1;

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
      var $list     = $(this);
      var $selected = $list.find(':selected').first();
      var $options  = $list.find('option');
      var data      = $list.data('dropkick') || {};
      var id        = $list.attr('id') || $list.attr('name');
      var minWidth  = 0;
      var $menu     = false;

      if (data.id) {
        return $list;
      } else {
        data.cid       = cid;
        data.id        = id;
        data.$selected = $selected;
        data.$list     = $list;
        data.value     = _notBlank($list.val()) || _notBlank($selected.attr('value'));
        data.label     = $selected.text();
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
      $list.attr('tabindex', cid).addClass('dropkick_hidden').before($menu);

      $menu      = $('#dropkick_container_' + id);
      data.$menu = $menu;

      $list.data('dropkick', data);
      $menu.data('dropkick', data);

      lists[lists.length] = $list;

      var clickBind = settings.quickClick ? 'mousedown' : 'click';

      $menu.find('.dropkick_toggle').bind(clickBind, function (e) {
        $('.dropkick_container.open').not($menu).removeClass('open');

        $menu.toggleClass('open');
        $menu.toggleClass('focus');

        e.preventDefault();
        return false;
      }).css({
        'width' : minWidth + 'px'
      });

      $list.bind('focus.dropkick', function (e) {
        $menu.addClass('dropkick_focus');
      }).bind('blur.dropkick', function (e) {
        $menu.removeClass('dropkick_focus');
      });

      $menu.find('.dropkick_options a').bind(clickBind, function (e) {
        var $option = $(this), value, label;

        value = $option.attr('data-dk-menu-value');
        label = $option.text();

        $menu.removeClass('open');
        $menu.find('.dropkick_label').text(label);
        $list.val(value);
        e.preventDefault();
        return false;
      });

      cid++;
    });

  };

  methods.reset = function () {
    for (var i = 0, l = lists.length; i < l; i++) {
      var data = lists[i].data('dropkick');
      var current = data.$menu.find('.dropkick_option_current');

      data.$menu.find('.dropkick_label').text(data.options.eq(0).text());
      data.$menu.find('.dropkick_options_inner').animate( { scrollTop: 0 }, 0);
      current.removeClass('dropkick_option_current');
    }
  };

  function _handleKeyBoardNav(e, $menu) {
    console.log('w');
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
      break;
      case keyMap.down:
        if ($menu.hasClass('open')) {
          next = current.next('li');
          if (next.length) {
            _setCurrent(next, current, $menu);
          } else {
            _setCurrent(first, current, $menu);
          }
        } else {
          _openMenu($menu);
        }
      break;
      default:
      break;
    }
  }

  function _updateFields(option, $menu) {
    var value, label;

    value = option.attr('data-dk-menu-value');
    label = option.text();
    $list = $menu.data('dropkick').$list;

    $list.val(value);
    $menu.find('.dropkick_label').text(label);
  }

  function _setCurrent(newOption, oldOption, $menu) {
    var height;

    oldOption.removeClass('dropkick_option_current');
    newOption.addClass('dropkick_option_current');

    _setScrollPos($menu, newOption.prevAll('li'));
  }

  function _setScrollPos($menu, anchor) {
    var height = anchor.prevAll('li').outerHeight() * anchor.prevAll('li').length;

    $menu.find('.dropkick_options_inner').animate( { scrollTop: height + 'px' }, 0);
  }

  function _closeMenu($menu) {
    $menu.removeClass('open focus');
    $menu.data('dropkick').$list.focus();
  }

  function _openMenu($menu) {
    $menu.addClass('open');
    _setScrollPos($menu, $menu.find('.dropkick_option_current'));
  }

  function _build ( tpl, view ) {
    if (Mustache) {
      return $(Mustache.to_html(tpl, view));
    } else {
      var built = tpl, $built, options = [];

      built = built.replace('{{ id }}', view.id);
      built = built.replace('{{ label }}', view.label);
      built = built.replace('{{ cid }}', view.cid);

      if (view.options && view.options.length) {
        for (var i = 0, l = view.options.length; i < l; i++) {
          var option = $(view.options[i]);
          var optionTpl = '<li class="{{ current }}"><a data-dk-menu-value="{{ value }}">{{ text }}</a></li>';
          var current   = 'dropkick_option_current';

          optionTpl = optionTpl.replace('{{ value }}', option.val()).replace('{{ current }}', (_notBlank(option.val()) === view.value) ? current : '');
          optionTpl = optionTpl.replace('{{ text }}', option.text());

          options[options.length] = optionTpl;
        }
      }

      $built = $(built);

      $built.find('.dropkick_options_inner').html(options.join(''));
      return $built;
    }
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