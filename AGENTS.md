# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Giovanna is a single-page React 19 PWA (Vite + TypeScript + Firebase). There is no backend server to run — the only local process is the Vite dev server. Firebase is the BaaS (auth, Firestore, analytics) and is cloud-hosted.

### Dev commands

See `CLAUDE.md` or `package.json` scripts:

- `npm run dev` — Vite dev server on port 5173
- `npm run build` — TypeScript type-check + Vite production build
- `npm run lint` — ESLint (flat config v9)
- `npm run preview` — serve production build locally

### Important caveats

- **Firebase credentials required for auth**: All auth paths (Google, Email, Guest/Anonymous) require valid Firebase API keys. Without real `VITE_FIREBASE_*` env vars in `.env.local`, the app renders but login fails silently. The `.env.local.example` template lists all required variables.
- **No automated test framework**: The project has no Jest/Vitest setup. `src/tests/` contains manual integration test scripts only.
- **ESLint has pre-existing errors**: `npm run lint` exits with code 1 due to ~60 pre-existing lint errors in the codebase (mostly `react-refresh/only-export-components`, `react-hooks/set-state-in-effect`, and `@typescript-eslint/no-unused-vars`). This is the baseline state.
- **Firebase emulators**: The app supports `VITE_USE_FIREBASE_EMULATORS=true` in `.env.local` to redirect auth/firestore to local emulators (ports 9099/8080), but `firebase.json` does not have an `emulators` section configured, so `firebase emulators:start --only auth` will skip the auth emulator. To use emulators, you would need to add emulator config to `firebase.json`.
- **PWA service worker**: In dev mode, the PWA service worker is not active. It only generates during `npm run build`.
