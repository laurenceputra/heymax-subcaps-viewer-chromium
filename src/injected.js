(function() {
  'use strict';

  // Store original functions
  const originalFetch = window.fetch;
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  // Flag to track if we're currently patching
  let isPatching = false;

  // Monkey patch fetch
  function patchFetch() {
    if (window.fetch === monkeyPatchedFetch) return; // Already patched
    
    window.fetch = monkeyPatchedFetch;
  }

  function monkeyPatchedFetch(...args) {
    return originalFetch.apply(this, args);
  }

  // Monkey patch XMLHttpRequest
  function patchXHR() {
    if (XMLHttpRequest.prototype.open === monkeyPatchedXHROpen) return; // Already patched
    
    XMLHttpRequest.prototype.open = monkeyPatchedXHROpen;
    XMLHttpRequest.prototype.send = monkeyPatchedXHRSend;
  }

  function monkeyPatchedXHROpen(method, url, ...rest) {
    this._method = method;
    this._url = url;
    return originalXHROpen.call(this, method, url, ...rest);
  }

  function monkeyPatchedXHRSend(body) {
    return originalXHRSend.call(this, body);
  }

  // Apply patches
  function applyPatches() {
    if (isPatching) return;
    isPatching = true;
    
    patchFetch();
    patchXHR();
    
    isPatching = false;
  }

  // Monitor for patches being overwritten
  function monitorPatches() {
    setInterval(() => {
      // Check if fetch was overwritten
      if (window.fetch !== monkeyPatchedFetch) {
        patchFetch();
      }

      // Check if XHR was overwritten
      if (XMLHttpRequest.prototype.open !== monkeyPatchedXHROpen) {
        patchXHR();
      }
    }, 1000); // Check every second
  }

  // Initialize
  applyPatches();
  monitorPatches();

})();
