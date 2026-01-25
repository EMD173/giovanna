---
description: Convert Lucide icons to Tabler icons throughout the codebase
---

# Lucide to Tabler Icon Migration

This workflow converts all Lucide React icons to Tabler icons for a more professional look.

## Prerequisites
- Tabler icons package installed: `npm install @tabler/icons-react`

## Icon Name Mapping

| Lucide Name | Tabler Name |
|-------------|-------------|
| Send | IconSend |
| Sparkles | IconSparkles |
| Moon | IconMoon |
| BookOpen | IconBook |
| Loader2 | IconLoader2 |
| Settings | IconSettings |
| Mic | IconMicrophone |
| MicOff | IconMicrophoneOff |
| Heart | IconHeart |
| Camera | IconCamera |
| Feather | IconFeather |
| StopCircle | IconPlayerStop |
| X | IconX |
| ChevronRight | IconChevronRight |
| ChevronLeft | IconChevronLeft |
| ChevronDown | IconChevronDown |
| ChevronUp | IconChevronUp |
| Plus | IconPlus |
| Minus | IconMinus |
| Check | IconCheck |
| AlertTriangle | IconAlertTriangle |
| AlertCircle | IconAlertCircle |
| Info | IconInfoCircle |
| Home | IconHome |
| User | IconUser |
| Users | IconUsers |
| Calendar | IconCalendar |
| CalendarClock | IconCalendarTime |
| Clock | IconClock |
| Bell | IconBell |
| Search | IconSearch |
| Filter | IconFilter |
| Download | IconDownload |
| Upload | IconUpload |
| Share | IconShare |
| Copy | IconCopy |
| Trash | IconTrash |
| Edit | IconEdit |
| Eye | IconEye |
| EyeOff | IconEyeOff |
| Lock | IconLock |
| Unlock | IconUnlock |
| Mail | IconMail |
| Phone | IconPhone |
| MapPin | IconMapPin |
| Globe | IconWorld |
| Link | IconLink |
| ExternalLink | IconExternalLink |
| ArrowRight | IconArrowRight |
| ArrowLeft | IconArrowLeft |
| ArrowUp | IconArrowUp |
| ArrowDown | IconArrowDown |
| RotateCw | IconRefresh |
| RefreshCw | IconRefresh |
| Loader | IconLoader |
| Star | IconStar |
| Battery | IconBattery |
| BarChart3 | IconChartBar |
| CloudSun | IconCloud |
| ToggleLeft | IconToggleLeft |
| ToggleRight | IconToggleRight |
| Play | IconPlayerPlay |
| Pause | IconPlayerPause |
| Video | IconVideo |
| Image | IconPhoto |
| File | IconFile |
| FileText | IconFileText |
| Folder | IconFolder |

## Steps for Each File

1. **Find the import statement**:
   ```tsx
   import { Icon1, Icon2, ... } from 'lucide-react';
   ```

2. **Replace with Tabler import**:
   ```tsx
   import { IconIcon1, IconIcon2, ... } from '@tabler/icons-react';
   ```

3. **Find all usages in JSX** and replace:
   - `<Icon1` → `<IconIcon1`
   - `className="w-5 h-5"` → `size={20}` (Tabler uses size prop)
   - `strokeWidth={2}` → `stroke={2}` (Tabler uses stroke prop)

## Common Patterns

### Before (Lucide):
```tsx
<Heart className="w-5 h-5 text-red-500" />
```

### After (Tabler):
```tsx
<IconHeart size={20} className="text-red-500" />
```

## Files to Update

Run this command to find all files using Lucide:
```bash
grep -r "from 'lucide-react'" src --include="*.tsx" --include="*.ts" -l
```

## Verification

After conversion, run:
```bash
npm run build
```

All TypeScript errors should be resolved.
