// API configuration - centralized URLs for all API calls
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.bridgeup.app";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://api.bridgeup.app/ws";

// Canonical site origin. www is the permanent primary domain (apex bridgeup.app
// redirects to it) — see CLAUDE.md. Single source of truth for metadataBase,
// sitemap, robots, and absolute URLs in JSON-LD.
export const SITE_URL = "https://www.bridgeup.app";

// App Store listing for the iOS app.
export const APP_STORE_ID = "6557082394";
export const APP_STORE_URL = `https://apps.apple.com/ca/app/bridge-up/id${APP_STORE_ID}`;
