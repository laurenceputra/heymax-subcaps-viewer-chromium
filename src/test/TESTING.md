# Testing Guide for HeyMax SubCaps Viewer Extension

## Note: Silent Operation

**Important:** The extension now operates silently without console logging or data storage. This testing guide is provided for development purposes. To verify the extension is working, you would need to temporarily add console.log statements to the code or use browser debugging tools to inspect the patched functions.

## Manual Testing Instructions

### 1. Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **"Load unpacked"**
4. Select the `src` directory from the repository
5. Verify the extension appears in the list with a green icon

### 2. Verify Extension is Loaded

Since the extension operates silently:
1. Check that the extension appears in `chrome://extensions/` and is enabled
2. The extension icon should show in the extensions list
3. No console output will be visible

### 3. Testing with Temporary Logging (Development Only)

To verify the extension is working during development, you can temporarily add console.log statements:

**In `src/injected.js`:**
- Add `console.log('Patch applied')` in the `patchFetch()` and `patchXHR()` functions
- Add `console.log('Monitoring...', window.fetch === monkeyPatchedFetch)` in the `monitorPatches()` function

**Test the modifications:**
1. Reload the extension in chrome://extensions/
2. Open a test page
3. Check the console for your temporary log messages
4. Remove the console.log statements when done testing

### 4. Advanced Testing with Browser DevTools

You can verify patches are applied by:
1. Opening DevTools Console
2. Checking if `window.fetch` has been replaced: `console.log(window.fetch.toString())`
3. Checking XMLHttpRequest: `console.log(XMLHttpRequest.prototype.open.toString())`

The functions should show the patched versions (monkeyPatchedFetch, monkeyPatchedXHROpen).

## Troubleshooting

### Extension Not Working
- Verify Developer Mode is enabled in chrome://extensions/
- Check that the extension is enabled (toggle should be ON)
- Reload the extension after making any changes
- Since the extension operates silently, verification requires inspection of the patched functions

### Verifying Patches Are Applied
- Open DevTools Console
- Run: `console.log(window.fetch.toString())`
- You should see the patched function code
- Run: `console.log(XMLHttpRequest.prototype.open.toString())`
- You should see the patched XHR code

### Patches Not Being Applied
- Check for JavaScript errors in the console
- Verify `injected.js` is being loaded (check Network tab in DevTools)
- Ensure the extension has proper permissions
- Try reloading the extension

## Security Considerations

- The extension monitors ALL network requests on ALL websites
- No data is logged or stored
- No data is transmitted externally
- The extension operates completely silently

## Test Page

A test page is provided at `test.html` for development purposes. Note that since the extension no longer logs to console, you'll need to add temporary logging statements to verify functionality during testing.
