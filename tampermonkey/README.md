# HeyMax SubCaps Viewer - Tampermonkey Script

This Tampermonkey userscript provides the same functionality as the Chrome extension, allowing you to monitor network requests and calculate SubCaps for UOB credit cards on HeyMax.

## Features

✅ **Network Request Monitoring**: Monkey patches `fetch()` and `XMLHttpRequest` to intercept all network requests  
✅ **URL and Response Logging**: Logs request URLs and response data to browser console  
✅ **Patch Protection**: Monitors to ensure monkey patches aren't overwritten by other scripts  
✅ **Auto-Recovery**: Automatically re-applies patches if they are detected as overwritten (checks every second)  
✅ **SubCaps Button**: Displays a floating "subcaps" button on supported card pages  
✅ **SubCaps Overlay**: Shows calculated SubCaps data in an overlay modal  
✅ **Multi-Card Support**: Automatically detects and displays appropriate SubCaps information for UOB PPV and UOB VS cards  
✅ **Local Storage**: Uses Tampermonkey's GM_getValue/GM_setValue for data persistence

## Supported Cards

- **UOB PPV (Preferred Platinum Visa)**: Tracks contactless and eligible online transaction buckets ($600 limit each)
- **UOB VS (Visa Signature)**: Tracks contactless and foreign currency transaction buckets ($1200 limit each)

## Installation

### Prerequisites

1. Install a userscript manager browser extension:
   - **Chrome/Edge**: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojnmoofnopnkmjmkc)
   - **Firefox**: [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
   - **Safari**: [Tampermonkey](https://apps.apple.com/app/tampermonkey/id1482490089)
   - **Opera**: [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/)
   - **Edge Mobile**: Install Tampermonkey from the list of extensions

### Installation Steps

1. Install Tampermonkey (or another userscript manager) in your browser
2. Click on the Tampermonkey icon in your browser toolbar
3. Select "Create a new script..."
4. Delete the default template
5. Copy the entire contents of `heymax-subcaps-viewer.user.js`
6. Paste it into the Tampermonkey editor
7. Click File → Save (or press Ctrl+S / Cmd+S)
8. Navigate to https://heymax.ai/cards/your-cards/ and the script will activate automatically

## Usage

Once installed, the script will automatically:

1. Monitor all network requests on https://heymax.ai/cards/your-cards/* pages
2. Intercept and log API responses to the browser console
3. Store transaction data in Tampermonkey's storage
4. Display a "subcaps" button on supported card detail pages (UOB PPV or UOB VS)
5. Show calculated SubCaps data when you click the button

### Viewing SubCaps Data

1. Navigate to a supported card detail page (e.g., https://heymax.ai/cards/your-cards/[card-id])
2. Wait for the page to load and make API calls to fetch card and transaction data
3. Once data is loaded, a green "subcaps" button will appear in the bottom-right corner
4. Click the button to view your SubCaps analysis in an overlay modal
5. The modal shows:
   - Total transactions analyzed
   - Contactless bucket amount and limit
   - Online bucket (UOB PPV) or Foreign Currency bucket (UOB VS) amount and limit

### Viewing Console Logs

Open the browser console (F12 or Ctrl+Shift+I) to see:
- Network request interception logs
- API response data
- Storage operations
- Button visibility checks

## How It Works

### Network Monitoring

The script intercepts network requests by:
1. Storing references to original `fetch()` and `XMLHttpRequest` methods
2. Replacing them with patched versions that log API responses
3. Monitoring every second to detect if patches are overwritten
4. Automatically restoring patches if tampering is detected

### Data Storage

The script uses Tampermonkey's `GM_getValue` and `GM_setValue` to store API data in a structure organized by card ID:

```javascript
cardData: {
  "7a30eab609ef58b841232633342ce19a": {
    "transactions": { data: {...}, timestamp: "2025-11-03T12:00:00.000Z", url: "...", status: 200 },
    "summary": { data: {...}, timestamp: "2025-11-03T12:00:00.000Z", url: "...", status: 200 },
    "card_tracker": { data: {...}, timestamp: "2025-11-03T12:00:00.000Z", url: "...", status: 200 }
  }
}
```

### SubCaps Calculation

The script calculates SubCaps based on:
- **UOB PPV**:
  - Contactless bucket: Contactless transactions rounded down to nearest $5 (max $600)
  - Online bucket: Eligible online transactions (specific MCC codes) rounded down to nearest $5 (max $600)
- **UOB VS**:
  - Contactless bucket: Contactless transactions (excluding those counted in foreign currency bucket) (max $1200)
  - Foreign Currency bucket: Non-SGD transactions (takes priority over contactless) (max $1200)

Transactions are filtered to exclude:
- Blacklisted MCC codes (bill payments, government services, etc.)
- Blacklisted merchant name prefixes (transit, forex, etc.)

## Comparison with Chrome Extension

| Feature | Chrome Extension | Tampermonkey Script |
|---------|------------------|---------------------|
| Network monitoring | ✅ | ✅ |
| API response logging | ✅ | ✅ |
| Patch protection | ✅ | ✅ |
| SubCaps button | ✅ | ✅ |
| SubCaps calculation | ✅ | ✅ |
| Data persistence | Chrome Storage API | Tampermonkey GM storage |
| Installation | Load unpacked extension | Install userscript |
| Cross-browser | Chrome/Edge only | Chrome, Firefox, Safari, Opera |
| Update mechanism | Manual reload | Tampermonkey auto-update |

## Troubleshooting

**Script not working:**
- Ensure Tampermonkey is installed and enabled
- Check that the script is enabled in Tampermonkey dashboard
- Verify you're on a https://heymax.ai/cards/your-cards/* page
- Check browser console for error messages

**SubCaps button not appearing:**
- Ensure you're on a card detail page (not the main cards list)
- Wait for the page to load transaction data
- Check browser console for visibility check logs
- Verify the card is a supported type (UOB PPV or UOB VS)

**Patches being overwritten:**
- The script automatically detects and re-applies patches every second
- Check console for re-patching warnings
- This is normal behavior if other scripts modify fetch/XHR

**Data not persisting:**
- Tampermonkey storage is isolated per script
- Clearing browser data may not affect Tampermonkey storage
- To reset, open Tampermonkey dashboard → Storage → Delete values

## Security & Privacy

- The script only runs on https://heymax.ai/cards/your-cards/* pages
- All data is stored locally in Tampermonkey's storage
- No data is transmitted to external servers
- Network logs are only visible in your browser console
- Uses Tampermonkey's secure storage API (GM_getValue/GM_setValue)

## License

This script is part of the HeyMax SubCaps Viewer project. See the main repository LICENSE file for details.
