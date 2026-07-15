/**
 * RevenueCat + IAP configuration
 *
 * HOW TO SWAP IN YOUR REAL CREDENTIALS:
 *  1. Replace REVENUECAT_API_KEY_IOS / REVENUECAT_API_KEY_ANDROID with your
 *     project's public SDK keys from app.revenuecat.com → Project → API Keys.
 *  2. Replace ENTITLEMENT_ID with the entitlement identifier you created in
 *     RevenueCat (e.g. "pro" or "clarity_unlock").
 *  3. Replace PRODUCT_ID with the product identifier you set up in
 *     App Store Connect / Google Play Console.
 *  4. Optionally set USER_ID_PREFIX if you want to namespace anonymous IDs.
 */

export const IAP_CONFIG = {
  /** RevenueCat iOS SDK key — find in RC dashboard → Project → API Keys */
  REVENUECAT_API_KEY_IOS: 'appl_PLACEHOLDER_REPLACE_ME',

  /** RevenueCat Android SDK key */
  REVENUECAT_API_KEY_ANDROID: 'goog_PLACEHOLDER_REPLACE_ME',

  /** Entitlement ID configured in RevenueCat dashboard */
  ENTITLEMENT_ID: 'clarity_unlock',

  /** Product ID as set in App Store Connect / Google Play Console */
  PRODUCT_ID: 'clarity_unlock_499',

  /** Display price — keep in sync with your store listing */
  DISPLAY_PRICE: '$4.99',
} as const;

/** True once the placeholder RevenueCat keys above have been replaced with real ones. */
export const IAP_IS_CONFIGURED =
  !IAP_CONFIG.REVENUECAT_API_KEY_IOS.includes('PLACEHOLDER') &&
  !IAP_CONFIG.REVENUECAT_API_KEY_ANDROID.includes('PLACEHOLDER');
