// Main function to calculate buckets
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
                foreignCurrencyBucket += roundDownToNearestFive(transaction.base_currency_amount);
            } else if (transaction.payment_tag === 'contactless') {
                // Only count in contactless if NOT foreign currency
                contactlessBucket += roundDownToNearestFive(transaction.base_currency_amount);
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

// Make function available globally for UI script
if (typeof window !== 'undefined') {
    window.calculateBuckets = calculateBuckets;
}