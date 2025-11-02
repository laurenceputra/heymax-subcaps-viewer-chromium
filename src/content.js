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

  // Extract card ID from URL
  function extractCardId(url) {
    // Extract ID from patterns like:
    // /api/spend_tracking/cards/{id}/transactions
    // /api/spend_tracking/cards/{id}/summary
    const match = url.match(/\/api\/spend_tracking\/cards\/([a-f0-9]+)\//);
    if (match) {
      return match[1];
    }
    
    // If URL has double slashes (e.g., /cards//summary), extract ID from current page URL
    if (url.includes('/cards//')) {
      const pageMatch = window.location.pathname.match(/\/cards\/your-cards\/([a-f0-9]+)/);
      return pageMatch ? pageMatch[1] : null;
    }
    
    return null;
  }

  // Determine the data type from URL
  function getDataType(url) {
    if (url.includes('/transactions')) {
      return 'transactions';
    } else if (url.includes('/summary')) {
      return 'summary';
    } else if (url.includes('/card_tracker')) {
      return 'card_tracker';
    }
    return null;
  }

  // Listen for API response events from the injected script
  window.addEventListener('apiResponseLogged', function(event) {
    const { method, url, status, data, timestamp } = event.detail;
    
    console.log('[HeyMax SubCaps Viewer] API Response received in content script:');
    console.log('  Timestamp:', timestamp);
    console.log('  Method:', method);
    console.log('  URL:', url);
    console.log('  Status:', status);
    
    // Determine data type and card ID
    const dataType = getDataType(url);
    let cardId = extractCardId(url);
    
    // For card_tracker, try to get card ID from the current page URL
    if (dataType === 'card_tracker' && !cardId) {
      const pageMatch = window.location.pathname.match(/\/cards\/your-cards\/([a-f0-9]+)/);
      if (pageMatch) {
        cardId = pageMatch[1];
      }
    }
    
    // Store organized by card ID and data type
    chrome.storage.local.get(['cardData'], function(result) {
      const cardData = result.cardData || {};
      
      if (dataType && cardId) {
        // Initialize card object if it doesn't exist
        if (!cardData[cardId]) {
          cardData[cardId] = {};
        }
        
        // Store the latest data for this card ID and data type
        cardData[cardId][dataType] = {
          data: data,
          timestamp: timestamp,
          url: url,
          status: status
        };
        
        console.log(`[HeyMax SubCaps Viewer] Stored ${dataType} for card ${cardId}`);
      } else if (dataType === 'card_tracker' && !cardId) {
        // card_tracker on main listing page (no specific card ID)
        cardData['card_tracker'] = {
          data: data,
          timestamp: timestamp,
          url: url,
          status: status
        };
        
        console.log('[HeyMax SubCaps Viewer] Stored card_tracker data (global)');
      }
      
      // Save the updated cardData structure
      chrome.storage.local.set({ cardData: cardData }, function() {
        console.log('[HeyMax SubCaps Viewer] Card data updated in chrome.storage');
      });
    });
    
    // Also keep a log of all responses for debugging (optional)
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
        console.log('[HeyMax SubCaps Viewer] Response logged in apiResponses');
      });
    });
  });

  // Inject the script immediately
  injectScript();

  console.log('[HeyMax SubCaps Viewer] Content script initialized');
})();
