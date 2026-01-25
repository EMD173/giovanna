---
description: Replace Sparkles icons with the custom Giovanna G logo throughout the app
---

# Replace Sparkles Icons with Giovanna Logo

This workflow replaces Lucide `<Sparkles>` icons with the custom Giovanna "G" logo image.

## Prerequisites

- The G logo must exist at `/public/icons/icon-192.png`
- A reusable `GiovannaLogo` component should be created first

## Step 1: Create the GiovannaLogo Component

Create `/src/components/GiovannaLogo.tsx`:

```tsx
interface GiovannaLogoProps {
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
};

export const GiovannaLogo = ({ className = '', size = 'md' }: GiovannaLogoProps) => (
    <img 
        src="/icons/icon-192.png" 
        alt="Giovanna" 
        className={`${SIZES[size]} ${className}`}
    />
);
```

## Step 2: Find Files Using Sparkles

Run this command to find all files:

```bash
grep -r "Sparkles" src --include="*.tsx" -l
```

## Step 3: Replace Pattern

For each file:

1. Add import: `import { GiovannaLogo } from '@/components/GiovannaLogo';`
2. Remove `Sparkles` from the lucide-react import
3. Replace `<Sparkles className="w-4 h-4" />` with `<GiovannaLogo size="sm" />`

Size mapping:

- `w-3 h-3` → `size="xs"`
- `w-4 h-4` → `size="sm"`
- `w-5 h-5` → `size="md"`
- `w-8 h-8` → `size="lg"`
- `w-12 h-12` or larger → `size="xl"`

## Step 4: Verify

// turbo

```bash
npm run lint
```

Check the app visually to ensure the logos display correctly.
