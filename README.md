# Cinematic Presentation Base

Minimal Vite + React + Tailwind presentation app with keyboard-driven step state using Zustand.

## Features

- Full-screen dark canvas (`#0b0f14`)
- Scroll disabled globally
- Centralized state store for presentation steps
- Keyboard controls:
  - `Right Arrow` / `Space` -> next step
  - `Left Arrow` -> previous step
- Clean modular structure:
  - `src/components/Layout.jsx`
  - `src/pages/MainScene.jsx`
  - `src/store/usePresentationStore.js`

## Install and Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- `maxSteps` is currently fixed to `12` in `src/store/usePresentationStore.js`.
- No animations or Three.js are included yet by design.

