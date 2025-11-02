# Testing Guide for HeyMax SubCaps Viewer Extension

## Manual Testing Instructions

### 1. Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **"Load unpacked"**
4. Select the `src` directory from the repository
5. Verify the extension appears in the list with a green icon

### 2. Test the Extension

#### Option A: Use the Included Test Page

1. Open `test.html` in Chrome (you can use `file://` or run a local server)
2. Open Developer Tools (F12 or Ctrl+Shift+I)
3. Check the Console tab for initialization messages:
   - Look for `[Network Monitor] Initializing network request monitoring...`
   - Look for `[Network Monitor] Monitoring active!`

#### Option B: Test on Any Website

1. Navigate to any website (e.g., https://jsonplaceholder.typicode.com)
2. Open Developer Tools Console
3. Watch for `[Network Monitor]` messages as the page loads

### 3. Verify Network Request Interception

**Test Fetch API:**
1. In the test page, click **"Fetch JSON Data"** button
2. Check console for:
   - `[Network Monitor] Intercepted fetch: GET https://...`
   - `[Network Monitor] API Response Logged` (in green)
   - Full response data logged

**Test XMLHttpRequest:**
1. Click **"XHR JSON Request"** button
2. Check console for:
   - `[Network Monitor] Intercepted XHR: GET https://...`
   - Response details logged

### 4. Test Patch Protection

1. Click **"Try to Overwrite Patches"** button
2. This simulates a malicious script overwriting the patches
3. Within 1 second, you should see in console:
   - `[Network Monitor] ALERT: fetch() was overwritten! Re-applying patch...` (in red)
   - `[Network Monitor] ALERT: XMLHttpRequest.open() was overwritten! Re-applying patch...` (in red)
4. Verify patches are restored automatically

### 5. Verify Data Storage

Open the console and run:
```javascript
chrome.storage.local.get(['apiResponses'], function(result) {
  console.log('Stored responses:', result.apiResponses);
});
```

You should see an array of recent API responses (up to 100).

## Expected Console Output

### On Page Load:
```
[HeyMax SubCaps Viewer] Content script loaded
[Network Monitor] Initializing network request monitoring...
[Network Monitor] fetch() has been patched
[Network Monitor] XMLHttpRequest has been patched
[Network Monitor] Monitoring active!
[HeyMax SubCaps Viewer] Injected script loaded successfully
[HeyMax SubCaps Viewer] Content script initialized
```

### On Network Request:
```
[Network Monitor] Intercepted fetch: GET https://api.example.com/data
[Network Monitor] API Response Logged ✓ (in green)
Method: GET
URL: https://api.example.com/data
Status: 200
Response Data: {...}
---
[HeyMax SubCaps Viewer] API Response received in content script:
  Timestamp: 2025-11-02T06:49:53.585Z
  Method: GET
  URL: https://api.example.com/data
  Status: 200
[HeyMax SubCaps Viewer] Response stored in chrome.storage
```

### On Patch Override Detection:
```
[Network Monitor] ALERT: fetch() was overwritten! Re-applying patch... ⚠️ (in red)
[Network Monitor] fetch() has been patched
```

## Troubleshooting

### Extension Not Working
- Verify Developer Mode is enabled in chrome://extensions/
- Check that the extension is enabled (toggle should be ON)
- Reload the extension after making any changes
- Refresh the test page

### Not Seeing Console Messages
- Ensure Developer Tools are open
- Check you're looking at the correct Console tab
- Try refreshing the page
- Verify the extension is loaded and enabled

### Patches Not Being Applied
- Check for JavaScript errors in the console
- Verify `injected.js` is being loaded (check Network tab)
- Ensure the extension has proper permissions

## Security Considerations

- The extension monitors ALL network requests on ALL websites
- API responses are stored locally in browser storage
- No data is transmitted externally
- Storage is limited to last 100 responses to prevent memory issues

## Test Page Screenshot

![Test Page Screenshot](https://github.com/user-attachments/assets/dbcb8536-1b02-4581-83e9-051465fd2202)

The test page provides interactive buttons to test all extension features including:
- Fetch API interception
- XMLHttpRequest interception
- Patch protection and auto-recovery
