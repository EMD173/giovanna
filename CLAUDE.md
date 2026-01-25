# CLAUDE.md - AI Assistant Guide for Giovanna

## Project Overview

**Giovanna: Sovereign Healing Cosmology** is a parent-led therapeutic intelligence platform (PWA) for families raising neurodivergent children. Built with React 19 + TypeScript + Vite + Firebase, it transforms parent observations into dignity-centered documentation while bridging home expertise to institutional systems.

**Core Philosophy**: Zero-Knowledge Architecture - family data never leaves device unless explicitly shared.

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Frontend | React | ^19.2.0 |
| Language | TypeScript | ~5.9.3 |
| Build Tool | Vite | ^7.2.4 |
| Styling | Tailwind CSS | ^4.1.18 |
| Animation | Framer Motion | ^12.29.0 |
| State | Zustand | ^5.0.10 |
| Backend | Firebase | ^12.8.0 |
| Icons | Lucide React | ^0.563.0 |
| PWA | Vite PWA Plugin | ^1.2.0 |
| Deployment | Vercel | - |

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Type-check (tsc -b) then bundle (vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

## Codebase Structure

```
src/
├── core/                    # System foundation layer
│   ├── auth/               # Firebase authentication setup
│   ├── firebase/           # Zero-knowledge data layer (CRUD operations)
│   │   ├── config.ts       # Firebase initialization
│   │   ├── firestore.ts    # Observations CRUD
│   │   ├── profiles.ts     # User profile operations
│   │   ├── careTeams.ts    # Team management
│   │   ├── notifications.ts # Notification sending
│   │   └── oracleChats.ts  # Conversation persistence
│   ├── stores/             # Zustand state management
│   │   ├── useAuthStore.ts # Auth state & actions
│   │   ├── useSanctuaryPulse.ts # Dashboard atmosphere
│   │   ├── types.ts        # Domain types (ResonanceChannel, etc.)
│   │   └── profileTypes.ts # Profile & vault types
│   ├── utils/              # Utility functions
│   ├── privacy/            # Privacy policies
│   └── constants/          # App constants
│
├── features/               # Feature modules (14 domains)
│   ├── sanctuary/          # Dashboard - home hub with atmosphere
│   ├── capture/            # Observation logging (voice/text/vision)
│   ├── oracle/             # AI narrative refraction & chatbot
│   ├── village/            # Community & professional features
│   ├── journey/            # Timeline visualization
│   ├── profile/            # User profile & institutional vault
│   ├── wellness/           # Compassion Mirror & Intentionality
│   ├── practice/           # Playbooks & mantras
│   ├── admin/              # Usage dashboard & analytics
│   └── auth/               # Onboarding (Recognition Rite)
│
├── design/                 # Liquid Glass Design System
│   ├── tokens/            # CSS variables (colors, spacing, glass effects)
│   ├── atoms/             # Low-level components (ExpertPulse, RegulationGlow)
│   ├── molecules/         # Composite components (Layout, SafetyThreshold)
│   └── icons/             # Custom icon library
│
├── lib/                   # Shared utilities
│   ├── ai/
│   │   ├── agents/        # Oracle & Documenter AI agents
│   │   │   ├── oracle.ts  # Dignity refraction, personalized greetings
│   │   │   └── documenter.ts # Sacred + professional documentation
│   │   └── consciousnessGuardrails.ts  # CRITICAL: PII anonymization
│   ├── analytics.ts       # Firebase Analytics wrapper
│   ├── notifications.ts   # Notification utilities
│   └── observability.ts   # Error tracking
│
├── components/            # Shared UI components
│   ├── ErrorBoundary.tsx  # App-wide error handling
│   ├── NotificationBell.tsx # Real-time alerts
│   └── LoadingSkeleton.tsx
│
├── pages/                 # Static pages (Privacy, Terms)
├── assets/               # Images, icons, media
└── tests/                # Manual integration tests
```

## Key Patterns & Conventions

### State Management (Zustand)

```typescript
// Pattern: Self-contained store with actions
import { create } from 'zustand';

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: true,

    signInWithGoogle: async () => { /* Firebase auth */ },
    signOut: async () => { /* Firebase signout */ },
}));

// Usage in components
const { user, loading, signInWithGoogle } = useAuthStore();
```

### Firebase Operations (Typed CRUD)

```typescript
// All Firestore operations are typed
import { saveObservation } from '../../core/firebase/firestore';

const obsId = await saveObservation(user.uid, {
    strengthNarrative: "...",
    channels: ["Connection Bid", "Sensory Need"],
    atmosphericResonance: "...",
    relationalReciprocity: 3,
    biologicalNeeds: "...",
});
```

### AI Integration with PII Protection

```typescript
// CRITICAL: All external AI calls MUST use consciousnessGuardrails
import { anonymizeForExternalAPI } from '@/lib/ai/consciousnessGuardrails';

// Before sending to external AI:
const cleanedText = anonymizeForExternalAPI(userInput);
// PII replaced with: [CHILD], [PARENT], [EMAIL], [SCHOOL], etc.
```

### Component Architecture

- **Features/** - Domain-specific business logic (Capture, Oracle, Village)
- **Components/** - Shared, reusable UI across features
- **Design/atoms/** - Low-level primitives (ExpertPulse, RegulationGlow)
- **Design/molecules/** - Composite components (Layout, SafetyThreshold)

### Navigation (SPA View Switching)

```typescript
// App.tsx manages view state
const [currentView, setCurrentView] = useState('Sanctuary');

// Views: Sanctuary, Capture, Oracle, Village, Journey, Passport, Vault, Practice, Wellness, Admin
```

### Design System (Liquid Glass)

```css
/* Key CSS variables in design/tokens/ */
--glass-base: 253, 248, 243;     /* Warm Cream */
--accent-regal: #4B0082;          /* Regal Purple */
--glass-blur: 40px;               /* Frosted glass effect */

/* Use the .glass-panel class for frosted glass UI */
```

## Domain Types

```typescript
// Key types in core/stores/types.ts

type ResonanceChannel =
  | 'Seeking Safety'
  | 'Sensory Need'
  | 'Connection Bid'
  | 'Transition Signal'
  | 'Body Wisdom'
  | 'Joy Expression';

type ReciprocityLevel = 1 | 2 | 3 | 4 | 5;

interface Observation {
    id: string;
    userId: string;
    timestamp: Timestamp;
    strengthNarrative: string;
    channels: ResonanceChannel[];
    atmosphericResonance: string;
    relationalReciprocity: ReciprocityLevel;
    biologicalNeeds: string;
}
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Dashboard.tsx`, `Capture.tsx` |
| Zustand Stores | `useXXXStore` | `useAuthStore`, `useSanctuaryPulse` |
| Analytics Events | UPPER_SNAKE_CASE | `VIEW_ORACLE`, `CREATE_OBSERVATION` |
| Types/Interfaces | PascalCase | `UserProfile`, `ResonanceChannel` |
| Functions | camelCase | `saveObservation`, `getProfile` |
| CSS Classes | kebab-case | `.glass-panel`, `.gold-leaf-border` |

## Import Organization

```typescript
// 1. React & external libraries
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 2. Firebase operations
import { getProfile } from '../../core/firebase/profiles';

// 3. Zustand stores
import { useAuthStore } from '../../core/stores/useAuthStore';

// 4. Internal components
import { Dashboard } from './features/sanctuary/Dashboard';

// 5. Types (always use `import type`)
import type { UserProfile } from '../../core/stores/profileTypes';
```

## Security Rules

### Firestore Security (firestore.rules)

- **Owner-only access**: `request.auth.uid == resource.data.ownerId`
- **Village sharing**: Time-bound permissions that auto-expire
- **No cross-family data leakage**

### PII Protection (consciousnessGuardrails.ts)

Detects and anonymizes:
- Names, emails, phone numbers
- SSNs, medical IDs, DOBs
- School names, addresses

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build config, code splitting (5 chunks), PWA setup |
| `tsconfig.app.json` | TypeScript strict mode, ES2022 target |
| `eslint.config.js` | Flat config v9, React hooks rules |
| `firebase.json` | Firestore rules, hosting config |
| `vercel.json` | Security headers, SPA rewrites |
| `firestore.rules` | Database security rules |
| `.env.local.example` | Required environment variables |

## Environment Variables

```bash
VITE_FIREBASE_API_KEY           # Firebase Web API Key
VITE_FIREBASE_AUTH_DOMAIN       # Firebase auth domain
VITE_FIREBASE_PROJECT_ID        # Firebase project ID
VITE_FIREBASE_STORAGE_BUCKET    # Cloud Storage bucket
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_ORACLE_API_KEY             # Optional: External AI API
VITE_ENABLE_VILLAGE             # Feature flag: Village sharing
VITE_ENABLE_MISSION_ROOM        # Feature flag: B2B dashboard
VITE_ENABLE_VOCAL_LEDGER        # Feature flag: Voice capture
```

## Testing

Currently uses manual integration tests in `src/tests/`:
- `dignityRefractionTest.ts` - Validates Oracle's dignity translation

No Jest/Vitest framework yet. Tests are exploratory/documentation-focused.

## Important Do's and Don'ts

### DO

- Use Zustand stores for state management (no Context API)
- Wrap all external AI calls with `consciousnessGuardrails`
- Follow the Liquid Glass design system tokens
- Use typed Firestore operations from `core/firebase/`
- Maintain Zero-Knowledge architecture - no PII to external services
- Use `import type` for type-only imports
- Check `useAuthStore` for user authentication state

### DON'T

- Send raw user input to external AI APIs (use guardrails)
- Store sensitive data outside Firestore (use the vault)
- Create new Context providers (use Zustand)
- Pathologize child behaviors in any text (use strength-based language)
- Hardcode Firebase credentials (use environment variables)
- Skip TypeScript strict mode checks

## Key Files for Common Tasks

| Task | Primary Files |
|------|---------------|
| Add new feature | Create in `src/features/[name]/`, add to App.tsx view switch |
| Modify auth | `src/core/stores/useAuthStore.ts`, `src/core/auth/` |
| Add Firestore operation | `src/core/firebase/[domain].ts` |
| Update design tokens | `src/design/tokens/index.css` |
| Modify AI behavior | `src/lib/ai/agents/oracle.ts` or `documenter.ts` |
| Add analytics event | `src/lib/analytics.ts` (Events object) |
| Update security rules | `firestore.rules` |

## Build Output

Production build creates `/dist` directory with:
- 5 code-split chunks (firebase, animations, react, icons, app)
- PWA manifest and service worker
- Optimized assets with long-term caching

## Deployment

```bash
# Development
npm run dev

# Production build
npm run build

# Deploy to Vercel
vercel deploy --prod
```

## Philosophy Notes

This codebase uses unique terminology grounded in Epigenetic Consciousness theory:

- **Sanctuary**: Dashboard/home view
- **Oracle**: AI assistant for narrative refraction
- **Vocal Ledger**: Voice input feature
- **Dignity Refraction**: Transforming deficit language to strength-based
- **Atmospheric Resonance**: Environmental factors affecting behavior
- **Relational Reciprocity**: Parent-child bidirectional healing exchange
- **Cognitive Depth**: 1-5 scale adjusting app vocabulary complexity
