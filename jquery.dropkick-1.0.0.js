/**
* DropKick
*
* Highly customizable <select> lists
* https://github.com/JamieLottering/DropKick
*
* Modified by klh to support typing in box, microtemplating and multiselect dropdowns
*
* &copy; 2011 Jamie Lottering <http://github.com/JamieLottering>
*                        <http://twitter.com/JamieLottering>
*
*/
 
(function ($, window, document) {
 
    var ie6 = false;
 
    // Help prevent flashes of unstyled content
    if ($.browser.msie && $.browser.version.substr(0, 1) < 7) {
        ie6 = true;
    } else {
        document.documentElement.className = document.documentElement.className + ' dk_fouc';
    }
 
    var
    // Public methods exposed to $.fn.dropkick()
    methods = {},
 
    // Cache every <select> element that gets dropkicked
    lists = [],
 
    // Cache rendering of dropdowns for resig microtemplating
    renderCache = [],
 
    // Convenience keys for keyboard navigation
    keyMap = {
        'esc': 27,
        'space': 32,
        'left': 37,
        'up': 38,
       'right': 39,
        'down': 40,
        'enter': 13,
        'zero': 48,
        'last': 221  //support extend charsets such as Danish, Ukrainian etc.
    },
 
    // HTML template for the dropdowns (using resig microtemplating)
    microDropdownTemplate = [
      '<div class="dk_container" id="dk_container_<%=id%>" tabindex="<%=tabindex%>">',
        '<a class="dk_toggle">',
          '<span class="dk_label"><%=label%></span>',
        '</a>',
        '<div class="dk_options">',
          '<ul class="dk_options_inner">',
          '<%  for(var key=0, len=options.length; key < len; key++){%>',
          '<li class="<%if(!options[key].display){%>dk_option_hidden <%}%><%if(options[key].current){%>dk_option_current <%}%><%if(options[key].selected){%>selected <%}%><%if(multiple){%>dk_option_multiple<%}%>" >',
              '<a data-dk-dropdown-value="<%=options[key].value%>">',
               '<%if(multiple){%><span class="checkbox"></span><%}%>',
              '<%=options[key].text%></a>',
          '</li>',
          '<% } %>',
          '</ul>',
        '</div>',
      '</div>'
    ].join(''),
 
 
    // Some nice default values
    defaults = {
        startSpeed: 10,
        theme: false,
        change: false,
        fixed: true
    },
 
    // Make sure we only bind keydown on the document once
    keysBound = false
  ;
 
    // Called by using $('foo').dropkick();
    methods.init = function (settings) {
 
        settings = $.extend({}, defaults, settings);
 
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
        width = settings.width || $select.outerWidth(),
 
            // Check if we have a tabindex set or not
        tabindex = $select.attr('tabindex') ? $select.attr('tabindex') : '',
 
            // The completed dk_container element
        $dk = false,
 
        theme
      ;
            // Bind to original selector - so that changes propagate up to
            // Custom dropdown
 
            $select.live("change.saxo", function (e) {
                _doUpdateFromFormSelect(e)
            });
 
            // Dont do anything if we've already setup dropkick on this element
            if (data.id) {
                return $select;
            } else {
                data.settings = settings;
                data.tabindex = tabindex;
                data.id = id;
                data.$original = $original;
                data.$select = $select;
                data.value = _notBlank($select.val()) || _notBlank($original.attr('value'));
                data.label = $original.text();
                data.defaultLabel = $select.attr('data-label');
                data.options = $options;
                data.multiple = ($select.attr("multiple") == "multiple") ? true : false;
 
            }
 
            // Build the dropdown HTML   
 
            $dk = _builds(microDropdownTemplate, data);
 
 
            // Make the dropdown fixed width if desired
            if (settings.fixed) {
                $dk.find('.dk_toggle').css({
                    'width': width + 'px'
                });
            }
 
            // Hide the <select> list and place our new one in front of it
            $select.before($dk);
 
            // Update the reference to $dk
            $dk = $('#dk_container_' + id).fadeIn(settings.startSpeed);
 
            // Save the current theme
            theme = settings.theme ? settings.theme : 'default';
            $dk.addClass('dk_theme_' + theme);
            data.theme = theme;
 
            // Save the updated $dk reference into our data object
            data.$dk = $dk;
 
            // Save the dropkick data onto the <select> element
            $select.data('dropkick', data);
 
            // Do the same for the dropdown, but add a few helpers
            $dk.data('dropkick', data);
 
            lists[lists.length] = $select;
 
            // Changed from blur and focus to focus in/out
            // Focus events
            $dk.bind('focusIn.dropkick', function (e) {
                $dk.addClass('dk_focus');
            }).bind('focusOut.dropkick', function (e) {
                $dk.removeClass('dk_open dk_focus');
            });
 
            $select.bind('focusIn.dropkick', function (e) {
                $dk.focus();
                e.preventDefault();
            });
 
            $('body').on("click", function (event) {
                if (!$(event.target).parents('.dk_container').length) {
                    _closeDropdown($dk);
                }
            });
            setTimeout(function () {
                //$select.hide();
            }, 0);
        });
 
 
 
    };
 
    // Allows dynamic theme changes
    methods.theme = function (newTheme) {
        var
      $select = $(this),
      list = $select.data('dropkick'),
      $dk = list.$dk,
      oldtheme = 'dk_theme_' + list.theme
    ;
 
        $dk.removeClass(oldtheme).addClass('dk_theme_' + newTheme);
 
        list.theme = newTheme;
    };
 
    // Reset all <selects and dropdowns in our lists array
    methods.reset = function () {
        for (var i = 0, l = lists.length; i < l; i++) {
            var
        listData = lists[i].data('dropkick'),
        $dk = listData.$dk,
        $current = $dk.find('li').first()
      ;
 
            _updateLabelText($dk.find('.dk_label'), $dk, listData.label, data)
            $dk.find('.dk_options_inner').animate({ scrollTop: 0 }, 0);
 
            _setCurrent($current, $dk);
            _updateFields($current, $dk, true);
        }
    };
 
    // Expose the plugin
    $.fn.dropkick = function (method) {
        if (!ie6) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, arguments);
            }
        }
    };
 
    // private
 
    function _renderTemplate(str, data) {
        // Simple JavaScript Templating
        // John Resig - http://ejohn.org/ - MIT Licensed
        // modified!!!!
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
       renderCache[str] = renderCache[str] ||
        renderTemplate(document.getElementById(str).innerHTML) :
 
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
 
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
 
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
 
        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
 
    function _handleKeyBoardNav(e, $dk) {
        var
      code = e.keyCode,
      data = $dk.data('dropkick'),
      options = $dk.find('.dk_options'),
      letter = String.fromCharCode(code),
      open = $dk.hasClass('dk_open'),
      lis = options.find('li'),
      current = $dk.find('.dk_option_current'),
      first = lis.first(),
      last = lis.last(),
      next,
      prev
    ;
 
        var multiple = data.multiple;
        switch (code) {
 
            case keyMap.enter:
                if (open) {
                    if (!multiple) {
                        _updateFields(current.find("a"), $dk, false, false);
                        _closeDropdown($dk)
                    } else {
                        _updateFields(current.find("a"), $dk, true, false);
                    }
                } else {
                    _openDropdown($dk);
                }
                e.preventDefault();
                break;
            case keyMap.space:
                if (open) {
                    if (!multiple) {
                        _updateFields(current.find("a"), $dk, false, false);
                        _closeDropdown($dk)
                    } else {
                        _updateFields(current.find("a"), $dk, true, false);
                    }
                } else {
                    _openDropdown($dk);
                }
                e.preventDefault();
                break;
 
            case keyMap.up:
                prev = current.prev('li');
                if (open) {
                    if (prev.length) {
                        _setCurrent(prev, $dk);
                    } else {
                        _setCurrent(last, $dk);
                    }
                } else {
                    _openDropdown($dk);
                }
                e.preventDefault();
                break;
 
            case keyMap.down:
                if (open) {
                    next = current.next('li').first();
                    if (next.length) {
                        _setCurrent(next, $dk);
                    } else {
                        _setCurrent(first, $dk);
                    }
                } else {
                    _openDropdown($dk);
                }
                e.preventDefault();
                break;
            case keyMap.esc:
                if (open) {
                    _closeDropdown($dk);
                }
                e.preventDefault();
                break;
 
            default:
                break;
        }
 
        //if typing a letter
        if (code >= keyMap.zero && code <= keyMap.last) {
            //update data
            var now = new Date().getTime();
            if (data.finder == null) {
                data.finder = letter.toUpperCase();
                data.timer = now;
 
            } else {
                if (now > parseInt(data.timer) + 500) {
                    data.finder = letter.toUpperCase();
                    data.timer = now;
                } else {
                    data.finder = data.finder + letter.toUpperCase();
                    data.timer = now;
                }
 
            }
            //find and switch to the appropriate option
            var list = lis.find('a');
 
            for (var i = 0, len = list.length; i < len; i++) {
                var $a = $(list[i]);
                if ($a.text().toUpperCase().indexOf(data.finder) === 0) {
                    if (!multiple) { _updateFields($a, $dk, false, true); }
                    _setCurrent($a.parent(), $dk);
                    break;
                }
            }
            $dk.data('dropkick', data);
        }
    }
 
    // Update the <select> value, and the dropdown label
    function _updateFields(option, $dk, reset, dontclose) {
 
        var
    value = option.attr('data-dk-dropdown-value'),
    label = option.text(),
    listItem = option.parent(),
    data = $dk.data('dropkick'),
    options = $dk.find('.dk_options'),
    selectedIndicator,
    currentOption;
 
        $select = data.$select;
 
        if (data.multiple) {
            listItem.toggleClass("selected")
        } else {
            listItem.siblings("li.selected").removeClass("selected");
            listItem.addClass("selected");
        }
        selectedIndicator = option.parent().is(".selected");
        currentOption = $select.find("option").eq(listItem.index());
 
        _setSelectedFormItems(currentOption, selectedIndicator)
 
 
        reset = reset || false;
 
        if (data.settings.change && !reset) {
            data.settings.change.call($select, value, label);
        }
 
 
 
        if (!data.multiple && !dontclose) {
            _closeDropdown($dk);
            _setCurrent(option, $dk, true);
        } else {
            _setCurrent(option, $dk, true);
        }
        _updateLabelText($dk.find('.dk_label'), $dk, label, data)
        $select.change();
    }
 
 
    // update selection index on form select element
    function _setSelectedFormItems(listItem, selected) {
        listItem.attr("selected", selected);
    }
 
    function _doUpdateFromFormSelect(e) {
      if(e.originalEvent){
        var $select = $(e.target),
          data = $select.data('dropkick'),
          $dk = data.$dk,
          $listItems = $dk.find(".dk_options_inner li"),
          dataValue = $select.val();
        if (dataValue)
 
            realindex = $listItems.filter(function () {
                var d = $(this).find("a").attr('data-dk-dropdown-value');
                if ($.trim(d).length === 0) { return false; }
                return dataValue.toString().indexOf(d) !== -1;
            });
 
        $listItems.removeClass("selected dk_option_current");
        realindex.addClass("selected");
        if (realindex.length == 1) {
            realindex.addClass("dk_option_current")
        }
        _updateLabelText($dk.find("span.dk_label"), $dk, realindex.first().find("a").text(), data);
      }else{
        return false;
      }
    };
 
 
 
    // update label on dropdown
    function _updateLabelText($current, $dk, label, data) {
        var selectedNum = $dk.find("li.selected").length;
        if (data.multiple) {
            label = (selectedNum > 1) ? selectedNum + " selected" : label;
        }
        if (!selectedNum) {
            label = data.defaultLabel;
        }
 
        $current.text(label)
    }
 
    // Set the currently selected option
    function _setCurrent($current, $dk) {
        data = $dk.data('dropkick');
        $dk.find('.dk_option_current').removeClass('dk_option_current');
 
        if (!data.multiple) {
 
            _setScrollPos($dk, $current);
        }
            $current.addClass('dk_option_current');
    
 
    }
 
    function _setScrollPos($dk, anchor) {
        var height = anchor.prevAll('li').outerHeight() * anchor.prevAll('li').length;
        $dk.find('.dk_options_inner').animate({ scrollTop: height + 'px' }, 0);
    }
 
    // Close a dropdown
    function _closeDropdown($dk) {
        $dk.removeClass('dk_open');
    }
 
    // Open a dropdown
    function _openDropdown($dk) {
        var data = $dk.data('dropkick');
        if (_isThereSpace($dk, 250)) {
            $dk.find('.dk_options').css({ top: $dk.find('.dk_toggle').outerHeight() - 1 });
            $dk.removeClass('dk_flipped');
        } else {
            $dk.find('.dk_options').css({ top: ($dk.find('.dk_options').outerHeight() - 4) * -1 });
            $dk.addClass('dk_flipped');
        }
 
        $dk.toggleClass('dk_open');
    }
 
 
    /**
    * Turn the dropdownTemplate into a jQuery object and fill in the variables.
    * refactored to use microtemplating
    */
    function _builds(tpl, view) {
 
        var
        // Template for the dropdown
      template = tpl,
        // Holder of the dropdowns options
      data = {
          id: view.id,
          label: view.label,
          tabindex: view.tabindex,
          multiple: view.multiple,
          options: []
      },
      $dk;
 
        if (view.options && view.options.length) {
            $.map(view.options, function (val, i) {
                data.options[i] = {};
                data.options[i].value = $(val).val();
                data.options[i].text = $(val).text();
                data.options[i].selected = ($(val).attr("selected") == "selected") ? true : false;
                data.options[i].current = (_notBlank(data.options[i].value) === view.value) ? true : false;
                data.options[i].display = ($.trim(data.options[i].value).length > 0) ? true : false;
            });
        }
 
        $dk = $(_renderTemplate(microDropdownTemplate, data));
        _updateLabelText($dk.find('.dk_label'), $dk, data.label, view)
        return $dk;
 
    }
 
    function _notBlank(text) {
        return ($.trim(text).length > 0) ? text : false;
    }
 
    function _isThereSpace(elem, spaceNeded) {
        var docViewTop = jQuery(window).scrollTop()
      , docViewBottom = Math.ceil(docViewTop + jQuery(window).height())
      , elemTop = jQuery(elem).offset().top
      , elemBottom = Math.ceil(elemTop + jQuery(elem).height())
      , checkValue = elemBottom + spaceNeded;
 
        if (checkValue >= docViewBottom) {
            return false
        } else {
            return true
        }
 
    }
 
    $(function () {
 
        // Handle click events on the dropdown toggler
        $('.dk_toggle').live('click', function (e) {
            var $dk = $(this).parents('.dk_container').first();
 
            _openDropdown($dk);
 
            if ("ontouchstart" in window) {
                $dk.addClass('dk_touch');
                $dk.find('.dk_options_inner').addClass('scrollable vertical');
            }
 
            e.preventDefault();
            return false;
        });
 
        // Handle click events on individual dropdown options
        $('.dk_options a').live(($.browser.msie ? 'mousedown' : 'click'), function (e) {
            var
        $option = $(this),
        $dk = $option.parents('.dk_container').first(),
        data = $dk.data('dropkick')
      ;
            _updateFields($option, $dk, true);
            e.preventDefault();
            return false;
        });
       
 
        // Setup keyboard nav
        $(document).bind('keydown.dk_nav', function (e) {
            var
            // Look for an open dropdown...
        $open = $('.dk_container.dk_open'),
 
            // Look for a focused dropdown
        $focused = $('.dk_container.dk_focus'),
 
            // Will be either $open, $focused, or null
        $dk = null
      ;
 
            // If we have an open dropdown, key events should get sent to that one
            if ($open.length) {
                $dk = $open;
            } else if ($focused.length && !$open.length) {
                // But if we have no open dropdowns, use the focused dropdown instead
                $dk = $focused;
            }
 
            if ($dk) {
                _handleKeyBoardNav(e, $dk);
 
            }
        });
    });
})(jQuery, window, document);