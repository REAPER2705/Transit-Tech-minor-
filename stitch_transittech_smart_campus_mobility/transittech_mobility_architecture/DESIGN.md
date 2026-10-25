---
name: TransitTech Mobility Architecture
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '800'
    lineHeight: 4rem
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '800'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.06em
  telemetry-metric:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 1.75rem
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-precision, enterprise-grade mobility operations interface tailored for institutional campus transit networks. The visual style is an architectural hybrid: clean, high-clarity daylight operational surfaces juxtaposed against rich nocturnal telemetry overlays designed for sustained spatial tracking.

### Core Philosophy
- **Cognitive Precision:** Fleet state, vehicle velocity, occupancy thresholds, and stop schedules must be instantly interpretable under direct sunlight or late-night route monitoring.
- **Instrumental Elegance:** Visuals evoke aerodynamic aviation cockpits and contemporary intelligent transportation infrastructure—austere, calculated, and functional.
- **Depersonalized Role Clarity:** Identity is governed by operational responsibility rather than individual personas. Visual indicators strictly denote roles: `Passenger`, `Driver`, `Conductor`, and `Transport Administrator`.

### Style Definition
The aesthetic mixes **Modern Corporate** structure with **Precision Glassmorphism** and subtle telemetry glow effects. Bright, crisp card surfaces anchor administrative tables and ticketing dashboards, while the geographic transit map and live HUD overlays transition into deep midnight obsidian surfaces with low-emissive borderlines.

## Colors

The palette balances clean administrative surfaces with deep geospatial nocturnal zones. Color is deployed systematically: accent colors communicate active trajectory, movement, and velocity, while status hues denote real-time compliance and route deviation.

### Surface System
- **Daylight Canvas (`#F8FAFC`):** Primary application backdrop; neutral, warm-slate tone mitigating screen glare.
- **Pure Elevated Surface (`#FFFFFF`):** High-priority administrative cards, modal sheets, and active form modules.
- **Cool Inset Surfaces (`#F1F5F9`):** Input containers, nested telemetry blocks, inactive lane indicators.
- **Deep Obsidian Surface (`#0B1120`):** Core map canvas base, geo-tracking boundaries, and floating night HUD elements.
- **Slate Night Surface (`#0F172A` / `#1E293B`):** Telemetry pills, persistent route monitors, and telemetry inspector docks.

### Palette Hierarchy & Status
- **Primary Transit Blue (`#2563EB` / `#1D4ED8`):** Navigation states, direct CTAs, primary bus node vectors, and primary directional arcs.
- **Route Active Violet (`#4F46E5` / `#6366F1`):** Polyline path highlights, selected vehicle vectors, and interactive geo-fences.
- **Telemetry Emerald (`#10B981`):** On-time arrivals, nominal capacity (<75%), authenticated driver uplink, and verified stops.
- **Warning Amber (`#F59E0B`):** Route deviations, traffic latency bottlenecks, intermediate delays, and moderate passenger overload (>85%).
- **Critical Crimson (`#EF4444`):** Emergency stops, off-route alerts, maintenance dropouts, and cancelled departures.
- **Structural Lines (`#E2E8F0` / dark: `#1E293B`):** Razor-thin 1px structural framing preserving layout stability.

## Typography

Typography prioritizes rapid scanning of numeric coordinates, ETAs, route identifiers, and diagnostic labels. Plus Jakarta Sans provides geometric legibility with modern humanist proportions, ensuring alphanumeric pairings (e.g., `BUS-04`, `ETA 12m`, `AITR-GATE-2`) do not degrade at small sizes.

### Application Rules
- **Numerical Formatting:** All numeric values inside badges and data matrices must utilize tabular figures (`tnum`) to maintain structural alignment across dynamic updates.
- **Hierarchy of Operational Text:** Route titles, stop identifiers, and directional signages use `headline-md` and `headline-lg` in bold weights (`fontWeight: 600–700`).
- **Telemetry Labels:** Metric labels (`label-sm`, `label-md`) must consistently render uppercase with positive tracking (`letter-spacing: 0.04em` to `0.06em`) to preserve legibility in ambient glass badges.

## Layout & Spacing

The interface employs a hybrid layout model: a full-bleed dynamic GIS view coupled with a 12-column administrative docking system.

### Grid Architecture
- **Desktop (1280px and above):** 12-column fluid grid with `gutter-desktop: 1.5rem` and `margin-desktop: 2.5rem`. The telemetry control panel snaps to a persistent 380px or 4-column side dock, freeing remaining columns for the interactive spatial tracking canvas.
- **Tablet (768px – 1279px):** 8-column layout with `margin-tablet: 1.5rem`. Route panels collapse into a high-density, multi-layer drawer system sliding over the map canvas.
- **Mobile (<768px):** 4-column layout with `margin: 1rem`. Bottom-anchored modal sheets accommodate ETA, vehicle search, and role verification, keeping thumb interactions within bottom reach.

### Spacing Cadence
- Padding adheres strictly to a 4px baseline rhythm. Critical HUD metrics and live telemetry tiles utilize compact spacing (`space-sm` to `space-md`), preventing layout overflow during data surges.
- Page canvases and macro panels leverage `space-lg` to `space-xl` to maintain distinction between spatial tracking tools and record tables.

## Elevation & Depth

Depth in this system is driven by tonal segregation and functional translucent layering rather than blunt vertical drops.

### Elevation Tiers
- **Tier 0 (Map Surface / Base):** `#0B1120` or `#F8FAFC`. Zero elevation, persistent background canvas.
- **Tier 1 (Surface Containers):** Pure white `#FFFFFF` (light mode) or `#1E293B` (dark mode) resting over Tier 0. Framed with a 1px border (`#E2E8F0` or `#334155`). Shadow is ambient and imperceptible: `0 1px 3px 0 rgba(15, 23, 42, 0.04)`.
- **Tier 2 (Telemetry Glass HUD & Floating Overlays):** Semi-transparent `#0F172A` with `85%` opacity, paired with an active backdrop filter of `blur(12px)`. Outlined by a crisp highlight rim of `1px solid rgba(255, 255, 255, 0.12)`. Applied to active bus tracking pills, mini-compass arrays, and floating speedometers.
- **Tier 3 (Modals, Overlays, High-Priority Alert Banners):** Elevated components feature dual-layer ambient diffusion: `0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)`. Edge highlight: `1px solid rgba(15, 23, 42, 0.08)`.

## Shapes

The geometric framework uses controlled radii to maintain a streamlined aerodynamic aesthetic without appearing juvenile.

### Shape Hierarchy
- **Base Components (`roundedness: 2`, 0.5rem / 8px):** Input text fields, table cell badges, dropdown items, and control buttons.
- **Compound Cards (`rounded-lg`, 1rem / 16px):** Telemetry dashboard widgets, operational manifest sheets, and alert modals.
- **Interactive Floating Panels (`rounded-xl`, 1.5rem / 24px):** GIS tracking cards, fleet overview drawers, and driver manifest containers.
- **Indicators & Status Caps (`rounded-full`):** Identity role tags, GPS live beacons, directional compass caps, and occupancy chips.

## Components

### 1. Buttons
- **Primary Operational:** Deep transit blue (`#2563EB`) background, white text, 0.5rem corner radius, 1px highlight border (`#3B82F6`). On hover: `#1D4ED8`. Active state transitions smoothly with no dramatic vertical displacement.
- **Secondary / Ghost:** Transparent background with 1px border `#E2E8F0` (light) or `#334155` (dark). Text `#1E293B` (light) or `#F8FAFC` (dark).
- **Telemetry Control:** Dark glass surface (`rgba(15, 23, 42, 0.85)`), backdrop blur 12px, border `rgba(255, 255, 255, 0.15)`. Text `#FFFFFF`.

### 2. Role Badges
Strict role enforcement requires distinct identity categorization. Badges are pill-shaped (`rounded-full`), rendered in uppercase `label-sm` with a preceding status dot:
- **`TRANSPORT ADMINISTRATOR`:** Rich slate violet background (`#EEF2FF`), text `#4338CA`, border `#C7D2FE`. Dark variant: `#312E81`, text `#C7D2FE`.
- **`DRIVER`:** Sky blue tint (`#EFF6FF`), text `#1D4ED8`, border `#BFDBFE`. Dark variant: `#1E3A8A`, text `#93C5FD`.
- **`CONDUCTOR`:** Teal/Cyan tint (`#ECFDF5`), text `#047857`, border `#A7F3D0`. Dark variant: `#064E3B`, text `#6EE7B7`.
- **`PASSENGER`:** Neutral slate tint (`#F1F5F9`), text `#475569`, border `#E2E8F0`. Dark variant: `#1E293B`, text `#94A3B8`.

### 3. Inputs & Search Fields
- Inset container `#F8FAFC` with 1px border `#CBD5E1`. On focus: dynamic ring of `2px solid #2563EB` with an offset of 1px.
- Specialized GPS Location Inputs incorporate clear terminal icons (`Origin`, `Transit Hub`, `Destination`) with fixed monospaced route prefixing.

### 4. Telemetry Glass Badges & Route Cards
- Route cards leverage clean white backgrounds framed by `#E2E8F0`. Header houses the Route Number (e.g., `ROUTE 12 - INDORE BYPASS`) alongside an animated live status ping.
- Occupancy gauges leverage segmented progress bars displaying three levels: Calm (`#10B981`), Nominal (`#F59E0B`), and Peak (`#EF4444`).

### 5. Checkboxes, Radios, and Toggles
- Built with a firm 1.5px boundary. Checked state fills directly with Transit Blue (`#2563EB`) housing a crisp geometric checkmark.
- Route visibility toggles on GIS layers feature an internal pulsing micro-dot denoting active live-stream sockets.