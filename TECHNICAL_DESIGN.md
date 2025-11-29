# Technical Design Documentation

This document provides detailed technical information about the HeyMax SubCaps Viewer Tampermonkey userscript implementation.

## Architecture Overview

The HeyMax SubCaps Viewer uses network request interception to capture transaction data from the HeyMax API, store it locally, and calculate SubCap spending for UOB credit cards.

The Tampermonkey userscript is cross-browser compatible and works on desktop browsers (Chrome, Firefox, Safari, Opera, Edge) as well as Edge Mobile. Note: While Firefox Mobile and Kiwi Browser support Tampermonkey, the HeyMax.ai website doesn't work on them (redirects to app download).

## Network Request Interception

### Monkey Patching Approach

The implementation uses monkey patching to intercept network requests:

1. **Store Original References**: Save references to native `fetch()` and `XMLHttpRequest` objects
2. **Replace with Patched Versions**: Override with custom implementations that:
   - Forward requests to the original implementations
   - Intercept and log responses
   - Extract and store relevant API data
3. **Continuous Monitoring**: Check every second if patches have been overwritten
4. **Auto-Recovery**: Automatically re-apply patches if tampering is detected

### Patched fetch() Implementation

```javascript
// Store original fetch
const originalFetch = window.fetch;

// Replace with patched version
window.fetch = async function(...args) {
  const response = await originalFetch.apply(this, args);
  
  // Clone response to read body without consuming it
  const clonedResponse = response.clone();
  const url = args[0];
  
  // Log and process response data
  processResponse(url, clonedResponse);
  
  return response;
};
```

### Patched XMLHttpRequest Implementation

```javascript
// Store original XMLHttpRequest
const OriginalXHR = window.XMLHttpRequest;

// Create patched version
window.XMLHttpRequest = function() {
  const xhr = new OriginalXHR();
  
  // Intercept onload
  const originalOnLoad = xhr.onload;
  xhr.onload = function() {
    processResponse(xhr.responseURL, xhr.response);
    if (originalOnLoad) originalOnLoad.apply(this, arguments);
  };
  
  return xhr;
};
```

### Patch Monitoring

A continuous monitoring system checks every 1000ms if the patches are still active:

```javascript
setInterval(() => {
  if (window.fetch !== patchedFetch || window.XMLHttpRequest !== PatchedXHR) {
    console.warn('Patches overwritten, re-applying...');
    reapplyPatches();
  }
}, 1000);
```

## Data Storage Architecture

### Tampermonkey Storage

Uses Tampermonkey's GM storage API:

```javascript
// Store data
GM_setValue('cardData', JSON.stringify(data));

// Retrieve data
const data = JSON.parse(GM_getValue('cardData', '{}'));
```

### Storage Structure

Data is organized by card ID to support multiple cards:

```javascript
{
  cardData: {
    "7a30eab609ef58b841232633342ce19a": {
      "transactions": {
        data: { /* transaction array */ },
        timestamp: "2025-11-03T12:00:00.000Z",
        url: "https://heymax.ai/api/cards/7a30.../transactions",
        status: 200
      },
      "summary": {
        data: { /* summary object */ },
        timestamp: "2025-11-03T12:00:00.000Z",
        url: "https://heymax.ai/api/cards/7a30.../summary",
        status: 200
      },
      "card_tracker": {
        data: { /* card tracker object */ },
        timestamp: "2025-11-03T12:00:00.000Z",
        url: "https://heymax.ai/api/cards/7a30.../tracker",
        status: 200
      }
    },
    "9f45bc12de78a3c6b4e8d5f0a1c7e2b9": {
      // Another card's data...
    }
  }
}
```

### API Endpoint Detection

The system detects and stores data from these HeyMax API endpoints:

- **Transactions**: `/api/cards/{cardId}/transactions`
- **Summary**: `/api/cards/{cardId}/summary`
- **Card Tracker**: `/api/cards/{cardId}/tracker` or `/api/cards/{cardId}/details`

Card IDs are extracted from URLs using regex patterns.

## SubCap Calculation Engine

### UOB PPV (Preferred Platinum Visa) Logic

#### Contactless Bucket ($600 limit)
- Filters transactions where `payment_mode === 'contactless'`
- Excludes blacklisted transactions
- Rounds down each transaction to nearest $5
- Sums up to $600 maximum

#### Online Bucket ($600 limit)
- Filters transactions with eligible MCC codes (shopping, dining, entertainment)
- Excludes contactless transactions (to avoid double-counting)
- Excludes blacklisted transactions
- Rounds down each transaction to nearest $5
- Sums up to $600 maximum

**Eligible Online MCC Codes:**
- Clothing, electronics, department stores
- Restaurants, food delivery
- Entertainment, streaming services
- And more (see full list in code)

### UOB VS (Visa Signature) Logic

#### Foreign Currency Bucket ($1,200 limit, priority)
- Filters transactions where `currency !== 'SGD'`
- Excludes blacklisted transactions
- Sums all foreign currency transactions (no rounding)
- Counts up to $1,200 maximum
- **Note**: Foreign currency transactions are NOT counted in contactless bucket

#### Contactless Bucket ($1,200 limit)
- Filters transactions where `payment_mode === 'contactless'`
- Excludes foreign currency transactions (already counted above)
- Excludes blacklisted transactions
- Sums all eligible contactless transactions (no rounding)
- Counts up to $1,200 maximum

#### Bonus Miles Threshold
- Requires at least $1,000 spend in a bucket to earn bonus miles
- Displayed with yellow warning if below threshold

### Transaction Blacklist

Transactions are excluded if they match:

**Blacklisted MCC Codes:**
- Government services
- Bill payments
- Insurance
- Financial services
- Gambling
- And more (see full list in code)

**Blacklisted Merchant Prefixes:**
- EZ-LINK (transit)
- SIMPLYGO (transit)
- NETS (bill payments)
- AXS (bill payments)
- And more (see full list in code)

### Calculation Implementation

```javascript
function calculateSubCaps(transactions, cardType) {
  const filtered = filterTransactions(transactions);
  
  if (cardType === 'UOB PPV') {
    return {
      contactless: calculateContactlessPPV(filtered),
      online: calculateOnlinePPV(filtered)
    };
  } else if (cardType === 'UOB VS') {
    return {
      foreignCurrency: calculateForeignCurrencyVS(filtered),
      contactless: calculateContactlessVS(filtered)
    };
  }
}
```

## UI Components

### SubCaps Button

A floating button displayed on card detail pages:

**CSS Styling:**
```css
position: fixed;
bottom: 20px;
right: 20px;
background-color: #10b981;
color: white;
padding: 12px 24px;
border-radius: 8px;
cursor: pointer;
z-index: 10000;
```

**Visibility Logic:**
- Only shown on card detail pages (not the main cards list)
- Only shown for supported card types (UOB PPV or UOB VS)
- Only shown after transaction data is loaded
- Checks every 500ms for data availability

### SubCaps Overlay Modal

A modal overlay that displays calculated SubCap information:

**Structure:**
- Card name and type
- Total transactions analyzed
- Bucket 1 (Contactless or Foreign Currency)
  - Current amount
  - Limit
  - Progress bar with color coding
- Bucket 2 (Online or Contactless)
  - Current amount
  - Limit
  - Progress bar with color coding

**Color Coding:**
- **Green (< 90%)**: Safe zone
- **Yellow (90-99% or below $1,000 threshold for UOB VS)**: Warning
- **Red (≥ 100%)**: Limit reached or exceeded

## Tampermonkey Implementation Details

### Userscript Metadata

```javascript
// ==UserScript==
// @name         HeyMax SubCaps Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Track UOB SubCaps on HeyMax
// @match        https://heymax.ai/cards/your-cards/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==
```

### Key Features

1. **Runs directly in page context** - no separation between content/injected scripts
2. **Uses GM_getValue/GM_setValue** for persistent storage
3. **Automatic updates** via Tampermonkey's update mechanism
4. **Cross-browser compatible** (Chrome, Firefox, Safari, Opera, Edge Mobile)

## Testing

### Test Scenarios

1. **Network Interception**: Verify fetch/XHR are properly patched
2. **Data Storage**: Confirm data is stored correctly by card ID
3. **Button Visibility**: Test button appears only on supported cards
4. **Calculation Accuracy**: Verify SubCap calculations match expected values
5. **Patch Recovery**: Test automatic re-patching when overwritten

### Console Logging

The implementation provides detailed console logging:

```javascript
console.log('URL:', requestUrl);
console.log('Response Data:', responseData);
console.log('Stored card data:', cardData);
console.log('SubCaps calculated:', subcaps);
```

## Security & Privacy

### Data Privacy

- **No external transmission**: All data stays in local browser storage
- **Read-only operation**: Only intercepts and reads, never modifies requests
- **Minimal permissions**: Only runs on HeyMax domain
- **No tracking**: No analytics or telemetry

### Content Security Policy (CSP) Compatibility

The Tampermonkey implementation runs with elevated privileges via GM_* APIs, allowing it to work within browser CSP restrictions.

### Storage Security

- **Tampermonkey**: Uses GM storage (isolated per script)
- **No sensitive data storage**: Only stores transaction metadata visible in HeyMax UI

## Performance Considerations

### Memory Usage

- Stores only latest API responses per card
- Old data is overwritten, not accumulated
- Typical storage: <1MB for multiple cards

### CPU Usage

- Patch monitoring: Every 1000ms (minimal CPU impact)
- Button visibility check: Every 500ms (only on card pages)
- Calculation: On-demand when button clicked

### Network Impact

- **Zero additional network requests**: Only intercepts existing requests
- **No bandwidth overhead**: Clones responses without re-fetching

## Browser Compatibility

### Desktop Browsers

- **Chrome/Edge**: Full support with Tampermonkey
- **Firefox**: Full support with Tampermonkey or Greasemonkey
- **Safari**: Supported with Tampermonkey
- **Opera**: Supported with Tampermonkey

### Mobile Browsers

- **Edge Mobile (Recommended)**: Full Tampermonkey support on iOS and Android

**Note**: While Firefox Mobile and Kiwi Browser support Tampermonkey, the HeyMax.ai website doesn't work on them—it redirects users to download the app instead of loading the web interface.

## Troubleshooting Guide

### Userscript Not Running

**Symptoms**: No console logs, no button appearing

**Solutions**:
1. Verify Tampermonkey is installed and enabled
2. Check script is enabled in Tampermonkey dashboard
3. Confirm URL match pattern includes current page
4. Check console for script errors
5. Try disabling conflicting userscripts

### Button Not Appearing

**Symptoms**: Network interception works but no SubCaps button

**Possible Causes**:
1. Not on a card detail page (URL must include card ID)
2. Card type not supported (must be UOB PPV or UOB VS)
3. Transaction data not yet loaded
4. DOM insertion failed

**Debug Steps**:
1. Check console for "Button visibility check" logs
2. Verify `cardData` in storage contains transactions for current card
3. Inspect page DOM for button element
4. Check for JavaScript errors

### Calculation Discrepancies

**Symptoms**: SubCap numbers don't match expectations

**Possible Reasons**:
1. **Pending transactions**: Not yet synced to HeyMax
2. **MCC categorization**: Merchant category might differ from expected
3. **Blacklist rules**: Transaction excluded by filters
4. **Timing**: Data cached from earlier in billing cycle

**Verification Steps**:
1. Check raw transaction data in console
2. Verify transaction dates match current billing cycle
3. Review MCC codes of unexpected transactions
4. Compare with official UOB statement

### Patches Being Overwritten

**Symptoms**: Console shows "re-applying patches" warnings

**This is normal behavior** when:
- Other scripts also modify fetch/XHR
- Page navigation occurs
- React/Vue re-renders happen

**Auto-recovery** handles this automatically. No action needed unless errors occur.

### Storage Issues

**Symptoms**: Data not persisting between page loads

**Solutions**:
1. Check Tampermonkey dashboard → Storage tab
2. Verify script has GM_getValue/GM_setValue grants
3. Check browser console for GM_* errors
4. Try resetting storage: Delete all values and reload page

## Development Workflow

### Local Development

1. Clone repository
2. Copy userscript to Tampermonkey editor
3. Make changes to files
4. Save in Tampermonkey editor
5. Test on https://heymax.ai/cards/your-cards/

### Debugging Tips

1. **Use verbose logging**: Enable all console.log statements
2. **Inspect storage**: Check GM storage contents via Tampermonkey dashboard
3. **Monitor network**: Browser DevTools Network tab
4. **Step through code**: Use debugger statements and breakpoints

### Code Organization

```
tampermonkey/
├── heymax-subcaps-viewer.user.js  # Userscript (all-in-one)
└── README.md                       # Userscript documentation
```

## Future Enhancements

### Potential Features

- Support for additional UOB cards
- Historical spending trends
- Export to CSV
- Notifications when approaching limits
- Integration with UOB official API (if available)

### Known Limitations

- Depends on HeyMax API structure (may break if API changes)
- No real-time sync with UOB systems
- Limited to transactions visible in HeyMax
- Manual installation required (not in official stores)

## Contributing

For developers interested in contributing:

1. Review this technical documentation
2. Test changes thoroughly
3. Maintain backward compatibility with storage format
4. Update documentation for any API/logic changes

## License

See the main repository LICENSE file for details.
