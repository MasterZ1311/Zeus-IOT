# 🔍 ZEUS IOT — Mobile Visual Audit Report
**Date:** 2026-06-21 | **Auditor:** Antigravity AI | **Build:** Production (localhost:3000)

---

## Viewport Coverage

| Device | Resolution | Status |
|--------|-----------|--------|
| iPhone SE (3rd Gen) | 375×667 | ✅ Audited |
| iPhone 14 | 390×844 | ✅ Audited |
| iPhone 14 Pro Max | 430×932 | ✅ Audited |
| Samsung Galaxy S21 | 360×800 | ✅ Audited |
| Small Android (baseline) | 320×568 | ✅ Audited |

---

## SECTION 1 — CRITICAL ERRORS 🔴

### C1 · Hero Section: WhatsApp FAB Collides With Headline on 320px

- **Page:** `index.html`
- **Viewport:** 320×568 (Small Android)
- **Element:** `.whatsapp-float` (fixed bottom-right FAB)
- **Problem:** The WhatsApp FAB button overlaps directly on top of the hero headline text "CUSTOM IOT & SOFTWARE" because the hero text block fills 100% width and the FAB is `position: fixed; right: 12px`. On 320px, the headline text literally goes behind the button, making the last word unreadable.
- **Evidence:** Screenshot `smallandroid_idx_top` — FAB sits directly above headline text.
- **iOS/Android:** Both. Worse on Android (no safe-area offset).
- **Severity:** 🔴 CRITICAL

---

### C2 · Contact Form: Scroll Position NOT Reset on Step Transition

- **Page:** `contact.html`
- **Viewport:** All mobile (375×667 tested)
- **Element:** Multi-step wizard steps (`#wizard-step-1` → `#wizard-step-2`)
- **Problem:** When the user taps "Next Step" at the bottom of Step 1, the page renders Step 2 but the scroll position stays at the bottom. The first 3 required fields (Full Name, WhatsApp Number, Institution) are hidden **above the current viewport**. User must manually scroll up to find them — a complete UX failure. Users filling a form expect to start at the top of the new step.
- **Root Cause:** JS wizard step transition has no `window.scrollTo(0, 0)` call.
- **iOS:** Confirmed. **Android:** Confirmed.
- **Severity:** 🔴 CRITICAL

---

### C3 · Contact Form: Server 500 on Submit

- **Page:** `contact.html`
- **Element:** `#submit-btn` → `POST /api/contact`
- **Problem:** Submitting the full 3-step form returns a 500 Internal Server Error. No user-facing error toast or recovery UI is shown. The button stays in loading state indefinitely with the spinner, with no way for users to know the submission failed.
- **Impact:** Zero successful form submissions possible.
- **iOS/Android:** Both (server-side).
- **Severity:** 🔴 CRITICAL

---

### C4 · Pay Page: Submit Without Upload Allowed — No Validation Feedback

- **Page:** `pay.html`
- **Element:** `#pay-submit-btn`
- **Problem:** The "SUBMIT VERIFICATION" button is tappable even when no payment screenshot has been uploaded. No alert, toast, or inline validation fires. The `handlePaySubmit()` function has a check `if (fileInput.files.length === 0)` → `alert(...)`, but this native alert is frequently blocked or unseen on mobile browsers, and the UX provides zero inline visual feedback.
- **iOS:** Alert may not show reliably in PWA/standalone mode.
- **Severity:** 🔴 CRITICAL

---

## SECTION 2 — HIGH SEVERITY ERRORS 🟠

### H1 · Hero: Massive Dead Space Above Headline (Hero Image Panel)

- **Page:** `index.html`
- **Viewport:** All mobile (375px+)
- **Element:** Hero section image container (Zeus emblem panel)
- **Problem:** The hero image/emblem panel takes up approximately 220px of vertical space on mobile (visible in screenshot `iphonese_index_hero`). The emblem is centered in this block with large empty padding above and below. On a 667px screen, this means ~33% of the first viewport is wasted on decorative empty space before the headline.
- **Principle Violated:** F-pattern reading. Users must scroll to reach the primary value proposition.
- **Fix:** Collapse hero image height to 140px max on mobile; align emblem left or float it as a badge.
- **iOS/Android:** Both.
- **Severity:** 🟠 HIGH

---

### H2 · Hero: CTA Buttons Cut Off Below Viewport Fold on iPhone SE

- **Page:** `index.html`
- **Viewport:** 375×667 (iPhone SE)
- **Element:** Hero CTA buttons (`#hero-cta` or `.hero-cta-group`)
- **Problem:** On iPhone SE (667px height), the combined height of: nav (64px) + hero image block (220px) + status badge + headline + body text pushes the CTA buttons completely below the fold. User must scroll to see the primary action — "IGNITE PROJECT". This violates the golden rule: **primary CTA must be above the fold**.
- **Severity:** 🟠 HIGH

---

### H3 · Stats Section: Only 2 of 4 Stats Visible (Bottom 2 Hidden)

- **Page:** `index.html`
- **Viewport:** 375×667 (iPhone SE), 360×800 (Galaxy S21)
- **Element:** `.grid.grid-cols-2.lg:grid-cols-4` (stats grid)
- **Problem:** Screenshot `iphonese_index_scroll2` shows only the top row of stats (99.7% and 24hr). The bottom row stats are not visible without scrolling. However, there is excess whitespace in the section. The 2×2 grid has excessive vertical gap between rows, pushing the second row partially off-screen, requiring the user to scroll to see all 4 stats.
- **Evidence:** Stats section screengrab shows cards "99.7% ON-TIME DELIVERY" and "24hr RESPONSE TIME" only.
- **Severity:** 🟠 HIGH

---

### H4 · Interactive Sandbox: "BOOK A SESSION" CTA Blocked by Sandbox

- **Page:** `index.html`  
- **Viewport:** All mobile
- **Element:** "Learn From Us" section — `a.btn-thunderbolt` (BOOK A SESSION button)
- **Problem:** Screenshot `iphonese_index_scroll12` shows the "BOOK A SESSION" button spans 100% width correctly. However, the `Learn From Us` section has no top-level heading visible before the button — the section heading "DON'T JUST BUY FROM US — LEARN FROM US" is being cut off at the top of the viewport, making the CTA appear in a disconnected context with no headline above it.
- **Severity:** 🟠 HIGH

---

### H5 · Mobile Menu: No Hamburger Button on contact.html and pay.html

- **Page:** `contact.html`, `pay.html`
- **Viewport:** All mobile
- **Element:** Mobile nav `<header>` — `#mobile-menu-btn`
- **Problem:** The CSS at `shared-styles.css:1244` reads:
  ```css
  @media (max-width: 767px) {
    #mobile-menu-btn, #mobile-menu-overlay { display: none !important; }
  }
  ```
  This `!important` rule **globally hides the hamburger button** on all pages ≤767px. The mobile menu is non-functional on every page. Users cannot navigate between pages from the mobile nav.
- **Root Cause:** A conflicting CSS rule from the v4 optimization pack aggressively hides the elements.
- **iOS/Android:** Both affected.
- **Severity:** 🟠 HIGH

---

### H6 · Stat Cards: Typography Too Small on 320px Android

- **Page:** `index.html`
- **Viewport:** 320×568 (Small Android)
- **Element:** `.stat-number` and `.font-label-caps` within `.stat-card`
- **Problem:** `.stat-number` at `22px` (380px breakpoint) and stat label at `9px` (`font-label-caps` override). On 320px, the 9px label text for "ON-TIME DELIVERY" and "RESPONSE TIME" is below WCAG AA minimum legibility threshold.
- **WCAG Violation:** Small text below 14px / 4.5:1 contrast ratio.
- **Severity:** 🟠 HIGH

---

### H7 · Forged Creations: Detail Panel Hidden — No Mobile Disclosure

- **Page:** `index.html`
- **Viewport:** All mobile
- **Element:** `#showcase-detail-wrapper` — `display: none !important` on mobile
- **Problem:** CSS rule `#showcase-detail-wrapper { display: none !important; }` completely hides the project detail panel on mobile. When a user taps a project selector (e.g., "Smart Irrigation System"), the detail panel appears only if JS adds `.flex`, but from the screenshots, the expanded detail panel shows project info without any visible tap trigger or indication that the user can see more. The "FARMNE..." live dashboard screenshot appears abruptly without context labels.
- **Severity:** 🟠 HIGH

---

## SECTION 3 — MEDIUM SEVERITY ERRORS 🟡

### M1 · Hero Emblem: Border-Radius Causes Cropped Circular Logo

- **Page:** `index.html`
- **Element:** Hero panel image (zeus emblem)
- **Problem:** The logo circle (Zeus IoT Logo) in the nav shows `border-radius: 50%` which renders correctly. However the same logo in the hero panel (`img[alt="Zeus IoT Logo"].w-full`) renders the full rectangular image with `background: transparent` — but the parent container clips it. On mobile, the emblem appears smaller than intended and the glow effect is barely visible at 375px due to reduced viewport width reducing the glow `filter` spread.
- **Severity:** 🟡 MEDIUM

---

### M2 · Testimonials Section: Marquee Converted to Scroll — But First Card Clipped

- **Page:** `index.html`
- **Viewport:** All mobile
- **Element:** `.animate-marquee` (testimonial cards)
- **Problem:** The CSS correctly replaces the marquee with a snap-scroll container. However the first `.testimonial-card` has no `padding-left` gap from the container edge, meaning it renders flush against the left edge with no breathing room. Users see 78vw card but cannot see any "peek" of the next card without scrolling, reducing discoverability of the carousel.
- **Fix:** Add `padding-left: 16px` to the scroll container, and a negative `margin-left: -16px` on the parent to maintain edge-to-edge feel.
- **Severity:** 🟡 MEDIUM

---

### M3 · Bottom Nav: WhatsApp FAB z-index Conflict on Scroll

- **Page:** All pages
- **Element:** `.whatsapp-float` (z-index: 45) vs `nav.fixed.bottom-0` (z-index: 50)
- **Problem:** The WhatsApp FAB at `z-index: 45` is correctly beneath the bottom nav at `z-index: 50`. However, the FAB `bottom` position is `calc(68px + env(safe-area-inset-bottom))`. On iPhone with dynamic island (iPhone 14 Pro, 14 Pro Max), the safe-area-inset-bottom is 34px, making the FAB position `68 + 34 = 102px` from bottom — which is too high and leaves a large visual gap between FAB and bottom nav.
- **iOS Specific:** iPhone 14 Pro/Pro Max with Dynamic Island.
- **Severity:** 🟡 MEDIUM

---

### M4 · Contact Form Step 2: "Deadline Date" Input Shows Raw dd-mm-yyyy

- **Page:** `contact.html`
- **Viewport:** All mobile
- **Element:** `input[type="date"]` — date input field
- **Problem:** Screenshot `iphonese_cont_st2` shows the date input displaying "dd-mm-yyyy" as placeholder text. On iOS Safari, `input[type="date"]` renders as a native date picker — but the placeholder text is styled in the JetBrains Mono monospace font and appears very small (~11.5px). The date format "dd-mm-yyyy" doesn't match the iOS native date picker format, causing user confusion.
- **iOS Specific:** iOS Safari renders date inputs differently from Chrome.
- **Severity:** 🟡 MEDIUM

---

### M5 · Pay Page: QR Code Section Scroll — Merchant Info Below Viewport

- **Page:** `pay.html`
- **Viewport:** 375×667 (iPhone SE)
- **Element:** `#qr-card-trigger` and merchant details column
- **Problem:** On iPhone SE, the QR code takes up a large portion of the card. The merchant name "Viswanathan Vishal" and UPI ID are stacked below in `flex-col` on mobile, requiring scroll to reach. Users should see QR + UPI ID in the same viewport to enable simultaneous scanning and verification.
- **Severity:** 🟡 MEDIUM

---

### M6 · Pricing Cards: "Most Popular" Badge Clipped on Scroll Start

- **Page:** `index.html`
- **Element:** `.absolute.-top-3` (pricing card badge)
- **Problem:** The "Most Popular" badge uses `position: absolute; top: -12px`. In the horizontal scroll carousel, the first visible card's badge is clipped by the parent container's `overflow: hidden` from the mobile carousel. The badge appears cut off on the top edge.
- **Severity:** 🟡 MEDIUM

---

### M7 · Core Capabilities Bento: Tech Stack Tags Wrapping Awkwardly

- **Page:** `index.html`
- **Element:** `.flex.gap-2.z-10.mt-auto.flex-wrap span` (tech stack tags in bento cards)
- **Problem:** Within the bento card "Custom Hardware & IoT", the technology tags (e.g., "ESP32", "STM32", "MQTT") wrap to 3+ rows on mobile, consuming excessive vertical space within the already-compact bento card. The card content becomes visually cluttered.
- **Severity:** 🟡 MEDIUM

---

### M8 · "Learn From Us" Heading Text Overflow at Top of Viewport

- **Page:** `index.html`
- **Viewport:** All mobile
- **Element:** Section heading "DON'T JUST BUY FROM US — LEARN FROM US"
- **Problem:** Screenshot `iphonese_index_scroll12` shows the heading text wrapping across 3 lines — "DON'T JUST BUY FROM US — LEARN / FROM US". The em-dash creates an awkward line break. At `font-size: clamp(20px, 5vw, 28px)`, the 375px width renders this at approximately 19px, which is correct. But the line break position is poor — "LEARN" sits alone on line 2, "FROM US" on line 3.
- **Severity:** 🟡 MEDIUM

---

## SECTION 4 — LOW SEVERITY ERRORS 🟢

### L1 · FAQ Accordion: Answer Text Slightly Below Minimum Size

- **Page:** `index.html`
- **Element:** `.faq-answer p` — `font-size: 13px`
- **Problem:** FAQ answer body text is set to 13px on mobile (CSS override). WCAG 2.1 AA recommends a minimum of 14px for body text, 16px for comfort. At 13px with JetBrains Mono, readability suffers for users with low vision.
- **Severity:** 🟢 LOW

---

### L2 · Bottom Nav: Active State Indicator — Inconsistent Between Pages

- **Page:** All pages
- **Element:** `nav.fixed.bottom-0` — active nav item
- **Problem:** On `index.html`, the "Home" icon uses `font-variation-settings: 'FILL' 1` (filled icon). On `contact.html`, the "Contact" icon is active but uses a text-color highlight only without a background chip or indicator dot. The active state styling is inconsistent across pages — some use the gold color + background, others just use the icon fill.
- **Severity:** 🟢 LOW

---

### L3 · Scroll Progress Bar Hidden on Mobile

- **Page:** All pages
- **Element:** `#scroll-progress` — CSS `display: none !important` on mobile
- **Problem:** The scroll progress bar is deliberately hidden on mobile (`v5` optimization). While this is intentional (avoids repaints), it removes a useful orientation cue for long-scrolling pages. Consider a minimal dot-indicator or section progress UI instead.
- **Severity:** 🟢 LOW

---

### L4 · Footer Logo Duplication — Logo Appears Twice

- **Page:** `index.html`
- **Viewport:** All mobile
- **Element:** Footer section — two logo instances
- **Problem:** Screenshot `iphonese_index_scroll14` shows the Zeus IoT logo appearing twice: once in the sticky nav bar at the top, and once as a large footer logo. On mobile, this creates a redundant repetition. The footer logo size (`text-[24px]` "ZEUS IOT" text) is fine, but the full emblem image above it creates an awkward double-logo visual on small screens.
- **Severity:** 🟢 LOW

---

### L5 · Pay Page: "CANCEL TRANSACTION" Button Has No Action

- **Page:** `pay.html`
- **Element:** `button.btn-ghost` "CANCEL TRANSACTION"
- **Problem:** The Cancel button has no `onclick` handler or `href`. On mobile, tapping it does nothing. Users expect it to navigate back or show a confirmation dialog. This is a dead UI element.
- **Severity:** 🟢 LOW

---

### L6 · Preloader Rotation Bug on Back Navigation

- **Page:** All pages (especially iOS Safari)
- **Element:** `#page-preloader .preloader-bolt`
- **Problem:** On iOS Safari, navigating back from a page (using the swipe-back gesture) triggers `pageshow`, which should clear the preloader rotation class. However, the `window.addEventListener('pageshow')` listener removes the rotation class but may not reset the preloader's `hidden` class in all cases, causing a brief flash of the preloader on back navigation.
- **iOS Specific:** Safari's BFCache (Back-Forward Cache).
- **Severity:** 🟢 LOW

---

## SECTION 5 — ANIMATION & PERFORMANCE ISSUES ⚡

### A1 · Continuous Background Animations Still Running on Mobile (GPU Drain)

- **Elements:** `.bg-blob` (set to `display: none` ✅), `#particles-bg` (set to `display: none` ✅), but `.circuit-bg` background SVG pattern still renders
- **Problem:** The `.circuit-bg` class applies an SVG background-image that tiles across the entire body. On mobile, this generates continuous rasterization work. While not animated, it still adds to composite layers.
- **Severity:** ⚡ PERFORMANCE

---

### A2 · `animate-marquee` on Mobile Has No `will-change` Property

- **Elements:** `.animate-marquee` (converted to snap-scroll on mobile)
- **Problem:** When transitioning from marquee animation to snap-scroll layout, the CSS removes `animation` but doesn't add `will-change: transform` or `transform: translateZ(0)` to force GPU compositing for the scroll container. On Android Chrome, this can cause scroll jank during momentum scrolling.
- **Severity:** ⚡ PERFORMANCE

---

### A3 · Boot Sequence Font Loading Blocks Render

- **Element:** `#boot-sequence` — uses `font-family: 'Fira Code', monospace`
- **Problem:** The boot sequence element references 'Fira Code' font which is NOT preloaded in the `<head>`. This causes a FOUT (Flash of Unstyled Text) during the boot animation on first load.
- **Severity:** ⚡ PERFORMANCE

---

## SECTION 6 — ACCESSIBILITY VIOLATIONS ♿

| ID | Element | Issue | WCAG Criterion | Severity |
|----|---------|-------|---------------|----------|
| ACC1 | `.btn-thunderbolt` "IGNITE PROJECT" | No `aria-label`, text content is sufficient but icon-only states lack labels | 1.1.1 | Medium |
| ACC2 | `#mobile-menu-btn` | Missing `aria-expanded` and `aria-controls` attributes | 4.1.2 | High |
| ACC3 | Testimonial cards in carousel | No `role="region"` or `aria-label` on carousel container | 1.3.1 | Medium |
| ACC4 | FAQ accordion | `faq-btn` uses `<button>` ✅ but missing `aria-expanded` state toggle | 4.1.2 | High |
| ACC5 | Form inputs in contact.html | Floating label inputs have no explicit `<label for="">` connection | 1.3.1 | High |
| ACC6 | QR Code image | `<img alt="UPI QR Code">` — alt text is functional ✅ | — | Pass |
| ACC7 | Bottom nav icons | Material Symbols icons lack `aria-hidden="true"` + adjacent text is too small (9px) | 1.4.4 | Medium |
| ACC8 | Color contrast: stat labels | `.font-label-caps` 9px gray text on dark background fails 4.5:1 ratio | 1.4.3 | High |

---

## SECTION 7 — iOS vs ANDROID COMPATIBILITY

| Issue | iOS Safari | Android Chrome | Notes |
|-------|-----------|---------------|-------|
| `backdrop-filter: blur()` | ✅ Native support | ✅ Supported (Chrome 76+) | Works on both |
| `env(safe-area-inset-*)` | ✅ Critical for notch/island | ❌ Not applicable | iOS only — currently applied |
| `input[type="date"]` render | ⚠️ Shows native calendar picker | ✅ Shows standard input | Style conflict on iOS |
| Vibration API (haptics) | ❌ NOT supported on iOS | ✅ Supported | No haptic feedback on iOS |
| Web Share API | ✅ Supported | ✅ Supported | Working on both |
| `scrollend` event | ⚠️ Safari 16.4+ only | ✅ Chrome 114+ | Carousel haptics may fail on older iOS |
| PWA `standalone` mode | ✅ Works with manifest | ✅ Works | Both support PWA |
| `-webkit-overflow-scrolling: touch` | ✅ Required for momentum | Deprecated (ignore) | iOS needs this |
| CSS `overscroll-behavior` | ✅ iOS 16+ | ✅ Chrome | Works on modern devices |
| `backdrop-filter` in overlay | ⚠️ Requires `-webkit-backdrop-filter` | ✅ Standard | Both prefixes used ✅ |

---

## SECTION 8 — WHAT WORKS WELL ✅

- **Bottom Navigation:** Properly fixed, safe-area aware, icons clearly labeled
- **Liquid Glass Nav:** `backdrop-filter: blur(16px)` renders beautifully on iOS
- **Preloader:** Smooth animation, correct logo treatment
- **How It Works Cards:** Stack cleanly in single column on mobile
- **QR Code Fullscreen Modal:** Correct on all tested viewports
- **Interactive Sandbox:** Fits within mobile viewport without overflow
- **Font Sizes:** `input { font-size: 16px !important }` prevents iOS auto-zoom ✅
- **Horizontal Overflow:** No page-level horizontal scroll observed ✅
- **Touch Targets:** Most CTAs meet 44px minimum ✅
- **Forged Creations List:** Tap targets on project selectors are adequate

---

*Report generated: 2026-06-21 by Antigravity AI audit engine*
*Screenshots stored in: `brain/4f627e79-1736-4d4d-ad2d-b2ef63d29f7e/`*
