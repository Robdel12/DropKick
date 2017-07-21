/** EventTarget support */
(function() {
  if (document.addEventListener || !window.Element || !window.Event) { return; }

  var expando = "__events"; /* own property for storing listeners */
  var flag = "__immediateStopped"; /* stopImmediatePropagation flag */

  Event.prototype.NONE = Event.NONE = 0;
  Event.prototype.CAPTURING_PHASE = Event.CAPTURING_PHASE = 1;
  Event.prototype.AT_TARGET = Event.AT_TARGET = 2;
  Event.prototype.BUBBLING_PHASE = Event.BUBBLING_PHASE = 3;

  Event.prototype.preventDefault = function() { if (this.cancelable !== false) { this.returnValue = false; } }
  Event.prototype.stopPropagation = function() { this.cancelBubble = true; }
  Event.prototype.stopImmediatePropagation = function() { this[flag] = this.cancelBubble = true; }

  var decorate = function(e, listenerNode) { /* improve event properties */
    e.timeStamp = +new Date();
    if (!e.target) { e.target = e.srcElement || listenerNode; }
    e.pageX = e.clientX + document.documentElement.scrollLeft;
    e.pageY = e.clientY + document.documentElement.scrollTop;

    if (e.type == "mouseover") { 
      e.relatedTarget = e.fromElement; 
    } else if (e.type == "mouseout") { 
      e.relatedTarget = e.toElement; 
    } else {
      e.relatedTarget = null;
    }
    return e;
  }

  /**
   * @param {object[]} data
   * @param {function} listener
   * @param {bool} useCapture
   * @returns {number}
   */
  var indexOf = function(data, listener, useCapture) { /* return an index of an existing listener */
    for (var i=0;i<data.length;i++) {
      var item = data[i];
      if (item.useCapture == useCapture && item.listener == listener) { return i; }
    }
    return -1;
  }

  var fire = function(event, listener, currentTarget) {
    event.currentTarget = currentTarget;
    if (typeof(listener) == "function") {
      listener.call(currentTarget, event);
    } else {
      listener.handleEvent(event);
    }
  }

  var getAncestors = function(node) {
    var result = [];
    while (node.parentNode) {
      result.unshift(node.parentNode);
      node = node.parentNode;
    }
    return result;
  }

  /**
   * Run listeners on a nodelist
   * @param {Event} event
   * @param {node[]} nodes
   * @param {number} phase
   * @returns {bool} terminated?
   */
  var runListeners = function(event, nodes, phase) {
    event.eventPhase = phase;
    for (var i=0;i<nodes.length;i++) {
      var node = nodes[i];
      var listeners = [];
      var data = (node[expando] || {})[event.type] || [];

      for (var j=0;j<data.length;j++) { /* get list of relevant listeners */
        var item = data[j];
        if (item.useCapture && phase == Event.BUBBLING_PHASE) { continue; }
        if (!item.useCapture && phase == Event.CAPTURING_PHASE) { continue; }
        listeners.push(item.listener);
      }

      /* trick: use try-catch to gracefully handle failing listeners, but do not use it abundantly */
      j=0;
      while (j < listeners.length) {
        try {
          while (j < listeners.length) {
            var listener = listeners[j++];
            fire(event, listener, node);
            if (event[flag]) { return true; } /* stopped immediate propagation */
          }
        } catch (e) {
          setTimeout(function() { throw e; }, 0);
        }
      }

      if (event.cancelBubble) { return true; } /* stopped propagation */
    }

    return false; /* propagation not stopped */
  }

  /**
   * The "real" event handler/processor. "this" is {Node} listenerNode.
   * @param {Event} event
   * @returns {boolean} Not cancelled?
   */
  var handler = function(event) {
    decorate(event, this);

    var ancestors = getAncestors(event.target);
    if (ancestors.length) { /* capture */
      if (runListeners(event, ancestors, Event.CAPTURING_PHASE)) { return event.returnValue; }
    }

    /* at target */
    if (runListeners(event, [event.target], Event.AT_TARGET)) { return event.returnValue; }

    if (ancestors.length && event.bubbles !== false) { /* bubble */
      ancestors.reverse();
      if (runListeners(event, ancestors, Event.BUBBLING_PHASE)) { return event.returnValue; }
    }

    event.stopPropagation(); /* do not process natively */
    return event.returnValue;
  }

  var proto = {
    addEventListener: function(type, listener, useCapture) {
      var self = this;
      var data = (this[expando] || {})[type] || [];
      var count = data.length;
      if (indexOf(data, listener, useCapture) > -1) { return; } /* already added */

      if (expando in this) {
        var storage = this[expando];
      } else {
        var storage = {
          _handler: function() {
            handler.apply(self, arguments);
          }
        };
        this[expando] = storage;
      }
      if (!(type in storage)) { storage[type] = []; }
      storage[type].push({listener:listener, useCapture:useCapture});

      if (!count) { this.attachEvent("on"+type, storage._handler); } /* first: add native listener */
    },

    removeEventListener: function(type, listener, useCapture) {
      var data = (this[expando] || {})[type] || [];
      var index = indexOf(data, listener, useCapture);
      if (index == -1) { return; } /* not present */

      data.splice(index, 1);
      if (!data.length) { this.detachEvent("on"+type, this[expando]._handler); } /* last: remove native listener */
    },

    dispatchEvent: function(event) {
      event.returnValue = true;
      return handler.call(this, event);
    }
  }

  var todo = [Element, window.constructor, document.constructor];
  while (todo.length) {
    var parent = todo.pop();
    for (var p in proto) { parent.prototype[p] = proto[p]; }
  }
})();