// ==UserScript==
// @name         HeyMax SubCaps Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Monitor network requests and display SubCaps calculations for UOB cards on HeyMax
// @author       Your Name
// @match        https://heymax.ai/cards/your-cards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heymax.ai
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // NETWORK MONITORING (from injected.js)
    // ============================================================================

    // Store original functions
    const originalFetch = window.fetch;
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    // Flag to track if we're currently patching
    let isPatching = false;

    // Check if URL should be logged (only log URLs matching the target pattern)
    function shouldLogUrl(url) {
        try {
            const urlObj = new URL(url, window.location.href);

            // Only log requests to heymax.ai domain
            if (urlObj.hostname !== 'heymax.ai') {
                return false;
            }

            const pathname = urlObj.pathname;

            // Log requests to /cards/your-cards/* paths
            if (pathname.startsWith('/cards/your-cards/')) {
                return true;
            }

            // Log requests to specific API endpoints
            if (pathname.startsWith('/api/spend_tracking/cards/') &&
                (pathname.includes('/summary') || pathname.includes('/transactions'))) {
                return true;
            }

            if (pathname === '/api/spend_tracking/card_tracker') {
                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // Logger function
    function logApiResponse(method, url, response, responseData) {
        console.log('%c[Network Monitor] API Response Logged', 'color: #4CAF50; font-weight: bold;');
        console.log('Method:', method);
        console.log('URL:', url);
        console.log('Status:', response?.status);
        console.log('Response Data:', responseData);
        console.log('---');

        // Store the data using Tampermonkey storage
        storeApiResponse(method, url, response?.status, responseData);
    }

    // Extract card ID from URL
    function extractCardId(url) {
        // Extract ID from patterns like:
        // /api/spend_tracking/cards/{id}/transactions
        // /api/spend_tracking/cards/{id}/summary
        const match = url.match(/\/api\/spend_tracking\/cards\/([a-f0-9]+)\//);
        if (match) {
            return match[1];
        }

        // If URL has double slashes (e.g., /cards//summary), extract ID from current page URL
        if (url.includes('/cards//')) {
            const pageMatch = window.location.pathname.match(/\/cards\/your-cards\/([a-f0-9]+)/);
            return pageMatch ? pageMatch[1] : null;
        }

        return null;
    }

    // Determine the data type from URL
    function getDataType(url) {
        if (url.includes('/transactions')) {
            return 'transactions';
        } else if (url.includes('/summary')) {
            return 'summary';
        } else if (url.includes('/card_tracker')) {
            return 'card_tracker';
        }
        return null;
    }

    // Store API response using Tampermonkey storage
    function storeApiResponse(method, url, status, data) {
        const dataType = getDataType(url);
        let cardId = extractCardId(url);

        // For card_tracker, try to get card ID from the current page URL
        if (dataType === 'card_tracker' && !cardId) {
            const pageMatch = window.location.pathname.match(/\/cards\/your-cards\/([a-f0-9]+)/);
            if (pageMatch) {
                cardId = pageMatch[1];
            }
        }

        const timestamp = new Date().toISOString();

        // Get existing card data
        const cardDataStr = GM_getValue('cardData', '{}');
        const cardData = JSON.parse(cardDataStr);

        if (dataType && cardId) {
            // Initialize card object if it doesn't exist
            if (!cardData[cardId]) {
                cardData[cardId] = {};
            }

            // Store the latest data for this card ID and data type
            cardData[cardId][dataType] = {
                data: data,
                timestamp: timestamp,
                url: url,
                status: status
            };

            console.log(`[HeyMax SubCaps Viewer] Stored ${dataType} for card ${cardId}`);
        } else if (dataType === 'card_tracker' && !cardId) {
            // card_tracker on main listing page (no specific card ID)
            cardData['card_tracker'] = {
                data: data,
                timestamp: timestamp,
                url: url,
                status: status
            };

            console.log('[HeyMax SubCaps Viewer] Stored card_tracker data (global)');
        }

        // Save the updated cardData structure
        GM_setValue('cardData', JSON.stringify(cardData));
    }

    // Monkey patch fetch
    function patchFetch() {
        if (window.fetch === monkeyPatchedFetch) return; // Already patched

        window.fetch = monkeyPatchedFetch;
        console.log('%c[Network Monitor] fetch() has been patched', 'color: #2196F3; font-weight: bold;');
    }

    function monkeyPatchedFetch(...args) {
        const [resource, config] = args;
        const url = typeof resource === 'string' ? resource : resource.url;
        const method = config?.method || 'GET';

        console.log(`%c[Network Monitor] Intercepted fetch: ${method} ${url}`, 'color: #FF9800;');

        return originalFetch.apply(this, args)
            .then(async response => {
                // Only log if URL matches the target pattern
                if (!shouldLogUrl(url)) {
                    return response;
                }

                // Clone the response so we can read it
                const clonedResponse = response.clone();

                try {
                    const contentType = response.headers.get('content-type');
                    let responseData;

                    if (contentType && contentType.includes('application/json')) {
                        responseData = await clonedResponse.json();
                        logApiResponse(method, url, response, responseData);
                    } else {
                        const text = await clonedResponse.text();
                        if (text.length < 1000) { // Only log small text responses
                            logApiResponse(method, url, response, text);
                        }
                    }
                } catch (error) {
                    console.warn('[Network Monitor] Error reading response:', error);
                }

                return response;
            })
            .catch(error => {
                console.error(`[Network Monitor] Fetch error for ${url}:`, error);
                throw error;
            });
    }

    // Monkey patch XMLHttpRequest
    function patchXHR() {
        if (XMLHttpRequest.prototype.open === monkeyPatchedXHROpen) return; // Already patched

        XMLHttpRequest.prototype.open = monkeyPatchedXHROpen;
        XMLHttpRequest.prototype.send = monkeyPatchedXHRSend;
        console.log('%c[Network Monitor] XMLHttpRequest has been patched', 'color: #2196F3; font-weight: bold;');
    }

    function monkeyPatchedXHROpen(method, url, ...rest) {
        this._method = method;
        this._url = url;
        console.log(`%c[Network Monitor] Intercepted XHR: ${method} ${url}`, 'color: #FF9800;');
        return originalXHROpen.call(this, method, url, ...rest);
    }

    function monkeyPatchedXHRSend(body) {
        const xhr = this;

        // Add event listener for load
        xhr.addEventListener('load', function() {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                // Only log if URL matches the target pattern
                if (!shouldLogUrl(xhr._url)) {
                    return;
                }

                try {
                    const contentType = xhr.getResponseHeader('content-type');
                    let responseData;

                    if (contentType && contentType.includes('application/json')) {
                        responseData = JSON.parse(xhr.responseText);
                    } else if (xhr.responseText && xhr.responseText.length < 1000) {
                        responseData = xhr.responseText;
                    }

                    if (responseData) {
                        logApiResponse(xhr._method, xhr._url, { status: xhr.status }, responseData);
                    }
                } catch (error) {
                    console.warn('[Network Monitor] Error processing XHR response:', error);
                }
            }
        });

        return originalXHRSend.call(this, body);
    }

    // Apply patches
    function applyPatches() {
        if (isPatching) return;
        isPatching = true;

        patchFetch();
        patchXHR();

        isPatching = false;
    }

    // Monitor for patches being overwritten
    function monitorPatches() {
        setInterval(() => {
            // Check if fetch was overwritten
            if (window.fetch !== monkeyPatchedFetch) {
                console.warn('%c[Network Monitor] ALERT: fetch() was overwritten! Re-applying patch...', 'color: #F44336; font-weight: bold; font-size: 14px;');
                patchFetch();
            }

            // Check if XHR was overwritten
            if (XMLHttpRequest.prototype.open !== monkeyPatchedXHROpen) {
                console.warn('%c[Network Monitor] ALERT: XMLHttpRequest.open() was overwritten! Re-applying patch...', 'color: #F44336; font-weight: bold; font-size: 14px;');
                patchXHR();
            }
        }, 1000); // Check every second
    }

    // Initialize network monitoring
    console.log('%c[Network Monitor] Initializing network request monitoring...', 'color: #9C27B0; font-weight: bold; font-size: 16px;');
    applyPatches();
    monitorPatches();
    console.log('%c[Network Monitor] Monitoring active!', 'color: #4CAF50; font-weight: bold; font-size: 16px;');

    // ============================================================================
    // UI COMPONENTS (from ui.js)
    // ============================================================================

    // Extract card ID from URL
    function extractCardIdFromUrl() {
        const match = window.location.pathname.match(/\/cards\/your-cards\/([a-f0-9]+)/);
        return match ? match[1] : null;
    }

    // Calculate buckets from transaction data
    function calculateBuckets(apiResponse, cardShortName = 'UOB PPV') {
        // Define the ppv_online_mcc list directly in the function
        const ppvShoppingMcc = [4816, 5262, 5306, 5309, 5310, 5311, 5331, 5399, 5611, 5621, 5631, 5641, 5651, 5661, 5691, 5699, 5732, 5733, 5734, 5735, 5912, 5942, 5944, 5945, 5946, 5947, 5948, 5949, 5964, 5965, 5966, 5967, 5968, 5969, 5970, 5992, 5999];
        const ppvDiningMcc = [5811, 5812, 5814, 5333, 5411, 5441, 5462, 5499, 8012, 9751];
        const ppvEntertainmentMcc = [7278, 7832, 7841, 7922, 7991, 7996, 7998, 7999];

        // Blacklist MCC codes - transactions with these codes should not be counted
        const blacklistMcc = [4829, 4900, 5199, 5960, 5965, 5993, 6012, 6050, 6051, 6211, 6300, 6513, 6529, 6530, 6534, 6540, 7349, 7511, 7523, 7995, 8062, 8211, 8220, 8241, 8244, 8249, 8299, 8398, 8661, 8651, 8699, 8999, 9211, 9222, 9223, 9311, 9402, 9405, 9399];

        // Blacklist merchant name prefixes - transactions starting with these should not be counted
        const blacklistMerchantPrefixes = [
            "AXS", "AMAZE", "AMAZE* TRANSIT", "BANC DE BINARY", "BANCDEBINARY.COM",
            "EZ LINK PTE LTD (FEVO)", "EZ Link transport", "EZ Link", "EZ-LINK (IMAGINE CARD)",
            "EZ-Link EZ-Reload (ATU)", "EZLINK", "EzLink", "EZ-LINK", "FlashPay ATU",
            "MB * MONEYBOOKERS.COM", "NETS VCASHCARD", "OANDA ASIA PAC", "OANDAASIAPA",
            "PAYPAL * BIZCONSULTA", "PAYPAL * CAPITALROYA", "PAYPAL * OANDAASIAPA",
            "Saxo Cap Mkts Pte Ltd", "SKR*SKRILL.COM", "SKR*xglobalmarkets.com", "SKYFX.COM",
            "TRANSIT", "WWW.IGMARKETS.COM.SG", "IPAYMY", "RWS-LEVY", "SMOOVE PAY",
            "SINGPOST-SAM", "RazerPay", "NORWDS"
        ];

        // Helper function to round down to the nearest $5
        const roundDownToNearestFive = (amount) => Math.floor(amount / 5) * 5;

        // Helper function to check if transaction is blacklisted
        const isBlacklisted = (transaction) => {
            // Check MCC code blacklist
            const mccCode = parseInt(transaction.mcc_code, 10);
            if (blacklistMcc.includes(mccCode)) {
                return true;
            }

            // Check merchant name blacklist
            if (transaction.merchant_name) {
                for (const prefix of blacklistMerchantPrefixes) {
                    if (transaction.merchant_name.startsWith(prefix)) {
                        return true;
                    }
                }
            }

            return false;
        };

        let contactlessBucket = 0;
        let onlineBucket = 0;
        let foreignCurrencyBucket = 0;

        if (cardShortName === 'UOB VS') {
            // UOB Visa Signature logic
            // Foreign currency transactions take priority over contactless
            apiResponse.forEach((transactionObj) => {
                const transaction = transactionObj.transaction;

                // Skip blacklisted transactions
                if (isBlacklisted(transaction)) {
                    return;
                }

                if (transaction.original_currency && transaction.original_currency !== 'SGD') {
                    // Round down and add to foreign currency bucket
                    foreignCurrencyBucket += transaction.base_currency_amount;
                } else if (transaction.payment_tag === 'contactless') {
                    // Only count in contactless if NOT foreign currency
                    contactlessBucket += transaction.base_currency_amount;
                }
            });

            return { contactless: contactlessBucket, foreignCurrency: foreignCurrencyBucket };
        } else {
            // UOB PPV logic (default)
            apiResponse.forEach((transactionObj) => {
                const transaction = transactionObj.transaction;

                // Skip blacklisted transactions
                if (isBlacklisted(transaction)) {
                    return;
                }

                if (transaction.payment_tag === 'contactless') {
                    // Round down and add to contactless bucket
                    contactlessBucket += roundDownToNearestFive(transaction.base_currency_amount);
                } else if (transaction.payment_tag === 'online') {
                    // Check if mcc_code is in ppv_online_mcc
                    const mccCode = parseInt(transaction.mcc_code, 10); // Ensure mcc_code is an integer
                    if (ppvShoppingMcc.includes(mccCode) || ppvDiningMcc.includes(mccCode) || ppvEntertainmentMcc.includes(mccCode)) {
                        // Round down and add to online bucket
                        onlineBucket += roundDownToNearestFive(transaction.base_currency_amount);
                    }
                }
            });

            return { contactless: contactlessBucket, online: onlineBucket };
        }
    }

    // Check if button should be visible
    function shouldShowButton(cardId) {
        const cardDataStr = GM_getValue('cardData', '{}');
        const cardData = JSON.parse(cardDataStr);

        console.log('[HeyMax SubCaps Viewer] Checking visibility - cardData exists:', !!cardData);
        console.log('[HeyMax SubCaps Viewer] Checking visibility - cardId:', cardId);

        if (!cardData || !cardId) {
            console.log('[HeyMax SubCaps Viewer] No cardData or cardId, hiding button');
            return false;
        }

        const cardInfo = cardData[cardId];
        console.log('[HeyMax SubCaps Viewer] Card info exists:', !!cardInfo);

        if (!cardInfo || !cardInfo.card_tracker) {
            console.log('[HeyMax SubCaps Viewer] No card info or card_tracker, hiding button');
            return false;
        }

        const cardTrackerData = cardInfo.card_tracker.data;
        console.log('[HeyMax SubCaps Viewer] Card tracker data exists:', !!cardTrackerData);

        if (!cardTrackerData || !cardTrackerData.card) {
            console.log('[HeyMax SubCaps Viewer] No card tracker data or card object, hiding button');
            return false;
        }

        const shortName = cardTrackerData.card.short_name;
        console.log('[HeyMax SubCaps Viewer] Card short_name:', shortName);
        const isSupportedCard = shortName === 'UOB PPV' || shortName === 'UOB VS';
        console.log('[HeyMax SubCaps Viewer] Is supported card:', isSupportedCard);
        return isSupportedCard;
    }

    // Create the SubCaps button
    function createButton() {
        const button = document.createElement('button');
        button.id = 'heymax-subcaps-button';
        button.textContent = 'subcaps';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transition: all 0.3s ease;
            display: none;
        `;

        button.addEventListener('mouseenter', function() {
            button.style.backgroundColor = '#45a049';
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', function() {
            button.style.backgroundColor = '#4CAF50';
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', function() {
            showOverlay();
        });

        return button;
    }

    // Create the overlay
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'heymax-subcaps-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 10001;
            display: none;
            justify-content: center;
            align-items: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background-color: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 32px;
            font-weight: bold;
            cursor: pointer;
            color: #666;
            line-height: 1;
            padding: 0;
            width: 32px;
            height: 32px;
            transition: color 0.3s ease;
        `;

        closeButton.addEventListener('mouseenter', function() {
            closeButton.style.color = '#000';
        });

        closeButton.addEventListener('mouseleave', function() {
            closeButton.style.color = '#666';
        });

        closeButton.addEventListener('click', function() {
            hideOverlay();
        });

        const title = document.createElement('h2');
        title.id = 'heymax-subcaps-title';
        title.textContent = 'SubCaps Analysis';
        title.style.cssText = `
            margin-top: 0;
            margin-bottom: 20px;
            color: #333;
            font-size: 24px;
        `;

        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'heymax-subcaps-results';

        content.appendChild(closeButton);
        content.appendChild(title);
        content.appendChild(resultsDiv);
        overlay.appendChild(content);

        // Close overlay when clicking outside content
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                hideOverlay();
            }
        });

        return overlay;
    }

    // Show overlay with calculated data
    function showOverlay() {
        const overlay = document.getElementById('heymax-subcaps-overlay');
        const resultsDiv = document.getElementById('heymax-subcaps-results');
        const titleElement = document.getElementById('heymax-subcaps-title');

        if (!overlay || !resultsDiv) {
            console.error('[HeyMax SubCaps Viewer] Overlay elements not found');
            return;
        }

        // Show loading state
        resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">Loading data...</p>';
        overlay.style.display = 'flex';

        // Get data and calculate
        const cardId = extractCardIdFromUrl();
        const cardDataStr = GM_getValue('cardData', '{}');
        const cardData = JSON.parse(cardDataStr);

        if (!cardData || !cardId || !cardData[cardId]) {
            resultsDiv.innerHTML = '<p style="color: #f44336;">Error: No card data found</p>';
            return;
        }

        const transactionsData = cardData[cardId].transactions;
        if (!transactionsData || !transactionsData.data) {
            resultsDiv.innerHTML = '<p style="color: #f44336;">Error: No transaction data available</p>';
            return;
        }

        // Get card short name
        const cardTrackerData = cardData[cardId].card_tracker;
        const cardShortName = cardTrackerData && cardTrackerData.data && cardTrackerData.data.card
            ? cardTrackerData.data.card.short_name
            : 'UOB PPV';

        // Update title based on card type
        if (titleElement) {
            titleElement.textContent = `${cardShortName} SubCaps Analysis`;
        }

        // Calculate buckets
        try {
            const transactions = transactionsData.data;
            const results = calculateBuckets(transactions, cardShortName);

            // Display results
            displayResults(results, transactions.length, cardShortName);
        } catch (error) {
            console.error('[HeyMax SubCaps Viewer] Error calculating data:', error);
            resultsDiv.innerHTML = '<p style="color: #f44336;">Error calculating data: ' + error.message + '</p>';
        }
    }

    // Hide overlay
    function hideOverlay() {
        const overlay = document.getElementById('heymax-subcaps-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // Display calculation results
    function displayResults(results, transactionCount, cardShortName = 'UOB PPV') {
        const resultsDiv = document.getElementById('heymax-subcaps-results');
        if (!resultsDiv) return;

        let html = `
            <div style="margin-bottom: 20px;">
                <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                    Analyzed ${transactionCount} transaction${transactionCount !== 1 ? 's' : ''}
                </p>
            </div>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="margin-top: 0; color: #2196F3; font-size: 18px;">Contactless Bucket</h3>
                <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #333;">
                    $${results.contactless.toFixed(2)} / $${cardShortName === 'UOB VS' ? '1200' : '600'}
                </p>
                <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                    Total from contactless payments${cardShortName === 'UOB PPV' ? ' (rounded down to nearest $5)' : ''}
                </p>
            </div>
        `;

        if (cardShortName === 'UOB VS') {
            // Display Foreign Currency bucket for UOB VS
            html += `
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
                    <h3 style="margin-top: 0; color: #4CAF50; font-size: 18px;">Foreign Currency Bucket</h3>
                    <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #333;">
                        $${results.foreignCurrency.toFixed(2)} / $1200
                    </p>
                    <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                        Total from non-SGD transactions
                    </p>
                </div>
            `;
        } else {
            // Display Online bucket for UOB PPV
            html += `
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
                    <h3 style="margin-top: 0; color: #4CAF50; font-size: 18px;">Online Bucket</h3>
                    <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #333;">
                        $${results.online.toFixed(2)} / $600
                    </p>
                    <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                        Total from eligible online transactions (rounded down to nearest $5)
                    </p>
                </div>
            `;
        }

        html += `
            <div style="margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #1976D2;">
                    <strong>Note:</strong> These calculations are based on the transaction data that has been loaded so far.
                </p>
            </div>
        `;

        resultsDiv.innerHTML = html;
    }

    // Update button visibility
    function updateButtonVisibility() {
        const button = document.getElementById('heymax-subcaps-button');
        if (!button) return;

        const cardId = extractCardIdFromUrl();
        console.log('[HeyMax SubCaps Viewer] Extracted card ID:', cardId);

        if (cardId) {
            const shouldShow = shouldShowButton(cardId);
            console.log('[HeyMax SubCaps Viewer] Should show button:', shouldShow);
            if (shouldShow) {
                button.style.display = 'block';
                console.log('[HeyMax SubCaps Viewer] SubCaps button displayed for supported card');
            } else {
                button.style.display = 'none';
                console.log('[HeyMax SubCaps Viewer] SubCaps button hidden (conditions not met)');
            }
        } else {
            button.style.display = 'none';
            console.log('[HeyMax SubCaps Viewer] No card ID found in URL, button will remain hidden');
        }
    }

    // Initialize UI
    function initializeUI() {
        // Ensure document.body exists
        if (!document.body) {
            console.log('[HeyMax SubCaps Viewer] document.body not ready, waiting...');
            setTimeout(initializeUI, 100);
            return;
        }

        console.log('[HeyMax SubCaps Viewer] Initializing UI components...');

        // Create and append button
        const button = createButton();
        document.body.appendChild(button);
        console.log('[HeyMax SubCaps Viewer] Button element created and appended');

        // Create and append overlay
        const overlay = createOverlay();
        document.body.appendChild(overlay);
        console.log('[HeyMax SubCaps Viewer] Overlay element created and appended');

        // Check initial button visibility
        updateButtonVisibility();

        // Re-check on URL changes (for SPA navigation) with debouncing
        let lastUrl = window.location.href;
        let debounceTimer = null;
        const observer = new MutationObserver(function(mutations) {
            // Only process if there are significant changes
            const hasSignificantChange = mutations.some(mutation =>
                mutation.type === 'childList' && mutation.addedNodes.length > 0
            );

            if (!hasSignificantChange) {
                return;
            }

            // Debounce to avoid excessive checks
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }

            debounceTimer = setTimeout(function() {
                if (window.location.href !== lastUrl) {
                    lastUrl = window.location.href;
                    updateButtonVisibility();
                }
            }, 250); // 250ms debounce delay
        });

        // Observe childList changes including subtree for SPA navigation detection
        observer.observe(document.body, { childList: true, subtree: true });

        // Also periodically check for button visibility (in case storage updates)
        setInterval(updateButtonVisibility, 2000);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUI);
    } else {
        initializeUI();
    }

    console.log('[HeyMax SubCaps Viewer] Tampermonkey script initialized');
})();
