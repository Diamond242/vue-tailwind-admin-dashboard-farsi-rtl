# Bilingual + RTL Implementation Plan

## Goals
- Full bilingual UI: en + fa at runtime.
- Proper RTL for fa with zero LTR regressions.
- Persian typography with configurable font stack.
- Display Persian digits without changing raw data.
- Locale-aware date/number/currency formatting.

## Decisions (Locked)
- Locale currencies: fa -> IRR, en -> USD.
- Jalali calendar for all fa pages.
- Persian digits for display only; raw values remain Latin.
- Default Persian font: Vazirmatn (swapable later).
- This doc and the changelog must be updated after each phase.

## Current Stack (Repo Findings)
- Vue 3 + Vite + TypeScript.
- vue-router (route meta titles).
- Tailwind v4 CSS-first in `src/assets/main.css` (no tailwind config).
- Key libs: FullCalendar, flatpickr, ApexCharts, Swiper, Dropzone, jsvectormap.

## File Map (Key Locations)
- Entry: `src/main.ts`, root: `src/App.vue`, router: `src/router/index.ts`.
- Layout: `src/components/layout/*`.
- Global styles: `src/assets/main.css`.
- Forms: `src/components/forms/FormElements/*`.
- Calendar: `src/views/Others/Calendar.vue`.
- Charts: `src/components/charts/*`, `src/components/ecommerce/*`.
- Tables: `src/components/tables/*`.

## RTL Strategy (Recommended)
- Use logical properties (ms/me/ps/pe/start/end) as primary direction-neutral approach.
- Add `rtl`/`ltr` variants for exceptions.
- Introduce `tailwind.config.ts` to define logical utilities.
- Use `[dir="rtl"]` overrides in `src/assets/main.css` only when necessary.

## i18n Strategy (Recommended)
- Use `vue-i18n` Composition API.
- Locale file structure:
  - `src/locales/{en,fa}/common.json`
  - `src/locales/{en,fa}/layout.json`
  - `src/locales/{en,fa}/routes.json`
  - `src/locales/{en,fa}/auth.json`
  - `src/locales/{en,fa}/forms.json`
  - `src/locales/{en,fa}/tables.json`
  - `src/locales/{en,fa}/dashboard.json`
  - `src/locales/{en,fa}/profile.json`
  - `src/locales/{en,fa}/errors.json`
  - `src/locales/{en,fa}/ui.json`
  - `src/locales/{en,fa}/calendar.json`
  - `src/locales/{en,fa}/charts.json`
- Runtime switch updates i18n locale + `html[lang|dir]` + persistence.

## Jalali Strategy
- All fa pages use Jalali date representation.
- Calendar and date inputs must be backed by a stable Jalali adapter or picker.
- A short POC is required to select the most compatible Jalali solution for:
  - FullCalendar in `src/views/Others/Calendar.vue`
  - Date inputs in `src/components/forms/FormElements/*`
  - Optional date filters in `src/components/ecommerce/StatisticsChart.vue`

## Number + Currency Strategy
- Use `Intl.NumberFormat` per locale.
- Persian digits for display only; store and compute with Latin digits.
- Currency formatter uses IRR for fa and USD for en.

## Typography Strategy
- Load Vazirmatn in `src/assets/main.css`.
- Use CSS variables for font stacks to allow future swaps.
- Keep Outfit for en locale and apply Vazirmatn for fa via `html[lang="fa"]`.

## Phased Plan
### Phase 0: Documentation
- Objective: add this doc and a changelog.
- Files: `docs/i18n-rtl-plan.md`.

### Phase 1: i18n Core + Persistence
- Objective: i18n setup, runtime switch, set `html[lang|dir]`, persist choice.
- Files: `src/main.ts`, `src/App.vue`, `src/router/index.ts`, `src/components/layout/AppHeader.vue`, `src/locales/*`.

### Phase 2: RTL Foundation + Typography
- Objective: logical utilities + RTL variants + Vazirmatn.
- Files: `tailwind.config.ts`, `src/assets/main.css`, layout components.

### Phase 3: Core Text Extraction
- Objective: localize layout, auth, navigation, breadcrumb, titles.
- Files: `src/components/layout/*`, `src/components/common/PageBreadcrumb.vue`,
  `src/components/layout/header/*`, `src/views/Auth/*`.

### Phase 4: Jalali Calendar + Date Inputs
- Objective: Jalali calendar support across fa pages.
- Files: `src/views/Others/Calendar.vue`, `src/components/forms/FormElements/*`,
  `src/components/ecommerce/StatisticsChart.vue`, `src/assets/main.css`.

### Phase 5: Numbers/Charts/Tables Formatting
- Objective: locale-aware numbers/currency + chart label formatting.
- Files: `src/components/ecommerce/*`, `src/components/charts/*`, `src/components/tables/*`.

### Phase 6: QA + Linting
- Objective: guardrails against hardcoded strings and LTR-only classes.
- Files: `eslint.config.ts`, `package.json`.

## QA Targets
- Pages: Ecommerce, Calendar, UserProfile, FormElements, BasicTables, Alerts, Signin, Signup, 404.
- Breakpoints: 375, 640, 768, 1024, 1280, 1536.
- RTL checks: sidebar/header alignment, dropdowns, tables, charts tooltips, modals.

## Changelog
- 2025-12-30: Phase 0 complete. Added `docs/i18n-rtl-plan.md` and captured decisions.
- 2025-12-30: Phase 1 complete. Added i18n core, locale persistence, html lang/dir updates,
  and a header language toggle with initial en/fa locale files.
- 2025-12-30: Phase 2 complete. Added RTL/LTR variants, Vazirmatn font setup, and logical
  utilities via `tailwind.config.ts`.
- 2025-12-30: Phase 3 complete. Localized core layout, navigation, breadcrumbs, auth screens,
  and route titles with en/fa messages.
- 2025-12-30: Phase 4 complete. Added Jalali-ready date pickers via flatpickr-jalali-support,
  introduced a Jalali calendar view for fa, localized calendar UI strings, and normalized
  date storage with ISO-backed inputs.

## Next Start
- Phase 5: Numbers/charts/tables formatting.
