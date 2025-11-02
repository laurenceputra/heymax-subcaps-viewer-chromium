# HeyMax SubCaps Viewer - Chromium Extension

A Chrome extension using Manifest V3 that monitors network requests and logs API responses for UOB SubCaps calculation.

## Features

✅ **Network Request Monitoring**: Monkey patches `fetch()` and `XMLHttpRequest` to intercept all network requests  
✅ **API Response Logging**: Automatically logs all API responses to console and stores in chrome.storage  
✅ **Patch Protection**: Monitors to ensure monkey patches aren't overwritten by other scripts  
✅ **Auto-Recovery**: Automatically re-applies patches if they are detected as overwritten (checks every second)  
✅ **Manifest V3**: Uses the latest Chrome extension standards  

## Quick Start

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"** and select this directory
4. Open any website and check the browser console for `[Network Monitor]` messages

## Documentation

- **[EXTENSION_README.md](EXTENSION_README.md)** - Comprehensive extension documentation
- **[TESTING.md](TESTING.md)** - Detailed testing instructions
- **[test.html](test.html)** - Interactive test page to verify functionality

## How It Works

The extension injects a monitoring script that:
1. Stores references to original `fetch()` and `XMLHttpRequest` methods
2. Replaces them with patched versions that log all API responses
3. Monitors every second to detect if patches are overwritten
4. Automatically restores patches if tampering is detected

## Testing

Open `test.html` in Chrome to interactively test:
- Fetch API interception
- XMLHttpRequest interception  
- Patch protection and recovery

See [TESTING.md](TESTING.md) for detailed instructions.

## License

See [LICENSE](LICENSE) file for details.
