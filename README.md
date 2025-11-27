# Matuku: Australasian Bittern Field Logger (MVP)

[![Architecture](https://img.shields.io/badge/Architecture-PWA%20(Platform%20Agnostic)-blue.svg)](https://en.wikipedia.org/wiki/Progressive_web_app)
[![Data Integrity](https://img.shields.io/badge/Data%20Storage-Offline--First%20Reliability-red.svg)](https://developer.android.com/topic/architecture/data-layer/offline-first)
[![UX Focus](https://img.shields.io/badge/UX%20Design-Protocol%20Optimization%20%26%20Haptics-lightgrey.svg)](#key-features)

**Matuku** is a Minimum Viable Product (MVP) of a Progressive Web Application (PWA) designed to replace manual, error-prone field notes for volunteer observers monitoring the endangered Australasian Bittern (Matuku). It ensures compliance with the Department of Conservation (DOC) observation protocols through a structured, mobile-first interface. It is based on my observation of pain points participating in 

### Project Motivation

This project was inspired by firsthand experience participating in Australasian Bittern monitoring, specifically **logging boom trains** during the critical dusk observation period. Observing that pre-existing application solutions faced adoption and setup challenges - often causing volunteers to revert to (potentially unreliable) manual logging methods - I engineered this alternative. The goal is to provide conservation teams with a robust, platform-agnostic tool that guarantees **data integrity** and minimizes administrative friction.

## Value Proposition (Proof of Concept)

This project demonstrates the core technical architecture required to guarantee data capture reliability and eliminate major administrative pain points associated with conservation fieldwork.

| Pain Point | Solution Focus | Portfolio Highlight |
| :--- | :--- | :--- |
| **Data Loss** | **Offline-First Storage:** Local persistence (SQLite/IndexedDB) ensures data integrity regardless of remote connectivity. | Reliability Engineering |
| **Manual Timestamps** | **Single-Tap Logging:** UX design centralizes the **Core Call Recorder** to auto-capture accurate **HH:MM:SS** on event. | Workflow Automation |
| **Complex Admin** | **Platform Agnostic & No Login:** Reduces barrier to entry for volunteers and outputs direct **CSV Export** for coordinators. | Accessibility & Data Flow Design |
| **Nighttime UX** | **Optimized Input:** Enforces **Dark Mode** and integrates **Haptic Feedback** for high-fidelity data entry in low-light conditions. | Constraint-Driven UX |

## Key Features Demonstrated (MVP)

* **1-Hour Dusk Timer** and **Sunset Calculation** (Local/Offline).
* Structured input for all mandatory environmental variables (Noise, Wind, Cloud Cover).
* Automated GPS/Time capture and manual **dial/slider** input for accurate compass bearing.
* Session-based local data storage and **CSV Export** functionality.


***

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
