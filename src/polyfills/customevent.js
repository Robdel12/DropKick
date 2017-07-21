/** CustomEvent polyfill */
(function() {
  if (!window.CustomEvent && document.createEventObject) { /* IE only */
    window.CustomEvent = function(type, props) {
      if (!arguments.length) { throw new Error("Not enough arguments"); }
      var def = {
        type: type,
        bubbles: false,
        cancelable: false,
        detail: null
      }
      var event = document.createEventObject();
      for (var p in def)   { event[p] = def[p];   }
      for (var p in props) { event[p] = props[p]; }
      return event;
    }

    return;
  }

  try {
    new CustomEvent("test");
  } catch (e) { /* ctor version not supported or no window.CustomEvent */
    var CE = function (type, props) {
      if (!arguments.length) { throw new Error("Not enough arguments"); }
      var def = {
        bubbles: false,
        cancelable: false,
        detail: null 
      };
      for (var p in props)   { def[p] = props[p];   }
      var event = document.createEvent("CustomEvent");
      event.initCustomEvent(type, def.bubbles, def.cancelable, def.detail);
      return event;
    };
    
    CE.prototype = (window.CustomEvent || window.Event).prototype;
    window.CustomEvent = CE;
  }
})();