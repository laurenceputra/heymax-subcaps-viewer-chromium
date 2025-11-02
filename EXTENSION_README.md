# HeyMax SubCaps Viewer Chrome Extension

A Chrome extension using Manifest V3 that monitors network requests by monkey patching fetch() and XMLHttpRequest, logs API responses, and ensures the patches are not overwritten.

## Features

- **Network Request Interception**: Monkey patches `fetch()` and `XMLHttpRequest` to intercept all network requests
- **API Response Logging**: Automatically logs API responses to the console and stores them in chrome.storage
- **Patch Monitoring**: Continuously monitors to ensure monkey patches aren't overwritten by other scripts
- **Auto-Recovery**: Automatically re-applies patches if they are detected as overwritten

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked"
4. Select the `src` directory from this repository

## Usage

Once installed, the extension will automatically:

1. Inject monitoring scripts into all web pages
2. Intercept all network requests (fetch and XMLHttpRequest)
3. Log API responses to the browser console
4. Store recent API responses in chrome.storage.local (last 100 responses)
5. Monitor and alert if patches are overwritten

### Viewing Logged Data

**In the Browser Console:**
- Open Developer Tools (F12 or Ctrl+Shift+I)
- Look for messages prefixed with `[Network Monitor]`
- API responses are logged with green colored headers

**In Chrome Storage:**
```javascript
// View stored API responses in console
chrome.storage.local.get(['apiResponses'], function(result) {
  console.log(result.apiResponses);
});
```

## File Structure

```
.
├── .gitignore
├── LICENSE
├── README.md              # Main repository README
├── EXTENSION_README.md    # This file - extension documentation
└── src/
    ├── manifest.json      # Extension manifest (Manifest V3)
    ├── content.js         # Content script that injects the monitoring script
    ├── injected.js        # Main monkey patching and monitoring logic
    ├── calculate_buckets.js  # Pre-existing application logic
    ├── assets/
    │   ├── icon16.png     # Extension icon (16x16)
    │   ├── icon48.png     # Extension icon (48x48)
    │   └── icon128.png    # Extension icon (128x128)
    └── test/
        ├── test.html      # Interactive test page for manual testing
        └── TESTING.md     # Testing instructions and guidelines
```

## How It Works

1. **Content Script Injection** (`content.js`):
   - Runs at document_start before any page scripts
   - Injects the monitoring script into the page context
   - Listens for API response events and stores them

2. **Network Monitoring** (`injected.js`):
   - Stores references to original `fetch()` and `XMLHttpRequest` methods
   - Replaces them with patched versions that log responses
   - Checks every second if patches have been overwritten
   - Re-applies patches automatically if needed

3. **Response Logging**:
   - JSON responses are parsed and logged
   - Small text responses are also logged
   - Each response includes method, URL, status, and data
   - Responses are dispatched as custom events for the content script

## Security & Privacy

- The extension requires `<all_urls>` permission to monitor network requests on all sites
- API responses are stored locally in chrome.storage.local
- No data is transmitted to external servers
- Storage is limited to the last 100 responses to prevent excessive memory usage

## Development

The extension uses Manifest V3 with:
- `content_scripts` for early injection
- `web_accessible_resources` to allow injected script access
- `storage` permission for local data persistence
- `host_permissions` for all URLs to enable comprehensive monitoring

## Troubleshooting

**Extension not working:**
- Check that Developer Mode is enabled in chrome://extensions/
- Verify the extension is enabled
- Reload the extension after making changes

**Not seeing logs:**
- Open the browser console (F12)
- Refresh the page to ensure scripts are injected
- Check for any error messages in the console

**Patches being overwritten:**
- The extension will automatically detect this and re-apply patches
- Look for red "ALERT" messages in the console
- This is normal behavior if other scripts also modify network methods
