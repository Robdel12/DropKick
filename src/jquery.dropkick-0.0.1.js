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
  var Mustache = window.Mustache ? window.Mustache : false;

  var arrowKeys = {
    'left'  : 37,
    'up'    : 38,
    'right' : 39,
    'down'  : 40
  };

  var defaults = {
    quickClick : false,
  };

  var menuTemplate = [
    '<div class="dropkick_container" id="dropkick_container_{{ id }}">',
      '<a class="dropkick_toggle" tabindex="{{ cid }}">',
        '<span class="dropkick_label">{{ label }}</span>',
        '<span class="dropkick_arrows">&#8227;</span>',
      '</a>',
      '<div class="dropkick_options">',
        '<div class="dropkick_options_inner">',
        '</div>',
      '</div>',
    '</div>'
  ].join('');

  var cid = 1;

  methods.init = function ( settings ) {

    settings = $.extend({}, defaults, settings);

    return this.each(function () {
      var $list     = $(this);
      var $selected = $list.find(':selected').first();
      var $options  = $list.find('option');
      var data      = $list.data('dropkick') || {};
      var id        = $list.attr('id') || $list.attr('name');
      var minWidth  = 0;

      if (data.id) {
        return $list;
      } else {
        data.cid       = cid++;
        data.id        = id;
        data.$selected = $selected;
        data.value     = _notBlank($list.val()) || _notBlank($selected.attr('value'));
        data.$list     = $list;
        data.label     = $selected.text();
        data.options   = $options;

        $list.data('dropkick', data);
        data = $list.data('dropkick');
      }

      var $menu = _build(menuTemplate, data);

      for (var i = 0, l = $options.length; i < l; i++) {
        var width = $options.eq(i).text().length * 6;
        if (width > minWidth) minWidth = width;
      }

      // Hide the <select> list
      $list.hide().before($menu);

      lists[lists.length] = $(this);

      var clickBind = settings.quickClick ? 'mousedown' : 'click';

      $menu.find('.dropkick_toggle').bind(clickBind, function (e) {
        $('.dropkick_container.open').not($menu).removeClass('open');
        $menu.toggleClass('open');
        $(this).toggleClass('focus');
        e.preventDefault();
        return false;
      }).bind('keyup', function (e) {
        if ($(this).hasClass('focus')) {
          if (e.keyCode === 13) {
            $(this).trigger(clickBind);
          } else if (e.keyCode && $menu.hasClass('open')) {
            _handleKeyBoardNav(e, $menu, data);
          }
        }
      }).bind('focusin', function (e) {
        $(this).addClass('focus');
      }).bind('focusout', function (e) {
        $(this).removeClass('focus');
        $menu.removeClass('open');
      }).css({
        'width' : minWidth + 'px'
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

  function _handleKeyBoardNav(e, menu, data) {
    var code    = e.keyCode;
    var options = menu.find('.dropkick_options a');
    var current = options.find('.dropkick_option_current');
    var first   = options.first();
    var last    = options.last();


    switch (code) {
      case arrowKeys.up:
        console.log(current.next('li'));
      break;
      case arrowKeys.left:
        last.addClass('dropkick_option_current');
        menu.find('.dropkick_options_inner').animate({ scrollTop: last.position().top }, 150);
      break;

      default:
      break;
    }
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
          var optionTpl = '<li><a data-dk-menu-value="{{ value }}" class="{{ current }}">{{ text }}</a></li>';
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