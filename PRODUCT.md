# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: investors and shareholders of Kvarts AJ researching corporate disclosures — charter, reports, resolutions, affiliated persons, business plans (via docs.kvarts.uz). Secondary: B2B buyers browsing product catalogs (jars, bottles, sheet glass, refractories, photo printing) and the wholesale price table. Tertiary: general public reading company news and factory background. Trilingual audience: Uzbek, Russian, English.

## Product Purpose

Marketing and investor-relations landing for Kvarts AJ, the glass factory in Quvasoy (operating since 1975). It presents the plant's capacity, products, prices, news, and disclosure documents in one page. Success means visitors reaching investor documents and making contact (phone/email).

## Positioning

The largest glass plant in Central Asia and monopolist in domestic construction glass; state-owned (Agency for State Assets, 89.78% as of Feb 2025). No neighboring plant can truthfully claim this scale: 400 tons/day float line, 269M jars + 110M bottles yearly, exports to 5 countries.

## Operating Context

Single-page landing with anchor navigation (products, factory, prices, news, contacts) plus an investors dropdown linking to external disclosure archive (docs.kvarts.uz). Catalogs are external PDFs. Prices are a wholesale table per 1000 pcs (VAT / non-VAT). News links out to kvarts.uz articles. No backend forms — contact is tel: and mailto: links plus a mobile call bar.

## Capabilities and Constraints

Confirmed functionality: auto-playing hero slideshow with pause control and reduced-motion support; trilingual switching (cookie-persisted, SSR); animated stat count-ups; price table; news feed from local data file; partner marquee. Constraints: all prices, contacts, document URLs, and company facts are real and must stay accurate — never invent testimonials, figures, or claims. No dead links: every anchor must match a rendered section.

## Brand Commitments

Binding: hero section (dark photo slideshow) and liquid-glass navbar pill stay untouched — glass lives only in the navbar pill, hero badge/CTA, and slideshow pause button. Type: Geist Sans body + Geist Mono identifiers. Below-hero sections follow Vercel report restraint (flat surfaces, sentence-case heads, full-width evidence tables); no Vercel wordmark/shell. Name "Kvarts AJ" / «Кварц», logo at /logo.png, UZSE ticker KVTS.

## Evidence on Hand

Real photography: hero ENZ_*.jpg, history/, services/, certs/ (9 certificates), news/ images in public/. Real data: PRICE_ROWS table, NEWS feed in src/lib/news.js, partner logos partner1-5.png. No testimonials or case studies exist — future work must not fabricate them.

## Product Principles

1. Investor trust first: disclosures and facts are always one click away and verifiably accurate.
2. Real proof over decoration: photos, documents, and numbers carry the page; no placeholder content.
3. Restraint in motion: animation confirms and orients, never blocks reading or contact.
4. Trilingual parity: every surface reads fully in Uzbek, Russian, and English.

## Accessibility & Inclusion

 prefers-reduced-motion honored across slideshow, count-ups, marquee, and reveals; skip link; visible focus; labeled icon-only controls; autoplay slideshow has a pause control.
