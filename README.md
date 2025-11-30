# Track Your UOB Credit Card Subcaps — Simply & Privately

If you're using UOB PPV (Preferred Platinum Visa) or UOB VS (Visa Signature) cards through HeyMax, you know how frustrating it can be to manually track your subcap spend across different categories. Are you hitting your contactless limit? Have you maxed out your online spend bucket? Nobody wants to dig through transaction lists and do mental math just to know where they stand.

**This Tampermonkey userscript solves that problem.** It automatically tracks your spending across subcap categories and shows you exactly where you are—right when you need it.

## Features

✅ **Visual Subcap Tracking**: See your spending buckets at a glance with color-coded progress indicators  
✅ **Automatic Updates**: Your subcap data updates automatically as you browse HeyMax  
✅ **Multi-Card Support**: Works with both UOB PPV and UOB VS cards  
✅ **Privacy-First**: All data stays in your browser—nothing sent to external servers  
✅ **Always Working**: The script keeps running reliably in the background  
✅ **Remembers Your Data**: Your subcap information is saved locally on your device and stays completely private—no waiting for it to reload each time

## Screenshots

The overlay uses color coding to help you understand your status instantly:
- **Green:** You're on track
- **Yellow (UOB VS only):** You haven't hit the $1,000 threshold yet to start earning bonus miles
- **Red:** You've reached or exceeded the limit for this bucket

**UOB PPV card subcaps overlay:**

![UOB PPV Subcaps Overlay](assets/uob_ppv.jpg)

**UOB VS card subcaps overlay:**

![UOB VS Subcaps Overlay](assets/uob_vs.jpg)

## Installation

### Desktop Browsers (Recommended)

**Works on Chrome, Firefox, Safari, Opera, and Edge:**

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser:
   - [Chrome/Edge](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojnmoofnopnkmjmkc)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
   - [Safari](https://apps.apple.com/app/tampermonkey/id1482490089)
   - [Opera](https://addons.opera.com/extensions/details/tampermonkey-beta/)
2. Open the [raw script file](https://github.com/laurenceputra/heymax-subcaps-viewer/raw/refs/heads/main/src/heymax-subcaps-viewer.user.js) in your browser
3. Tampermonkey will automatically detect the userscript and prompt you to install it
4. Click **Install** to add the script
5. Navigate to https://heymax.ai/cards/your-cards/ and view your card details
6. Click the green "Subcaps" button that appears in the bottom-right corner

### Edge Mobile (Mobile Alternative)

**Prefer using HeyMax on your phone instead of on the desktop?** Edge Mobile is the only mobile browser that supports Tampermonkey extensions AND works with HeyMax.ai (Firefox Mobile and Kiwi Browser redirect to app download instead of loading the website).

**Why use Edge Mobile with this script?**
- Get subcap tracking on mobile (not available in the official HeyMax app)
- Access all HeyMax.ai website features in your browser
- All calculations stay private on your device

**Installation steps:**

1. Install **Microsoft Edge** browser on your mobile device ([iOS](https://apps.apple.com/app/microsoft-edge/id1288723196) / [Android](https://play.google.com/store/apps/details?id=com.microsoft.emmx))
2. Open Edge, tap **≡** (menu) → **Extensions** → **Get extensions from store**
3. Search for **Tampermonkey** and install it
4. Open the [raw script file](https://github.com/laurenceputra/heymax-subcaps-viewer/raw/refs/heads/main/src/heymax-subcaps-viewer.user.js) in your browser
5. Tampermonkey will automatically detect the userscript and prompt you to install it
6. Click **Install** to add the script
7. Navigate to https://heymax.ai/cards/your-cards/ and view your card details
8. Click the green "Subcaps" button that appears in the bottom-right corner

## Post-Installation Setup

### Add HeyMax to Your Homescreen (Mobile Only)

For quick access like a native app, add HeyMax to your homescreen:

**On iOS (Edge Mobile):**
1. Open https://heymax.ai in Edge
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Name it "HeyMax" and tap **Add**

**On Android (Edge Mobile):**
1. Open https://heymax.ai in Edge
2. Tap the **menu** (three dots)
3. Tap **Add to phone** or **Add to Home screen**
4. Confirm by tapping **Add**

Now you can launch HeyMax directly from your homescreen—just like an app!

### What's Next?

Once installed, the script works automatically in the background. Here's how to check your subcaps:

1. Open HeyMax and go to your card detail page (e.g., https://heymax.ai/cards/your-cards/[card-id])
2. Wait for the page to load your transaction data (a few seconds)
3. Look for the green "Subcaps" button in the bottom-right corner
4. Click the button to view your subcap analysis with color-coded progress bars

Your subcap data will be tracked automatically as you browse HeyMax. Just visit your card page and click the "Subcaps" button anytime you want to check your progress!

## Supported Cards

- **UOB Preferred Platinum Visa (PPV)** — both buckets have a $600 limit and transactions are rounded down to the nearest $5:
  - Tracks contactless payments
  - Tracks eligible online transactions across shopping, dining, and entertainment MCCs

- **UOB Visa Signature (VS)** — both buckets have a $1,200 limit and require spending at least $1,000 to earn bonus miles:
  - Tracks contactless payments (excluding foreign currency)
  - Tracks foreign currency transactions in any currency other than SGD

## FAQ

### Will this work with other credit cards?

Not yet. The script is specifically designed for UOB PPV and UOB VS cards because they have unique subcap structures. We may add support for other cards in the future.

### What if my subcap numbers don't match what UOB shows?

The script calculates subcaps based on the transaction data visible in HeyMax. There can be slight discrepancies due to:
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
- Wait for the page to fully load (it can take a few seconds)
- Verify that your card is a UOB PPV or UOB VS card

**The numbers look wrong:**
- Refresh the page to reload transaction data
- Check that all your transactions have loaded (scroll down to load more if needed)
- Remember that the script only sees transactions that HeyMax has synced

**The script isn't working at all:**
- Ensure Tampermonkey is installed and enabled
- Verify the script is active in Tampermonkey's dashboard
- Try disabling other browser extensions that might conflict

## Security & Privacy

Your transaction data is sensitive, and this script treats it that way:

- **No external requests:** The script doesn't send any data outside your browser. Not to us, not to anyone.
- **Read-only operation:** It only intercepts and reads the transaction data that HeyMax is already loading for you. It doesn't modify anything.
- **Local storage only:** All calculations happen in your browser, and data is stored locally using Tampermonkey's secure storage.
- **Minimal permissions:** Only runs on HeyMax domain

This isn't some third-party service collecting your spending habits. It's a simple tool that works entirely on your machine, giving you visibility without compromising your privacy.

## Documentation

For developers and contributors:

- **[docs/TECHNICAL_DESIGN.md](docs/TECHNICAL_DESIGN.md)** - Comprehensive technical documentation including architecture overview, network interception details, data storage structure, SubCap calculation logic, and troubleshooting guide

## Contributing

This project uses a structured multi-role development workflow to ensure quality implementations. When working on new features or bug fixes, the workflow follows a Product Manager → Staff Engineer → QA sequence.

### Development Workflow

**For Feature Development (STRICT mode):**
1. **Product Manager Analysis** - Define requirements, user stories, and acceptance criteria
2. **Staff Engineer Implementation** - Design and implement the technical solution
3. **QA Testing** - Verify implementation meets acceptance criteria

**For Bug Fixes (FLEXIBLE mode):**
1. **Staff Engineer Fix** - Diagnose and implement the fix
2. **QA Validation** - Verify fix works and no regressions

### How to Contribute

When submitting issues or pull requests:

1. **Classify your task**: Is it a FEATURE (new functionality) or BUG (defect fix)?
2. **For features**: Provide a clear problem statement and desired outcome
3. **For bugs**: Include steps to reproduce, expected vs actual behavior
4. **Testing**: Always test with both UOB PPV and UOB VS cards when applicable
5. **Browser compatibility**: Verify changes work across Chrome, Firefox, Safari, Opera, Edge (desktop + mobile)

### GitHub Copilot Workspace

For contributors using GitHub Copilot Workspace:

- The repository includes agent configuration files in `.github/agents/` (product-manager.md, staff-engineer.md, qa.md)
- See `.github/copilot-instructions.md` for detailed workflow process
- All outputs should be consolidated into a single implementation plan

### Key Development Guidelines

- **Privacy first**: All data must stay local (browser storage only)
- **No external API calls**: Network interception is read-only
- **Card-specific testing**: Always test with both UOB PPV and UOB VS cards
- **Browser compatibility**: Test across all supported browsers
- **Code patterns**: Use ES6+, async/await, defensive programming

## License

See [LICENSE](LICENSE) file for details.

---

**Made for UOB cardholders who just want to track their spending without the hassle.**
