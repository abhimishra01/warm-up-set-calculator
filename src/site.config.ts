// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
export default {
  name: 'Warm Up Set Calculator',                 // shown in header, title, footer
  domain: 'bingemind.com/warm-up-set-calculator', // host and path of the public home (no https://). Canonical, sitemap and legal text use it
  cloudflareProject: 'warm-up-set-calculator',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'warm up set calculator',  // main keyword (search phrase)
  keywords: ['warm up sets', 'warm up calculator', 'barbell warm up sets', 'warm up weights', 'plates per side', 'squat warm up'], // supporting keywords
  h1: 'Warm up set calculator',       // visible page heading
  title: 'Warm Up Set Calculator: Sets and Plates (lb & kg)', // home page title, under 60 chars
  tagline: 'Free and fast',
  description:
    'Enter your work weight. Get warm up sets from the empty bar, rounded to plates you can load, with plates per side. lb and kg, print view.',
  contact: 'https://bingemind.com/#contact', // contact link (no email address)
  hub: 'https://bingemind.com/tools/', // "More free tools" footer link
  ga4: '',                            // GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = Google Analytics off
  adsense: '',                        // AdSense publisher ID, e.g. 'ca-pub-1234567890123456'. Empty = ads off
  brand: '#2f6b1c',                   // brand color (hex)
  skin: 'retro',                      // visual skin: minimal, swiss, clay or retro
  locale: 'en-US',                    // BCP 47 language tag
  ogImage: '/og.png',
  category: 'HealthApplication',      // schema.org applicationCategory
  updated: 'October 20, 2026',        // "Last updated" date on Privacy and Terms (fixed, change by hand)
  owner: 'Bingemind (Abhishek Mishra)',                // name used in legal pages (person or business)
};
