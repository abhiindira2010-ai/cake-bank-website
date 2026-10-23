# Cake Bank website

Premium, responsive React + TypeScript + Vite single-page website for Cake Bank, Kothapet Main Road, Guntur, Andhra Pradesh.

## Run locally
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test:e2e` (Playwright browser tests, including axe-core WCAG 2.1 A/AA scan and screenshot capture; Chromium must be installed)
- `npm run preview`

Desktop and mobile full-page screenshots from the verification run are saved under `test-results/cake-bank-desktop.png` and `test-results/cake-bank-mobile.png`.

## WhatsApp configuration
Open `src/config/business.ts` and set `whatsappNumber` to a verified WhatsApp Business number in international digits-only format (example format: `91XXXXXXXXXX`). It intentionally remains empty until the client confirms the number. With no valid number, ordering actions remain disabled and the custom enquiry form provides copyable enquiry text instead of claiming an order was submitted.

## Product and image updates
Edit `src/data/products.ts` to replace demonstration concepts with Cake Bank's verified product catalogue and approved product photos. Stock photos are illustrative only; do not present them as the bakery's own products. Update image credits in `src/assets/images/CREDITS.md` when sources are verified. Occasions live in `src/data/occasions.ts`, media in `src/data/media.ts`, and approved testimonials in `src/data/testimonials.ts`.

## Still required from the client
Verified WhatsApp-enabled number; real catalogue and approved photos; approved pricing policy; opening hours; phone, email and social links; delivery policy and areas; genuine testimonials; approved offers if any; official logo; final domain. No prices, discounts, reviews, phone number, or hours are fabricated. Form data is not stored or sent to a backend.
