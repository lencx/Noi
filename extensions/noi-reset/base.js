(function(history) {
  // Initialize storage for event listeners
  const eventListeners = {
    pushstate: {},
    replacestate: {},
    popstate: {}
  };

  // Function to trigger all listeners for a specific event
  function triggerEventListeners(eventName, event) {
    Object.values(eventListeners[eventName]).forEach(listener => listener(event));
  }

  // Function to override history methods and add our own logic
  function overrideHistoryMethod(methodName, eventName) {
    const originalMethod = history[methodName];
    history[methodName] = function(state, ...rest) {
      const result = originalMethod.apply(this, [state, ...rest]);
      // Construct event object
      const event = { state: state, url: window.location.href };
      triggerEventListeners(eventName, event);
      return result;
    };
  }

  // Override both pushState and replaceState methods
  overrideHistoryMethod('pushState', 'pushstate');
  overrideHistoryMethod('replaceState', 'replacestate');

  // Listen to the native popstate event and trigger our listeners
  window.addEventListener('popstate', event => {
    triggerEventListeners('popstate', { url: window.location.href });
  });

  // Provide interface for registering and unregistering event listeners
  window.NoiUtils = {
    changeURL(id, callback) {
      if (typeof callback === 'function' && id) {
        // Avoid registering the same callback under the same ID
        eventListeners.pushstate[id] = callback;
        eventListeners.replacestate[id] = callback;
        eventListeners.popstate[id] = callback;
      }
    },
    removeURL(id) {
      // Remove the listener by ID from all event types
      delete eventListeners.pushstate[id];
      delete eventListeners.replacestate[id];
      delete eventListeners.popstate[id];
    }
  };
})(window.history);
