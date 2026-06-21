# ⚡ ZEUS IOT — Mobile Audit Quick Reference

## 🔴 CRITICAL (Fix Immediately)

| # | Page | Bug | 1-Line Fix |
|---|------|-----|-----------|
| C1 | index.html | FAB overlaps headline on 320px | Add `@media (max-width: 360px) { .whatsapp-float { right: 8px; width: 40px } }` |
| C2 | contact.html | Scroll not reset on step change | Add `window.scrollTo({top:0})` in step transition JS |
| C3 | contact.html | 500 error shows no UI feedback | Replace try/catch with inline error banner |
| C4 | pay.html | Submit without upload — alert() fails | Replace alert() with inline validation UI |

---

## 🔴 THE #1 HIGHEST IMPACT FIX (1 LINE)

**In `shared-styles.css` around line 1244, DELETE this:**
```css
@media (max-width: 767px) {
  #mobile-menu-btn, #mobile-menu-overlay { display: none !important; }
}
```
**Result:** Hamburger menu restored on ALL pages immediately. This is the single most impactful fix.

---

## 🟠 HIGH (Fix This Sprint)

| # | Page | Bug | File |
|---|------|-----|------|
| H1+H2 | index.html | Hero image too tall → CTAs below fold | shared-styles.css |
| H3 | index.html | Only 2 of 4 stats visible on SE | shared-styles.css |
| H4 | index.html | "Learn From Us" heading truncated | shared-styles.css |
| H5 | All | **Mobile menu invisible** | shared-styles.css line ~1244 |
| H6 | index.html | Stat labels 9px — below WCAG | shared-styles.css |
| H7 | index.html | Project detail panel has no mobile reveal | index.html JS |

---

## 🟡 MEDIUM (Next Sprint)

| # | Bug | File |
|---|-----|------|
| M1 | Testimonial carousel flush to edge — no peek | shared-styles.css |
| M2 | FAB too high on Dynamic Island iPhones | shared-styles.css |
| M3 | Date input inconsistent on iOS Safari | shared-styles.css |
| M4 | QR + UPI ID split across scroll on SE | pay.html |
| M5 | Pricing badge clipped in carousel | shared-styles.css |
| M6 | Tech stack tags overflow bento card | shared-styles.css |
| M7 | "Learn From Us" heading line break | shared-styles.css |

---

## ♿ ACCESSIBILITY (WCAG 2.1 AA)

| Issue | Fix |
|-------|-----|
| #mobile-menu-btn missing `aria-expanded` | Add attribute + JS toggle |
| FAQ buttons missing `aria-expanded` | Add attribute + JS toggle |
| Contact form: no explicit `<label>` connection | Add `for=""` + `id=""` pairs |
| Material icons not `aria-hidden` | Add `aria-hidden="true"` via JS |
| 9px stat labels — below minimum | Increase to 10px minimum |

---

## 📐 Typography Quick Reference (Mobile)

| Role | Min Size | Current | Status |
|------|----------|---------|--------|
| H1 Display | 22px | `clamp(22px, 6.5vw, 32px)` | ✅ |
| H2 Section | 20px | 20px | ✅ |
| Body Large | 14px | 15px | ✅ |
| Body Medium | 14px | 14px | ✅ |
| Inputs | 16px | 16px | ✅ (iOS zoom) |
| Stat Labels | 10px | 9px on 380px | ❌ |
| FAQ Answer | 14px | 13px | ❌ |
| Code/Mono | 12px | 11.5px | ⚠️ |

---

## 📱 iOS vs Android Feature Matrix

| Feature | iOS Safari | Android Chrome | Notes |
|---------|-----------|---------------|-------|
| `navigator.vibrate()` | ❌ | ✅ | Need visual fallback for iOS |
| `backdrop-filter` | ✅ (-webkit-) | ✅ | Both prefixes in CSS |
| `env(safe-area-inset-*)` | ✅ Essential | ❌ N/A | iOS only |
| `input[type=date]` native UI | ⚠️ Calendar popup | ✅ Standard | Needs -webkit-appearance override |
| `scrollend` event | ⚠️ Safari 16.4+ | ✅ Chrome 114+ | Carousel haptics may fail |
| Web Share API | ✅ | ✅ | Both supported |
| BFCache (back navigation) | ✅ Active | ✅ Partial | Need pageshow persisted check |
| PWA Standalone mode | ✅ | ✅ | Both support manifest |
| CSS `dvh/svh` units | ✅ iOS 15.4+ | ✅ Chrome 108+ | Safe for modern devices |

---

## 📐 Safe Area Reference

```css
/* Complete safe area implementation */
header { padding-top: env(safe-area-inset-top, 0px); }
main { padding-top: calc(64px + env(safe-area-inset-top, 0px)); }
nav.bottom { padding-bottom: max(env(safe-area-inset-bottom, 8px), 8px); }
.whatsapp-float { bottom: calc(68px + env(safe-area-inset-bottom, 0px)); }

/* Landscape notch (iPhone, older iPads) */
@media (orientation: landscape) {
  main { padding-left: env(safe-area-inset-left, 16px); }
}
```

---

## 🧪 Pre-Release Mobile Testing Checklist

Before every deployment, test on:

- [ ] **iPhone SE (375×667)** — Smallest iOS
  - [ ] All 4 stats visible
  - [ ] CTAs above fold
  - [ ] Mobile menu opens
  - [ ] No FAB overlap
  
- [ ] **iPhone 14 (390×844)** — Standard iOS
  - [ ] Dynamic Island safe area
  - [ ] Contact form step transitions
  - [ ] Pay page QR + merchant info
  
- [ ] **Galaxy S21 (360×800)** — Standard Android
  - [ ] Haptic feedback on button taps
  - [ ] Carousel snap scroll smooth
  - [ ] Date input renders correctly
  
- [ ] **320×568** — Smallest Android
  - [ ] No horizontal overflow
  - [ ] FAB doesn't overlap content
  - [ ] Text readable

- [ ] **Landscape orientation** (any device)
  - [ ] Nav renders correctly
  - [ ] Content doesn't overflow
  - [ ] Sandbox widget visible

---

## 🎯 Bug Count Summary

| Severity | Count | Fixed | Remaining |
|----------|-------|-------|-----------|
| 🔴 Critical | 4 | 0 | **4** |
| 🟠 High | 7 | 0 | **7** |
| 🟡 Medium | 7 | 0 | **7** |
| 🟢 Low | 6 | 0 | **6** |
| ⚡ Performance | 3 | 0 | **3** |
| ♿ Accessibility | 8 | 0 | **8** |
| **TOTAL** | **35** | **0** | **35** |

---

*Quick Reference v1.0 — Zeus IOT Mobile Audit 2026-06-21*
