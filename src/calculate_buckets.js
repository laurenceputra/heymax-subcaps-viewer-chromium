// Main function to calculate buckets
function calculateBuckets(apiResponse) {
    // Define the ppv_online_mcc list directly in the function
    const ppvShoppingMcc = [4816, 5262, 5306, 5309, 5310, 5311, 5331, 5399, 5611, 5621, 5631, 5641, 5651, 5661, 5691, 5699, 5732, 5733, 5734, 5735, 5912, 5942, 5944, 5945, 5946, 5947, 5948, 5949, 5964, 5965, 5966, 5967, 5968, 5969, 5970, 5992, 5999];
    const ppvDiningMcc = [5811, 5812, 5814, 5333, 5411, 5441, 5462, 5499, 8012, 9751];
    const ppvEntertainmentMcc = [7278, 7832, 7841, 7922, 7991, 7996, 7998, 7999];
    // Helper function to round down to the nearest $5
    const roundDownToNearestFive = (amount) => Math.floor(amount / 5) * 5;

    let contactlessBucket = 0;
    let onlineBucket = 0;

    apiResponse.forEach((transactionObj) => {
        const transaction = transactionObj.transaction;

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

    return { contactless: contactlessBucket, online: onlineBucket};
}

// Make function available globally for UI script
if (typeof window !== 'undefined') {
    window.calculateBuckets = calculateBuckets;
}