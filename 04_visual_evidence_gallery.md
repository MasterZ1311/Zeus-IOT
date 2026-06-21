# 📸 ZEUS IOT — Mobile Audit Visual Evidence Gallery

> Screenshots captured live from localhost:3000 using Chrome DevTools Device Emulation
> **Date:** 2026-06-21 | Auditor: Antigravity AI

---

## iPhone SE 375×667 — index.html

### Hero Section
![iPhone SE — Hero](iphonese_index_hero_1782027356119.png)
*Issues: Hero emblem takes 220px+ vertical space; headline cuts across viewport; CTAs not visible without scroll; WhatsApp FAB correctly placed at bottom-right.*

---

### Stats + How It Works
![iPhone SE — Stats & How It Works](iphonese_index_scroll2_1782027371965.png)
*Issues: Only 2 of 4 stats visible (top row only); "How It Works" section heading readable; step cards stack correctly.*

---

### Core Capabilities Bento
![iPhone SE — Core Capabilities](iphonese_index_scroll3_1782027378619.png)
*Positive: Bento collapses to single column correctly; icon sizes appropriate; text legible at 15px.*

---

### Interactive IoT Sandbox
![iPhone SE — IoT Sandbox](iphonese_index_scroll5_1782027391270.png)
*Positive: Sandbox widget fits within viewport; relay toggle accessible; uptime counter readable in JetBrains Mono.*

---

### Forged Creations / Project Detail
![iPhone SE — Project Detail](iphonese_index_scroll8_1782027413974.png)
*Issues: Dashboard screenshot appears without context; "VIEW ALL PORTFOLIO" link small but accessible.*

---

### Smart Irrigation Detail Panel
![iPhone SE — Irrigation Detail](iphonese_index_scroll8_1782027413974.png)
*Positive: Project detail renders within screen width; code font legible; telemetry logs styled correctly.*

---

### Learn From Us Section
![iPhone SE — Learn From Us](iphonese_index_scroll12_1782027438926.png)
*Issues: Section heading truncated at viewport top; BOOK A SESSION button full-width ✅; feature list items readable.*

---

### Footer
![iPhone SE — Footer](iphonese_index_scroll14_1782027452116.png)
*Issues: Logo duplicated (in nav + footer); footer links stack in single column; spacing adequate.*

---

## Small Android 320×568 — index.html

### Hero (Critical Overflow)
![Small Android — Hero](smallandroid_idx_top_1782027493030.png)
*CRITICAL: WhatsApp FAB overlaps the hero headline text "CUSTOM IOT & SOFTWARE". The green circle covers the last word of the headline making it unreadable.*

---

## iPhone 14 390×844 — index.html

### Hero (More Space)
![iPhone 14 — Hero](iphone14_index_top_1782027480549.png)
*Better: More vertical space allows CTAs partially above fold; FAB doesn't overlap text at 390px width.*

---

### Pay Page
![iPhone 14 — Pay](iphone14_pay_top_1782027728872.png)
*Positive: QR + merchant details visible together on larger viewport; security badge readable.*

---

## Samsung Galaxy S21 360×800 — index.html

### Hero
![Galaxy S21 — Hero](galaxys21_index_top_1782027489044.png)
*Similar to iPhone SE; emblem block large relative to screen; headline legible; status badge visible.*

---

### Pay Page
![Galaxy S21 — Pay](galaxys21_pay_top_1782027733175.png)
*Positive: QR code clearly visible; "256-BIT ENCRYPTED" badge renders correctly; heading gradient text sharp.*

---

## contact.html — iPhone SE 375×667

### Step 1 — Tier Selection
![Contact — Step 1 Tier](iphonese_cont_top_1782027501864.png)
*Positive: Form card renders within bounds; tier selector cards full-width; Basic/Custom tiers visible.*

---

### Step 2 — Project Details
![Contact — Step 2 Details](iphonese_cont_st2_1782027526602.png)
*CRITICAL: After tapping Next Step, scroll position stays at Step 2's bottom — fields above viewport.
Issue: Date input shows "dd-mm-yyyy" placeholder; Back and Next Step buttons full-width ✅.*

---

### Step 2 — Sticky CTAs
![Contact — Step 2 CTAs](iphonese_cont_st2t_1782027531803.png)
*Positive: Sticky CTA bar shows Back (narrow) + Next Step (wide) buttons. Layout correct but Back button width too narrow.*

---

### Form Validation State
![Contact — Validation](iphonese_cont_val_1782027581104.png)
*Positive: Red border highlights on invalid fields work; however no error message text visible below the field.*

---

### Payment Prep
![Contact — Payment Prep](iphonese_cont_prep_1782027797935.png)
*Positive: Pricing summary shows correctly before payment redirect.*

---

## pay.html — iPhone SE 375×667

### Pay Page Top
![Pay — Top](iphonese_pay_top_1782027686387.png)
*Positive: Security shield animation visible; "256-BIT ENCRYPTED" badge centered; gradient headline sharp.*

---

### QR Code Section
![Pay — QR Section](iphonese_pay_scr1_1782027694573.png)
*Issues: QR code card large but merchant details below the fold requiring scroll; UPI copy button too small.*

---

### Verification Panel
![Pay — Verification](iphonese_pay_scr2_1782027705474.png)
*Positive: Upload zone full-width; clear call-to-action text; Submit button full-width with icon.*

---

### UPI Copy Toast
![Pay — Copy Toast](iphonese_pay_toast_1782027723356.png)
*Positive: "Copied!" toast appears; but positioned slightly off-center on small screen.*

---

## Key Annotated Issues Summary

| Screenshot | Issue Found | Fix ID |
|------------|------------|--------|
| `smallandroid_idx_top` | FAB overlaps headline | FIX-C1 |
| `iphonese_index_hero` | Hero emblem too tall, CTAs hidden | FIX-H1/H2 |
| `iphonese_index_scroll2` | Only 2 stats visible | FIX-H3 |
| `iphonese_cont_st2` | Scroll not reset on step change | FIX-C2 |
| All mobile | No hamburger menu visible | FIX-H5 |
| `iphonese_pay_scr1` | QR + merchant split across scroll | FIX-M4 |
| `iphonese_index_scroll12` | Section heading truncated | FIX-M8 |

---

*All screenshots stored at: `C:\Users\vishwa\.gemini\antigravity-ide\brain\4f627e79-1736-4d4d-ad2d-b2ef63d29f7e\`*
