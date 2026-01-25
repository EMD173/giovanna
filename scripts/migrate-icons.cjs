#!/usr/bin/env node

/**
 * Lucide to Tabler Icon Migration Script
 * 
 * This script converts all Lucide React icons to Tabler icons.
 */

const fs = require('fs');
const path = require('path');

// Icon name mapping from Lucide to Tabler
const iconMap = {
  'Send': 'IconSend',
  'Sparkles': 'IconSparkles',
  'Moon': 'IconMoon',
  'BookOpen': 'IconBook',
  'Loader2': 'IconLoader2',
  'Loader': 'IconLoader',
  'Settings': 'IconSettings',
  'Mic': 'IconMicrophone',
  'MicOff': 'IconMicrophoneOff',
  'Heart': 'IconHeart',
  'Camera': 'IconCamera',
  'Feather': 'IconFeather',
  'StopCircle': 'IconPlayerStop',
  'X': 'IconX',
  'ChevronRight': 'IconChevronRight',
  'ChevronLeft': 'IconChevronLeft',
  'ChevronDown': 'IconChevronDown',
  'ChevronUp': 'IconChevronUp',
  'Plus': 'IconPlus',
  'Minus': 'IconMinus',
  'Check': 'IconCheck',
  'AlertTriangle': 'IconAlertTriangle',
  'AlertCircle': 'IconAlertCircle',
  'Info': 'IconInfoCircle',
  'Home': 'IconHome',
  'User': 'IconUser',
  'Users': 'IconUsers',
  'Calendar': 'IconCalendar',
  'CalendarClock': 'IconCalendarTime',
  'Clock': 'IconClock',
  'Bell': 'IconBell',
  'BellRing': 'IconBellRinging',
  'Search': 'IconSearch',
  'Filter': 'IconFilter',
  'Download': 'IconDownload',
  'Upload': 'IconUpload',
  'Share': 'IconShare',
  'Share2': 'IconShare',
  'Copy': 'IconCopy',
  'Trash': 'IconTrash',
  'Trash2': 'IconTrash',
  'Edit': 'IconEdit',
  'Edit2': 'IconEdit',
  'Edit3': 'IconEdit',
  'Pencil': 'IconPencil',
  'Eye': 'IconEye',
  'EyeOff': 'IconEyeOff',
  'Lock': 'IconLock',
  'Unlock': 'IconLockOpen',
  'Mail': 'IconMail',
  'Phone': 'IconPhone',
  'MapPin': 'IconMapPin',
  'Globe': 'IconWorld',
  'Globe2': 'IconWorld',
  'Link': 'IconLink',
  'Link2': 'IconLink',
  'ExternalLink': 'IconExternalLink',
  'ArrowRight': 'IconArrowRight',
  'ArrowLeft': 'IconArrowLeft',
  'ArrowUp': 'IconArrowUp',
  'ArrowDown': 'IconArrowDown',
  'RotateCw': 'IconRefresh',
  'RefreshCw': 'IconRefresh',
  'RefreshCcw': 'IconRefresh',
  'Star': 'IconStar',
  'Battery': 'IconBattery',
  'BatteryCharging': 'IconBatteryCharging',
  'BarChart': 'IconChartBar',
  'BarChart2': 'IconChartBar',
  'BarChart3': 'IconChartBar',
  'CloudSun': 'IconCloudSun',
  'Cloud': 'IconCloud',
  'Sun': 'IconSun',
  'ToggleLeft': 'IconToggleLeft',
  'ToggleRight': 'IconToggleRight',
  'Play': 'IconPlayerPlay',
  'Pause': 'IconPlayerPause',
  'Square': 'IconSquare',
  'Circle': 'IconCircle',
  'Video': 'IconVideo',
  'VideoOff': 'IconVideoOff',
  'Image': 'IconPhoto',
  'File': 'IconFile',
  'FileText': 'IconFileText',
  'Folder': 'IconFolder',
  'FolderOpen': 'IconFolderOpen',
  'Save': 'IconDeviceFloppy',
  'Zap': 'IconBolt',
  'Shield': 'IconShield',
  'ShieldCheck': 'IconShieldCheck',
  'Award': 'IconAward',
  'Trophy': 'IconTrophy',
  'Target': 'IconTarget',
  'Crosshair': 'IconCrosshair',
  'MessageCircle': 'IconMessageCircle',
  'MessageSquare': 'IconMessage',
  'HelpCircle': 'IconHelp',
  'Key': 'IconKey',
  'LogOut': 'IconLogout',
  'LogIn': 'IconLogin',
  'Power': 'IconPower',
  'Activity': 'IconActivity',
  'TrendingUp': 'IconTrendingUp',
  'TrendingDown': 'IconTrendingDown',
  'Layers': 'IconLayers',
  'Grid': 'IconGrid',
  'List': 'IconList',
  'Menu': 'IconMenu2',
  'MoreHorizontal': 'IconDotsHorizontal',
  'MoreVertical': 'IconDotsVertical',
  'Maximize': 'IconMaximize',
  'Minimize': 'IconMinimize',
  'Maximize2': 'IconMaximize',
  'Minimize2': 'IconMinimize',
  'XCircle': 'IconXCircle',
  'CheckCircle': 'IconCheckCircle',
  'CheckCircle2': 'IconCircleCheck',
  'AlertOctagon': 'IconAlertOctagon',
  'Smile': 'IconMoodSmile',
  'Frown': 'IconMoodSad',
  'Meh': 'IconMoodNeutral',
  'ThumbsUp': 'IconThumbUp',
  'ThumbsDown': 'IconThumbDown',
  'Bookmark': 'IconBookmark',
  'Flag': 'IconFlag',
  'Tag': 'IconTag',
  'Hash': 'IconHash',
  'AtSign': 'IconAt',
  'Paperclip': 'IconPaperclip',
  'Printer': 'IconPrinter',
  'Wifi': 'IconWifi',
  'WifiOff': 'IconWifiOff',
  'Bluetooth': 'IconBluetooth',
  'Volume': 'IconVolume',
  'Volume1': 'IconVolume',
  'Volume2': 'IconVolume',
  'VolumeX': 'IconVolumeOff',
  'Headphones': 'IconHeadphones',
  'Music': 'IconMusic',
  'Radio': 'IconRadio',
  'Compass': 'IconCompass',
  'Navigation': 'IconNavigation',
  'Route': 'IconRoute',
  'Map': 'IconMap',
  'Briefcase': 'IconBriefcase',
  'Building': 'IconBuilding',
  'Building2': 'IconBuilding',
  'Code': 'IconCode',
  'Terminal': 'IconTerminal',
  'Database': 'IconDatabase',
  'Server': 'IconServer',
  'Cpu': 'IconCpu',
  'Monitor': 'IconDeviceDesktop',
  'Smartphone': 'IconDeviceMobile',
  'Tablet': 'IconDeviceTablet',
  'Watch': 'IconDeviceWatch',
  'Gift': 'IconGift',
  'Package': 'IconPackage',
  'Box': 'IconBox',
  'ShoppingCart': 'IconShoppingCart',
  'ShoppingBag': 'IconShoppingBag',
  'CreditCard': 'IconCreditCard',
  'DollarSign': 'IconCurrencyDollar',
  'Percent': 'IconPercentage',
  'PieChart': 'IconChartPie',
  'LineChart': 'IconChartLine',
  'Sliders': 'IconAdjustments',
  'Settings2': 'IconSettings',
  'Tool': 'IconTool',
  'Wrench': 'IconTool',
  'Scissors': 'IconScissors',
  'Palette': 'IconPalette',
  'Brush': 'IconBrush',
  'PenTool': 'IconPencil',
  'Type': 'IconTypography',
  'Bold': 'IconBold',
  'Italic': 'IconItalic',
  'Underline': 'IconUnderline',
  'AlignLeft': 'IconAlignLeft',
  'AlignCenter': 'IconAlignCenter',
  'AlignRight': 'IconAlignRight',
  'AlignJustify': 'IconAlignJustified',
  'LayoutGrid': 'IconLayoutGrid',
  'LayoutList': 'IconLayoutList',
  'Columns': 'IconColumns',
  'Rows': 'IconRows',
  'Sidebar': 'IconLayoutSidebar',
  'PanelLeft': 'IconLayoutSidebarLeft',
  'PanelRight': 'IconLayoutSidebarRight',
  'Inbox': 'IconInbox',
  'Archive': 'IconArchive',
  'Repeat': 'IconRepeat',
  'Shuffle': 'IconArrowsShuffle',
  'SkipBack': 'IconPlayerSkipBack',
  'SkipForward': 'IconPlayerSkipForward',
  'Rewind': 'IconRewind',
  'FastForward': 'IconFastForward',
  'ZoomIn': 'IconZoomIn',
  'ZoomOut': 'IconZoomOut',
  'Crop': 'IconCrop',
  'Move': 'IconArrowsMove',
  'Hand': 'IconHandStop',
  'MousePointer': 'IconPointer',
  'Grab': 'IconGripVertical',
  'GripVertical': 'IconGripVertical',
  'GripHorizontal': 'IconGripHorizontal',
  // Additional mappings for Giovanna
  'UserCircle': 'IconUserCircle',
  'Brain': 'IconBrain',
  'Waves': 'IconWaveSine',
  'GraduationCap': 'IconSchool',
  'Quote': 'IconQuote',
  'ClipboardList': 'IconClipboardList',
  'School': 'IconBuildingCommunity',
  'Lightbulb': 'IconBulb',
  'RotateCcw': 'IconRefresh',
  'ThermometerSun': 'IconTemperature',
  'Wind': 'IconWind',
  'Anchor': 'IconAnchor',
  'Gamepad2': 'IconDeviceGamepad2',
  'Ear': 'IconEar',
  'FileJson': 'IconFileCode',
  'Apple': 'IconApple',
  'Pill': 'IconPill',
  'GitBranch': 'IconGitBranch',
  'ArrowUpRight': 'IconArrowUpRight',
  'Crown': 'IconCrown',
  'UserPlus': 'IconUserPlus',
  'Stethoscope': 'IconStethoscope',
  'Flower2': 'IconFlower',
  'CloudRain': 'IconCloudRain',
  'Link as LinkIcon': 'IconLink',
};

function findFiles(dir, ext) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
      results = results.concat(findFiles(filePath, ext));
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  }
  
  return results;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Check if file uses lucide-react
  if (!content.includes("from 'lucide-react'")) {
    return false;
  }
  
  console.log(`Processing: ${filePath}`);
  
  // Extract lucide imports
  const importMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/);
  if (!importMatch) return false;
  
  const lucideIcons = importMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  const tablerIcons = [];
  
  for (const lucideIcon of lucideIcons) {
    const tablerIcon = iconMap[lucideIcon];
    if (tablerIcon) {
      tablerIcons.push(tablerIcon);
      
      // Replace JSX usage: <Icon -> <IconTabler
      // Match component usage like <Icon or {Icon}
      const jsxRegex = new RegExp(`<${lucideIcon}(?=\\s|>|/)`, 'g');
      content = content.replace(jsxRegex, `<${tablerIcon}`);
      
      // Replace closing tags
      const closeRegex = new RegExp(`</${lucideIcon}>`, 'g');
      content = content.replace(closeRegex, `</${tablerIcon}>`);
    } else {
      console.warn(`  ⚠️  No mapping for: ${lucideIcon}`);
      tablerIcons.push(lucideIcon); // Keep original if no mapping
    }
  }
  
  // Replace import statement
  const newImport = `import { ${tablerIcons.join(', ')} } from '@tabler/icons-react'`;
  content = content.replace(/import\s*\{[^}]+\}\s*from\s*['"]lucide-react['"]/, newImport);
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Updated!`);
    return true;
  }
  
  return false;
}

// Main
const srcDir = process.argv[2] || './src';
console.log(`\n🔄 Converting Lucide icons to Tabler in: ${srcDir}\n`);

const files = [...findFiles(srcDir, '.tsx'), ...findFiles(srcDir, '.ts')];
let updated = 0;

for (const file of files) {
  if (processFile(file)) {
    updated++;
  }
}

console.log(`\n✨ Done! Updated ${updated} files.\n`);
