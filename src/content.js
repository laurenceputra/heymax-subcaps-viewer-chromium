// Content script to inject the monkey patch into the page context
(function() {
  'use strict';

  console.log('[HeyMax SubCaps Viewer] Content script loaded');

  // Inject the script into the page context
  function injectScript() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected.js');
    script.onload = function() {
      console.log('[HeyMax SubCaps Viewer] Injected script loaded successfully');
      this.remove();
    };
    script.onerror = function() {
      console.error('[HeyMax SubCaps Viewer] Failed to load injected script');
      this.remove();
    };

    // Inject as early as possible
    (document.head || document.documentElement).appendChild(script);
  }

  // Listen for API response events from the injected script
  window.addEventListener('apiResponseLogged', function(event) {
    const { method, url, status, data, timestamp } = event.detail;
    
    console.log('[HeyMax SubCaps Viewer] API Response received in content script:');
    console.log('  Timestamp:', timestamp);
    console.log('  Method:', method);
    console.log('  URL:', url);
    console.log('  Status:', status);
    
    // Store in chrome.storage for potential later use
    chrome.storage.local.get(['apiResponses'], function(result) {
      const responses = result.apiResponses || [];
      responses.push({
        method,
        url,
        status,
        timestamp,
        data
      });
      
      // Keep only last 100 responses to avoid storage issues
      const trimmedResponses = responses.slice(-100);
      
      chrome.storage.local.set({ apiResponses: trimmedResponses }, function() {
        console.log('[HeyMax SubCaps Viewer] Response stored in chrome.storage');
      });
    });
  });

  // Inject the script immediately
  injectScript();

  console.log('[HeyMax SubCaps Viewer] Content script initialized');
})();
