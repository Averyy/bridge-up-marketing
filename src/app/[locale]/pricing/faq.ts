// Single source of truth for which FAQ entries exist, shared by the rendered
// FAQ (PricingContent) and the FAQPage JSON-LD (page.tsx). Google requires the
// structured data to match the visible content — keep them driven by this list.
// To add an entry: add the id here and the q{n}/a{n} keys to all 3 message files.
export const PRICING_FAQ_IDS = [1, 2, 3, 4] as const;
