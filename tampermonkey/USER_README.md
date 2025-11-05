# Track Your UOB Credit Card Subcaps — Simply & Privately

If you're using UOB PPV (Preferred Platinum Visa) or UOB VS (Visa Signature) cards through HeyMax, you know how frustrating it can be to manually track your subcap spend across different categories. Are you hitting your contactless limit? Have you maxed out your online spend bucket? Nobody wants to dig through transaction lists and do mental math just to know where they stand.

**This Tampermonkey userscript solves that problem.** It automatically tracks your spending across subcap categories and shows you exactly where you are—right when you need it.

## What This Script Does for You

### Visual Subcap Tracking at a Glance

No more spreadsheets. No more guesswork. When you're viewing your UOB card details on HeyMax, this script adds a floating "Subcaps" button to your page. Click it, and you'll see:

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

*[Screenshot placeholder: Show the subcaps overlay displaying bucket information for a UOB PPV card]*

*[Screenshot placeholder: Show the subcaps overlay displaying bucket information for a UOB VS card]*

### Completely Private & Secure

Your transaction data is sensitive, and this script treats it that way:

- **No external requests:** The script doesn't send any data outside your browser. Not to us, not to anyone.
- **Read-only operation:** It only intercepts and reads the transaction data that HeyMax is already loading for you. It doesn't modify anything.
- **Local storage only:** All calculations happen in your browser, and data is stored locally using Tampermonkey's secure storage.

This isn't some third-party service collecting your spending habits. It's a simple tool that works entirely on your machine, giving you visibility without compromising your privacy.

## How It Works (The Simple Version)

1. **Install Tampermonkey** in your browser (if you haven't already)
2. **Add this userscript** to Tampermonkey
3. **Visit your card page** on HeyMax (https://heymax.ai/cards/your-cards/[your-card-id])
4. **Wait a moment** for the page to load your transaction data
5. **Click the green "Subcaps" button** that appears in the bottom-right corner
6. **See your spend breakdown** in a clean overlay

*[Screenshot placeholder: Show the green "Subcaps" button appearing on a HeyMax card detail page]*

That's it. No configuration. No setup. It just works.

## What Makes This Script Different?

### It's Built for Real Users

This isn't a technical tool for developers—it's designed for anyone who wants better visibility into their card spending. The interface is clean, the information is clear, and you don't need to understand how subcaps work to benefit from it.

### It Respects Your Privacy

Many browser extensions and scripts these days want to "phone home" with your data. This script doesn't. It's completely transparent about what it does: it reads transaction data that's already loading in your browser and calculates your subcap spend locally. Nothing more.

### It Saves You Time

Before this script, tracking subcaps meant:
- Mentally filtering which transactions count toward which bucket
- Manually calculating totals
- Remembering special rules (like rounding down to the nearest $5 for UOB PPV)
- Hoping you didn't miss anything

Now? Click a button. Done.

## Supported Cards

This script currently supports:

- **UOB Preferred Platinum Visa (PPV):**
  - Tracks contactless payments (rounded down to nearest $5, max $600)
  - Tracks eligible online transactions across shopping, dining, and entertainment MCCs (rounded down to nearest $5, max $600)

- **UOB Visa Signature (VS):**
  - Tracks contactless payments excluding foreign currency (max $1,200, must exceed $1,000 to earn bonus miles)
  - Tracks foreign currency transactions in any currency other than SGD (max $1,200, must exceed $1,000 to earn bonus miles)

## Installation

### Step 1: Install Tampermonkey

Tampermonkey is a popular userscript manager that's available for most browsers:

- **Chrome/Edge:** [Get it from Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojnmoofnopnkmjmkc)
- **Firefox:** [Get it from Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- **Safari:** [Get it from App Store](https://apps.apple.com/app/tampermonkey/id1482490089)
- **Opera:** [Get it from Opera add-ons](https://addons.opera.com/extensions/details/tampermonkey-beta/)

### Step 2: Install the Script

1. Click on the Tampermonkey icon in your browser toolbar
2. Select "Create a new script..."
3. Delete the default template
4. Copy the entire contents of [`heymax-subcaps-viewer.user.js`](heymax-subcaps-viewer.user.js) from this repository
5. Paste it into the Tampermonkey editor
6. Click File → Save (or press Ctrl+S / Cmd+S)

That's it! The script will now automatically activate when you visit your HeyMax card pages.

## FAQ

### Will this work with other credit cards?

Not yet. The script is specifically designed for UOB PPV and UOB VS cards because they have unique subcap structures. We may add support for other cards in the future.

### Does this work on mobile?

It depends on your mobile browser. If your mobile browser supports Tampermonkey (like Firefox Mobile or Kiwi Browser on Android), then yes. Most standard mobile browsers (like Safari on iOS or Chrome on Android) don't support userscript managers by default.

### What if my subcap numbers don't match what UOB shows?

The script calculates subcaps based on the transaction data visible in HeyMax. There can be slight discrepancies due to:
- Transactions that are pending or not yet synced
- Edge cases in merchant categorization
- Timing differences between HeyMax's data and UOB's systems

Use this as a helpful guide, not as your official record.

### Is this official? Is it supported by HeyMax or UOB?

No, this is an independent, open-source project. It's not affiliated with, endorsed by, or supported by HeyMax or UOB. Use it at your own discretion.

### Can I trust this script with my financial data?

The script is open-source, so you can review the code yourself. It doesn't send any data anywhere—everything stays in your browser. That said, you should always be cautious about what scripts you install. Review the code, and if you're not comfortable, don't install it.

## Troubleshooting

**The "Subcaps" button isn't showing up:**
- Make sure you're on a card detail page (not the main card list page)
- Wait for the page to fully load transaction data (it can take a few seconds)
- Verify that your card is a UOB PPV or UOB VS card
- Check your browser console for any error messages

**The numbers look wrong:**
- Refresh the page to reload transaction data
- Check that all your transactions have loaded (scroll down to load more if needed)
- Remember that the script only sees transactions that HeyMax has synced

**The script isn't working at all:**
- Ensure Tampermonkey is installed and enabled
- Check that the script is enabled in Tampermonkey's dashboard
- Verify you're on https://heymax.ai/cards/your-cards/* pages
- Try disabling other browser extensions that might conflict

## For Technical Users

If you want more details about how this script works under the hood, or if you're a developer interested in contributing, check out the [technical README](README.md) in this directory.

## License

This project is open-source. See the [LICENSE](../LICENSE) file for details.

---

**Made for UOB cardholders who just want to track their spending without the hassle.**
