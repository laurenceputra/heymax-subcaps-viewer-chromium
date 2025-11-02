# HeyMax SubCaps Viewer Chrome Extension

A Chrome extension using Manifest V3 that monitors network requests by monkey patching fetch() and XMLHttpRequest, and ensures the patches are not overwritten.

## Features

- **Network Request Interception**: Monkey patches `fetch()` and `XMLHttpRequest` to intercept all network requests
- **URL and Response Logging**: Logs request URLs and response data to browser console
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
3. Log the URL and response data to the browser console
4. Monitor for patches being overwritten
5. Automatically re-apply patches if tampering is detected

### Viewing Logged Data

Open the browser console (F12 or Ctrl+Shift+I) to see:
- **URL**: The request URL for each network request
- **Response Data**: The response body (JSON parsed if content-type is application/json, otherwise as text)

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
   - Replaces them with patched versions that maintain interception
   - Checks every second if patches have been overwritten
   - Re-applies patches automatically if needed

## Security & Privacy

- The extension requires `<all_urls>` permission to monitor network requests on all sites
- URLs and response data are logged to the browser console only
- No data is stored or transmitted to external servers
- All data remains local to your browser session

## Development

The extension uses Manifest V3 with:
- `content_scripts` for early injection
- `web_accessible_resources` to allow injected script access
- `host_permissions` for all URLs to enable comprehensive monitoring

## Troubleshooting

**Extension not working:**
- Check that Developer Mode is enabled in chrome://extensions/
- Verify the extension is enabled
- Reload the extension after making changes

**Verifying the extension is active:**
- Open browser console (F12) and navigate to any website
- You should see "URL:" and "Response Data:" logs for each network request
- Check that the extension appears in chrome://extensions/ and is enabled

**Patches being overwritten:**
- The extension automatically detects and re-applies patches every second
- This happens automatically to maintain interception
- URL and response logging will continue uninterrupted
