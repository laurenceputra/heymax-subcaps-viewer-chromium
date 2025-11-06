# Track Your UOB Credit Card Subcaps — Simply & Privately

If you're using UOB PPV (Preferred Platinum Visa) or UOB VS (Visa Signature) cards through HeyMax, you know how frustrating it can be to manually track your subcap spend across different categories. Are you hitting your contactless limit? Have you maxed out your online spend bucket? Nobody wants to dig through transaction lists and do mental math just to know where they stand.

**This tool solves that problem.** It automatically tracks your spending across subcap categories and shows you exactly where you are—right when you need it.

## What This Does for You

### Visual Subcap Tracking at a Glance

No more spreadsheets. No more guesswork. When you're viewing your UOB card details on HeyMax, this tool adds a floating "Subcaps" button to your page. Click it, and you'll see:

- **For UOB PPV cardholders:**
  - Your contactless bucket spend (out of $600 limit)
  - Your eligible online transaction spend (out of $600 limit)

- **For UOB VS cardholders:**
  - Your contactless bucket spend (out of $1,200 limit)
  - Your foreign currency transaction spend (out of $1,200 limit)

The overlay uses color coding to help you understand your status instantly:
- **Green:** You're on track
- **Yellow (UOB VS only):** You haven't hit the $1,000 threshold yet to start earning bonus miles
- **Red:** You've reached or exceeded the limit for this bucket

**UOB PPV card subcaps overlay:**

![UOB PPV Subcaps Overlay](tampermonkey/assets/uob_ppv.jpg)

**UOB VS card subcaps overlay:**

![UOB VS Subcaps Overlay](tampermonkey/assets/uob_vs.jpg)

### Completely Private & Secure

Your transaction data is sensitive, and this tool treats it that way:

- **No external requests:** The tool doesn't send any data outside your browser. Not to us, not to anyone.
- **Read-only operation:** It only intercepts and reads the transaction data that HeyMax is already loading for you. It doesn't modify anything.
- **Local storage only:** All calculations happen in your browser, and data is stored locally.

This isn't some third-party service collecting your spending habits. It's a simple tool that works entirely on your machine, giving you visibility without compromising your privacy.

## Supported Cards

This tool currently supports:

- **UOB Preferred Platinum Visa (PPV)** — both buckets have a $600 limit and transactions are rounded down to the nearest $5:
  - Tracks contactless payments
  - Tracks eligible online transactions across shopping, dining, and entertainment MCCs

- **UOB Visa Signature (VS)** — both buckets have a $1,200 limit and require spending at least $1,000 to earn bonus miles:
  - Tracks contactless payments (excluding foreign currency)
  - Tracks foreign currency transactions in any currency other than SGD

## Getting Started

Choose your installation method based on your browser and preference:

### Chrome Extension (Recommended for Chrome/Edge Users)

**Quick & Easy Installation:**

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"** and select the `src` directory from this repository
4. Navigate to https://heymax.ai/cards/your-cards/ and view your card details
5. Click the green "Subcaps" button that appears in the bottom-right corner

The extension works only on Chrome and Edge browsers.

### Tampermonkey Userscript (Cross-Browser Alternative)

**Works on Firefox, Safari, Opera, and more:**

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser:
   - [Chrome/Edge](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojnmoofnopnkmjmkc)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Safari](https://apps.apple.com/app/tampermonkey/id1482490089)
   - [Opera](https://addons.opera.com/extensions/details/tampermonkey-beta/)
2. Click on the Tampermonkey icon and select "Create a new script..."
3. Copy the entire contents of `tampermonkey/heymax-subcaps-viewer.user.js`
4. Paste it into the Tampermonkey editor and save
5. Navigate to https://heymax.ai/cards/your-cards/ and view your card details
6. Click the green "Subcaps" button that appears in the bottom-right corner

See [tampermonkey/README.md](tampermonkey/README.md) for detailed instructions.

## How It Works (The Simple Version)

1. **Install** the Chrome Extension or Tampermonkey userscript
2. **Visit your card page** on HeyMax (https://heymax.ai/cards/your-cards/[your-card-id])
3. **Wait a moment** for the page to load your transaction data
4. **Click the green "Subcaps" button** that appears in the bottom-right corner
5. **See your spend breakdown** in a clean overlay

That's it. No configuration. No setup. It just works.

## FAQ

### Will this work with other credit cards?

Not yet. The tool is specifically designed for UOB PPV and UOB VS cards because they have unique subcap structures. We may add support for other cards in the future.

### Does this work on mobile?

It depends on your mobile browser. The Tampermonkey userscript works on mobile browsers that support userscript managers (like Firefox Mobile or Kiwi Browser on Android). Most standard mobile browsers (like Safari on iOS or Chrome on Android) don't support extensions or userscript managers by default.

### What if my subcap numbers don't match what UOB shows?

The tool calculates subcaps based on the transaction data visible in HeyMax. There can be slight discrepancies due to:
- Transactions that are pending or not yet synced
- Edge cases in merchant categorization
- Timing differences between HeyMax's data and UOB's systems

Use this as a helpful guide, not as your official record.

### Is this official? Is it supported by HeyMax or UOB?

No, this is an independent, open-source project. It's not affiliated with, endorsed by, or supported by HeyMax or UOB. Use it at your own discretion.

### Can I trust this with my financial data?

The code is open-source, so you can review it yourself. It doesn't send any data anywhere—everything stays in your browser. That said, you should always be cautious about what tools you install. Review the code, and if you're not comfortable, don't install it.

## Troubleshooting

**The "Subcaps" button isn't showing up:**
- Make sure you're on a card detail page (not the main card list page)
- Wait for the page to fully load transaction data (it can take a few seconds)
- Verify that your card is a UOB PPV or UOB VS card
- Check your browser console (F12) for any error messages

**The numbers look wrong:**
- Refresh the page to reload transaction data
- Check that all your transactions have loaded (scroll down to load more if needed)
- Remember that the tool only sees transactions that HeyMax has synced

**The tool isn't working at all:**
- **Chrome Extension**: Ensure Developer mode is enabled and the extension is loaded
- **Tampermonkey**: Ensure Tampermonkey is installed and enabled, and the script is active
- Verify you're on https://heymax.ai/cards/your-cards/* pages
- Try disabling other browser extensions that might conflict

## Documentation

- **[TECHNICAL_DESIGN.md](TECHNICAL_DESIGN.md)** - Comprehensive technical documentation including architecture overview, network interception details, data storage structure, SubCap calculation logic, and troubleshooting guide for developers and contributors
- **[EXTENSION_README.md](EXTENSION_README.md)** - Chrome extension specific documentation
- **[tampermonkey/README.md](tampermonkey/README.md)** - Tampermonkey userscript documentation
- **[src/test/TESTING.md](src/test/TESTING.md)** - Testing instructions for developers

## License

See [LICENSE](LICENSE) file for details.

---

**Made for UOB cardholders who just want to track their spending without the hassle.**
