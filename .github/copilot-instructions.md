# CloneVoice AI Coding Instructions

## Project Overview
CloneVoice is a React + TypeScript + Vite AI voice cloning platform with Supabase backend integration, TailwindCSS styling, and unique gamepad navigation support.

## Architecture & Key Patterns

### Component Organization
- **Sections**: Landing page components in `src/components/sections/` (Hero, Features, Pricing, etc.)
- **UI Components**: Reusable components in `src/components/ui/` with consistent variant system
- **Auth**: Authentication pages in `src/components/auth/` (SignIn, SignUp)
- **Pages**: Route components in `src/components/pages/` that compose sections
- All directories export via `index.ts` barrel files

### Styling System
- **Glass Morphism**: Primary design language using `backdrop-blur-sm`, `bg-white/5`, `border-white/20`
- **Gradient Backgrounds**: `bg-gradient-to-br from-gray-950 via-black to-gray-900`
- **Grain Texture**: Applied via SVG data URLs for texture overlay
- **Button Variants**: 5 variants (primary, secondary, outline, ghost, glass) with scale animations
- **Modern Effects**: Hover scales (`hover:scale-105`), backdrop blur, shadow layers

### State Management
- **React Hook Pattern**: Custom hooks like `useGamepad` for complex state logic
- **Ref-based Performance**: Use `useRef` for real-time updates (gamepad cursor position)
- **Optimized Updates**: Only trigger re-renders when values actually change

### Gamepad Integration
- **Unique Feature**: Full gamepad navigation via `GamepadCursor` component
- **Controls**: Right stick = cursor, left stick = scroll, DPAD = quick navigation, A = click
- **Real-time Updates**: Cursor position stored in ref for 60fps smooth movement
- **Event Simulation**: Dispatches mouse events for hover/click compatibility

### Form Validation
- **Frontend Security**: Blocks temporary email providers (extensive list in auth components)
- **Real-time Feedback**: Password strength indicators with visual progress
- **Modern Error Display**: Contextual errors with icons and smooth animations

## Development Workflow

### Commands
```bash
npm run dev        # Vite dev server
npm run build      # TypeScript compilation + Vite build
npm run lint       # ESLint with TypeScript rules
```

### Database Integration
- **Supabase Types**: Defined in `src/lib/supabase.ts` (Profile, VoiceProfile, TTSJob, S2SJob)
- **Environment**: Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Ready for Integration**: Auth components prepared but not yet connected

### Routing
- **React Router v7**: BrowserRouter with Routes in `App.tsx`
- **Paths**: `/` (HomePage), `/signin`, `/signup`
- **Navigation**: Link components in Navbar and auth forms

## Code Conventions

### TypeScript Patterns
- **Interface Naming**: PascalCase (e.g., `GamepadState`, `ButtonProps`)
- **Component Props**: Always define interface for props
- **Export Strategy**: Named exports from barrel files

### Component Structure
```tsx
// 1. Imports (React, external libs, local components)
// 2. SVG Icon components (inline)
// 3. Interface definitions
// 4. Main component with hooks
// 5. Event handlers
// 6. Render with JSX
```

### Animation Philosophy
- **Smooth Transitions**: 300ms duration-300 ease-in-out
- **Scale Effects**: hover:scale-105 active:scale-95 for interactive elements
- **Glass Effects**: backdrop-blur + transparency for modern feel

## Integration Points
- **Supabase**: Authentication and database ready, types defined
- **TanStack Query**: Installed for API state management
- **Lucide React**: Icon library preference
- **Tailwind v4**: Latest version with Vite plugin

When working on this codebase:
1. Follow the glass morphism design language
2. Use the established UI component variants
3. Maintain the barrel export pattern
4. Consider gamepad navigation compatibility
5. Implement proper TypeScript interfaces
6. Use the existing animation patterns