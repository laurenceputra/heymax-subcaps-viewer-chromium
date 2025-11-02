(function() {
  'use strict';

  // Store original functions
  const originalFetch = window.fetch;
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  // Flag to track if we're currently patching
  let isPatching = false;

  // Check if URL should be logged (only log URLs matching the target pattern)
  function shouldLogUrl(url) {
    try {
      const urlObj = new URL(url, window.location.href);
      // Only log requests to heymax.ai/cards/your-cards/* paths
      return urlObj.hostname === 'heymax.ai' && 
             urlObj.pathname.startsWith('/cards/your-cards/');
    } catch (error) {
      return false;
    }
  }

  // Logger function
  function logApiResponse(method, url, response, responseData) {
    console.log('%c[Network Monitor] API Response Logged', 'color: #4CAF50; font-weight: bold;');
    console.log('Method:', method);
    console.log('URL:', url);
    console.log('Status:', response?.status);
    console.log('Response Data:', responseData);
    console.log('Actual Response:', responseData);
    console.log('---');

    // Dispatch custom event for content script
    window.dispatchEvent(new CustomEvent('apiResponseLogged', {
      detail: {
        method,
        url,
        status: response?.status,
        data: responseData,
        timestamp: new Date().toISOString()
      }
    }));
  }

  // Monkey patch fetch
  function patchFetch() {
    if (window.fetch === monkeyPatchedFetch) return; // Already patched
    
    window.fetch = monkeyPatchedFetch;
    console.log('%c[Network Monitor] fetch() has been patched', 'color: #2196F3; font-weight: bold;');
  }

  function monkeyPatchedFetch(...args) {
    const [resource, config] = args;
    const url = typeof resource === 'string' ? resource : resource.url;
    const method = config?.method || 'GET';

    console.log(`%c[Network Monitor] Intercepted fetch: ${method} ${url}`, 'color: #FF9800;');

    return originalFetch.apply(this, args)
      .then(async response => {
        // Only log if URL matches the target pattern
        if (!shouldLogUrl(url)) {
          return response;
        }

        // Clone the response so we can read it
        const clonedResponse = response.clone();
        
        try {
          const contentType = response.headers.get('content-type');
          let responseData;
          
          if (contentType && contentType.includes('application/json')) {
            responseData = await clonedResponse.json();
            logApiResponse(method, url, response, responseData);
          } else {
            const text = await clonedResponse.text();
            if (text.length < 1000) { // Only log small text responses
              logApiResponse(method, url, response, text);
            }
          }
        } catch (error) {
          console.warn('[Network Monitor] Error reading response:', error);
        }

        return response;
      })
      .catch(error => {
        console.error(`[Network Monitor] Fetch error for ${url}:`, error);
        throw error;
      });
  }

  // Monkey patch XMLHttpRequest
  function patchXHR() {
    if (XMLHttpRequest.prototype.open === monkeyPatchedXHROpen) return; // Already patched
    
    XMLHttpRequest.prototype.open = monkeyPatchedXHROpen;
    XMLHttpRequest.prototype.send = monkeyPatchedXHRSend;
    console.log('%c[Network Monitor] XMLHttpRequest has been patched', 'color: #2196F3; font-weight: bold;');
  }

  function monkeyPatchedXHROpen(method, url, ...rest) {
    this._method = method;
    this._url = url;
    console.log(`%c[Network Monitor] Intercepted XHR: ${method} ${url}`, 'color: #FF9800;');
    return originalXHROpen.call(this, method, url, ...rest);
  }

  function monkeyPatchedXHRSend(body) {
    const xhr = this;
    
    // Add event listener for load
    const originalOnLoad = xhr.onload;
    const originalOnReadyStateChange = xhr.onreadystatechange;

    xhr.addEventListener('load', function() {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        // Only log if URL matches the target pattern
        if (!shouldLogUrl(xhr._url)) {
          return;
        }

        try {
          const contentType = xhr.getResponseHeader('content-type');
          let responseData;

          if (contentType && contentType.includes('application/json')) {
            responseData = JSON.parse(xhr.responseText);
          } else if (xhr.responseText && xhr.responseText.length < 1000) {
            responseData = xhr.responseText;
          }

          if (responseData) {
            logApiResponse(xhr._method, xhr._url, { status: xhr.status }, responseData);
          }
        } catch (error) {
          console.warn('[Network Monitor] Error processing XHR response:', error);
        }
      }
    });

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
        console.warn('%c[Network Monitor] ALERT: fetch() was overwritten! Re-applying patch...', 'color: #F44336; font-weight: bold; font-size: 14px;');
        patchFetch();
      }

      // Check if XHR was overwritten
      if (XMLHttpRequest.prototype.open !== monkeyPatchedXHROpen) {
        console.warn('%c[Network Monitor] ALERT: XMLHttpRequest.open() was overwritten! Re-applying patch...', 'color: #F44336; font-weight: bold; font-size: 14px;');
        patchXHR();
      }
    }, 1000); // Check every second
  }

  // Initialize
  console.log('%c[Network Monitor] Initializing network request monitoring...', 'color: #9C27B0; font-weight: bold; font-size: 16px;');
  applyPatches();
  monitorPatches();
  console.log('%c[Network Monitor] Monitoring active!', 'color: #4CAF50; font-weight: bold; font-size: 16px;');

})();
