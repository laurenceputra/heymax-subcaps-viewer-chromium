# HeyMax SubCaps Viewer - Chromium Extension

A Chrome extension using Manifest V3 that monitors network requests by monkey patching fetch() and XMLHttpRequest for UOB SubCaps calculation.

## Supported Cards

- **UOB PPV (Preferred Platinum Visa)**: Tracks contactless and eligible online transaction buckets ($600 limit each)
- **UOB VS (Visa Signature)**: Tracks contactless and foreign currency transaction buckets ($1200 limit each)

## Features

✅ **Network Request Monitoring**: Monkey patches `fetch()` and `XMLHttpRequest` to intercept all network requests  
✅ **URL and Response Logging**: Logs request URLs and response data to browser console  
✅ **Patch Protection**: Monitors to ensure monkey patches aren't overwritten by other scripts  
✅ **Auto-Recovery**: Automatically re-applies patches if they are detected as overwritten (checks every second)  
✅ **Focused Scope**: Only runs on https://heymax.ai/cards/your-cards/ pages and subpages  
✅ **Manifest V3**: Uses the latest Chrome extension standards

## Quick Start

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"** and select the `src` directory
4. Navigate to https://heymax.ai/cards/your-cards/ or any subpage
5. Open browser console (F12) to see logged URLs and response data

## Documentation

- **[EXTENSION_README.md](EXTENSION_README.md)** - Comprehensive extension documentation
- **[src/test/TESTING.md](src/test/TESTING.md)** - Detailed testing instructions
- **[src/test/test.html](src/test/test.html)** - Interactive test page to verify functionality

## How It Works

The extension injects a monitoring script that:
1. Stores references to original `fetch()` and `XMLHttpRequest` methods
2. Replaces them with patched versions to intercept network requests
3. Logs the URL and response data for each request to the browser console
4. Monitors every second to detect if patches are overwritten
5. Automatically restores patches if tampering is detected

## What Gets Logged

For each network request, the extension logs:
- **URL**: The request URL
- **Response Data**: The response body (JSON parsed if content-type is application/json, otherwise as text)

## Data Storage

The extension stores API data in Chrome's local storage organized by card ID:

```javascript
cardData: {
  "7a30eab609ef58b841232633342ce19a": {
    "transactions": { data: {...}, timestamp: "2025-11-02T12:00:00.000Z", url: "...", status: 200 },
    "summary": { data: {...}, timestamp: "2025-11-02T12:00:00.000Z", url: "...", status: 200 },
    "card_tracker": { data: {...}, timestamp: "2025-11-02T12:00:00.000Z", url: "...", status: 200 }
  },
  "9f45bc12de78a3c6b4e8d5f0a1c7e2b9": {
    "transactions": { data: {...}, timestamp: "2025-11-02T12:01:00.000Z", url: "...", status: 200 },
    "summary": { data: {...}, timestamp: "2025-11-02T12:01:00.000Z", url: "...", status: 200 },
    "card_tracker": { data: {...}, timestamp: "2025-11-02T12:01:00.000Z", url: "...", status: 200 }
  }
}
```

Each card ID maintains the latest values for:
- **transactions**: Latest transaction data for that card
- **summary**: Latest summary data for that card
- **card_tracker**: Card tracker data for that specific card (when viewed on detail pages like `/details` or `/reward-cycles`)

## Testing

Test files are available in `src/test/` for development and verification purposes.

See [src/test/TESTING.md](src/test/TESTING.md) for detailed instructions.

## License

See [LICENSE](LICENSE) file for details.
