---
name: Olympian High-Tech
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#909097'
  outline-variant: '#45464d'
  surface-tint: '#bec6e0'
  primary: '#bec6e0'
  on-primary: '#283044'
  primary-container: '#0f172a'
  on-primary-container: '#798098'
  inverse-primary: '#565e74'
  secondary: '#ffc640'
  on-secondary: '#402d00'
  secondary-container: '#e3aa00'
  on-secondary-container: '#5a4100'
  tertiary: '#2fd9f4'
  on-tertiary: '#00363e'
  tertiary-container: '#001b20'
  on-tertiary-container: '#008ea1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#ffdf9f'
  secondary-fixed-dim: '#f9bd22'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#a2eeff'
  tertiary-fixed-dim: '#2fd9f4'
  on-tertiary-fixed: '#001f25'
  on-tertiary-fixed-variant: '#004e5a'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered for a custom IoT and education enterprise, blending the raw power of classical mythology with the precision of modern engineering. The brand personality is **Heroic, Authoritative, and Electrifying**, aimed at students, makers, and industrial partners who seek to "harness the bolt" of innovation.

The visual style is a fusion of **Glassmorphism** and **High-Tech Modernism**. It utilizes deep atmospheric layers to simulate a storm-laden sky, illuminated by vibrant, neon-flecked accents. UI elements should feel like sophisticated control panels—translucent, glowing, and structurally sound—evoking a sense of being at the helm of a powerful technological force.

## Colors

The palette is rooted in a "Stormy Night" dark mode to maximize the impact of "Electric" accents.

- **Primary (Deep Storm):** `#0F172A` — Used for the canvas and deep architectural layers. It provides a stable, professional foundation.
- **Secondary (Electric Gold):** `#FBBF24` — Reserved for high-priority actions, achievement markers, and "Zeus" motifs. It represents the spark of power.
- **Tertiary (Neon Cyan):** `#22D3EE` — Used for technical data, IoT connectivity indicators, and glowing "live" states.
- **Neutral (Cloud White):** `#F8FAFC` — Ensures high-contrast legibility for body text and structural outlines.

Apply gradients sparingly, specifically using a "Lightning Gradient" (Cyan to Gold) for progress bars or active states to simulate energy flow.

## Typography

Typography in this design system balances the "Titan" scale of headlines with the "Circuitry" precision of labels.

- **Headlines:** Use **Montserrat** in Bold or Extra Bold. All-caps should be used for Section Titles to emphasize authority.
- **Body:** **Inter** provides a neutral, highly readable counterpoint to the aggressive headings, ensuring technical documentation remains accessible.
- **Technical/Labels:** **JetBrains Mono** is introduced for small labels, IoT metadata, and code snippets to reinforce the "built by engineers" aesthetic.

Text contrast must remain high; use Neutral-200 for secondary body text and Electric Gold only for critical emphasizes.

## Layout & Spacing

The layout follows a **Rigid Geometric Grid** with expansive outer margins to create a "heroic" sense of scale.

- **Grid:** A 12-column fluid grid for desktop, collapsing to 4 columns on mobile.
- **Rhythm:** An 8px base unit governs all padding and margins. 
- **The "Strike" Alignment:** Use asymmetrical layouts where imagery or large icons "break" the grid lines, mimicking the unpredictable path of a lightning bolt.
- **IoT Dashboards:** Use a bento-box style layout for data visualizations, with consistent 24px gutters between glass panels.

## Elevation & Depth

Depth is achieved through **Glassmorphic stacking** rather than traditional drop shadows.

1.  **Base Layer:** The Deep Storm (#0F172A) background with a subtle "Circuitry" SVG pattern at 5% opacity.
2.  **Glass Panels:** Semi-transparent surfaces (White at 5-10% opacity) with a `backdrop-filter: blur(12px)`.
3.  **Outlines:** Instead of shadows, use 1px "Inner Glow" borders. Use a top-left gradient border (Cyan to Gold) to suggest light hitting the edge of a crystalline surface.
4.  **Active Elevation:** When a component is hovered or active, increase the `backdrop-filter` strength and add a soft external glow (`box-shadow`) using the Tertiary Cyan at 20% opacity.

## Shapes

The shape language is **Crystalline and Sharp**. While accessibility requires some rounding, the design system leans toward "Soft-Hexagonal" influences.

- **Corner Radius:** A standard 4px (`rounded-sm`) to 8px (`rounded-md`) is used for most containers to maintain a technical, precision-machined feel.
- **The "Bolt" Motif:** Buttons and decorative accents should utilize 45-degree chamfered corners (clipped corners) rather than full rounds to mimic the jagged nature of lightning.
- **Iconography:** Use thick-stroke (2px) icons with open paths and sharp terminals.

## Components

### Buttons
- **Primary (The Thunderbolt):** High-contrast Electric Gold background with black text. On hover, add a 4px Cyan "glow" shadow. Use a slight skew or chamfered right edge.
- **Ghost (The Static):** Transparent background with a 1px Cyan border. On hover, the background fills with 10% Cyan.

### Cards
- **IoT Data Cards:** Glassmorphic background, blurred, with a "Power Indicator" line at the very top (Gold for active, Cyan for standby). 
- **Content Cards:** Feature a large Montserrat heading and a "Bolt" icon in the bottom right corner.

### Inputs & Form Fields
- Fields are dark, sunken containers with 1px Stormy-Blue borders. 
- The focus state triggers a "Full Circuit" glow—the entire border turns Cyan and a subtle pulse animation occurs.

### "Bolt" Indicators
- Custom progress bars and success messages should use a zig-zag "lightning" path for the loading state to reinforce the Zeus theme.
- **Chips:** Small, sharp-edged tags with mono-type fonts, color-coded by electrical voltage levels (e.g., High Power = Gold, Low Power = Cyan).