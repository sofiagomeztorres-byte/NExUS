# NExUS - Premium Operations Center

## Overview

NExUS is a premium multi-brand operations dashboard engineered for entrepreneurs, creators, and agency owners to run their business ecosystems from one unified interface.

### Core Principles

- **Single Manifesto**: Transform business goals into clear, organized daily actions
- **Mobile-First**: Optimized exclusively for smartphone viewing (430px max width)
- **Quiet Luxury**: Clear mode design system with precision color palette
- **Multi-Brand**: Complete data isolation between brands
- **Daily Focus**: "Mi Día" workspace centers on what matters today

## Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **State**: React Context + localStorage
- **Typography**: Cormorant Garamond (serif) + Inter (sans-serif)

## Project Structure

```
NExUS/
├── app/
│   ├── globals.css          # Global styles & animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home/entry point
├── components/
│   ├── Button.tsx           # Base button component
│   ├── Card.tsx             # Card component
│   └── modules/
│       ├── Onboarding.tsx   # Onboarding flow
│       ├── MainDashboard.tsx # Navigation & layout
│       ├── MiDia.tsx        # Daily dashboard
│       ├── Calendar.tsx     # Calendar & scheduling
│       ├── Library.tsx      # File management
│       └── BrandConfig.tsx  # Brand settings
├── lib/
│   ├── types.ts             # TypeScript definitions
│   ├── utils.ts             # Utility functions
│   └── context.tsx          # State management
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Design System

### Color Palette (Quiet Luxury Clear Mode)

- **#FFFFFF** - Immaculate White (base canvas)
- **#F9F8FC** - Silk Ivory (panels & cards)
- **#EADCF9** - Premium Lavender (active states)
- **#E2B659** - Liquid Gold (AI & milestones)
- **#2A1A4A** - Deep Amethyst (typography)
- **#EEE9F5** - Platinum Lines (borders)

### Components

All components use the design tokens defined in `tailwind.config.ts` via `nexus.*` color classes.

## Features

### 1. Onboarding Flow
Progressive setup with:
- Welcome screen
- Name personalization
- Brand selection (Paradise Travel, LifeWave preloaded)
- Primary goal definition
- Completion confirmation

### 2. Mi Día (Daily Workspace)
- Energy level selector (4 states)
- Main priority anchor (gold-highlighted)
- Task creation & management
- Real-time filtering based on energy

### 3. Calendar Motor
- Native date API integration
- 12-hour AM/PM time display
- Routine vs. Critical event types
- Dynamic event scheduling

### 4. Library & Groups
- Multi-tag file organization
- Support for: video, image, audio, PDF, URLs
- Priority file highlighting
- Automatic weekly rotation system

### 5. Brand Configuration
Five-section control center:
- **General**: Name, description, industry, website
- **Visual**: Color palette, typography
- **Strategic**: Business focus, products, customer, promise, differentiator
- **Personality**: Communication tone, frequent/forbidden words
- **Knowledge**: Brand knowledge base (PDF, video, audio, URL uploads)

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## State Management

The app uses React Context (`lib/context.tsx`) with localStorage persistence. All data is stored locally in the browser.

### Available Context Methods

- `updateUserState()` - Update user profile
- `addBrand() / updateBrand()` - Manage brands
- `addTask() / updateTask() / deleteTask() - Task CRUD
- `getTasks()` - Filter tasks by brand
- `addCalendarEvent() / getCalendarEvents()` - Calendar ops
- `addLibraryFile() / getLibraryFiles()` - File management
- `addGroup() / getGroups()` - Group management

## Animation Engine

The "Silk Motor" provides fluid page transitions:
- Incoming pages slide up with elastic easing (400ms)
- Outgoing pages fade with scale-down
- Cards have kinetic haptic feedback on interaction
- Gold elements include breathing animation

## Mobile Optimization

- Fixed viewport width: 430px
- Horizontal scroll hidden globally (`overflow-x: hidden`)
- All interactive elements in thumb-zone (lower 50%)
- Responsive typography with no awkward line breaks

## Future Enhancements

- Multimodal AI analytics (vision API integration)
- Real-time collaboration
- Advanced reporting dashboard
- Integration with social media APIs
- Automated content calendar recommendations

## License

Proprietary - NExUS System Architecture v2.5
