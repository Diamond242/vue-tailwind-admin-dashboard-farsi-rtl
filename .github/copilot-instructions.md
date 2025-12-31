# Vue Tailwind Admin Dashboard - AI Coding Guidelines

## Architecture Overview
This is a Vue 3 admin dashboard template using Composition API, TypeScript, and Tailwind CSS. Key architectural patterns:

- **Layout Structure**: All views wrap content in `AdminLayout.vue` which provides sidebar navigation and header
- **Component Organization**: Components are grouped by feature (ecommerce/, forms/, tables/, ui/) in `src/components/`
- **Routing**: Vue Router with lazy-loaded components and meta titles for page headers
- **State Management**: Composables (e.g., `useSidebar.ts`) handle shared UI state like sidebar expansion
- **Styling**: Tailwind CSS with dark mode support using `dark:` prefixes
- **Icons**: Custom Vue components with inline SVGs, exported from `src/icons/index.ts`

## Key Files & Directories
- `src/views/`: Page components that compose feature components within AdminLayout
- `src/components/layout/`: Core layout components (AdminLayout, AppSidebar, AppHeader)
- `src/components/ecommerce/`: Dashboard-specific components (metrics, charts, tables)
- `src/composables/`: Shared logic hooks, especially for UI state management
- `src/router/index.ts`: Route definitions with lazy loading

## Development Workflow
- **Start dev server**: `npm run dev` (Vite)
- **Build**: `npm run build` (includes type checking with `vue-tsc`)
- **Lint & Format**: `npm run lint` (ESLint with --fix), `npm run format` (Prettier)
- **Type checking**: `npm run type-check` (vue-tsc)

## Coding Patterns
- **Component Structure**: Use `<template>`, `<script setup>`, no `<style>` (Tailwind-only)
- **Dark Mode**: Always include dark variants: `dark:bg-gray-800 dark:text-white`
- **Grid Layouts**: Use Tailwind grid classes for responsive layouts (e.g., `grid-cols-12`, `xl:col-span-7`)
- **Icons**: Import from `src/icons/index.ts`, render as `<component-name />`
- **Charts**: Use `vue3-apexcharts` with ApexCharts configuration objects
- **Router Integration**: Access route meta in components via `useRoute().meta.title`

## Component Examples
- **View Pattern**: Wrap feature components in AdminLayout with grid layout
- **Metric Cards**: Rounded containers with icon, title, value, and trend indicator
- **Responsive Design**: Mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoints
- **Sidebar State**: Use `useSidebar()` composable for responsive sidebar behavior

## Dependencies & Libraries
- **Charts**: ApexCharts via vue3-apexcharts
- **Calendar**: FullCalendar with Vue 3 integration
- **Carousel**: Swiper for image carousels
- **Maps**: jsvectormap for geographic visualizations
- **Date Picker**: flatpickr with Vue wrapper
- **Drag & Drop**: vuedraggable for sortable lists

## File Naming & Organization
- Components: PascalCase (EcommerceMetrics.vue)
- Composables: camelCase with 'use' prefix (useSidebar.ts)
- Views: PascalCase matching route names
- Directories: lowercase, plural for groups (components/, views/)

## Build & Deployment
- **Preview**: `npm run preview` serves built files
- **Environment**: Uses Vite's import.meta.env for environment variables
- **Assets**: Static files in `public/`, processed assets in `src/assets/`

## Common Gotchas
- Always import CSS dependencies in `main.ts` (Swiper, jsvectormap, flatpickr styles)
- Use `@` alias for `src/` directory imports
- Vue components require `.vue` extension in imports
- TypeScript strict mode enabled - ensure proper typing for props and emits</content>
<parameter name="filePath">d:\Projects\My Projects base\vue-tailwind-admin-dashboard-main\.github\copilot-instructions.md