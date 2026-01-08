# Covalenty App V2 - Repository Guide

## Table of Contents
1. [Tech Stack Overview](#tech-stack-overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Code Patterns & Conventions](#code-patterns--conventions)
5. [Contributing Guide](#contributing-guide)
6. [Creating a New Repo with Same Stack](#creating-a-new-repo-with-same-stack)

---

## Tech Stack Overview

### Core Framework
- **Next.js 15.5.7** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type-safe development
- **Node.js** - Runtime environment (uses `.nvmrc` for version management)

### State Management
- **Redux Toolkit 2.6.0** - Global state management (slices pattern)
- **TanStack Query 5.79.2** - Server state management and caching
- **tRPC 11.6.0** - End-to-end typesafe API client

### UI & Styling
- **Tailwind CSS 4.1.5** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library (New York style)
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **next-themes** - Dark mode support
- **Class Variance Authority (CVA)** - Component variants
- **Tailwind Merge** - Class name merging utility

### Backend Integration
- **tRPC** - Type-safe API communication with custom server types (`@covalenty/server-trpc-types`)
- **Axios** - HTTP client for REST API calls
- **Firebase 11.9.1** - Authentication and real-time features

### Forms & Validation
- **React Hook Form 7.62.0** - Form state management
- **Zod 4.1.7** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Utilities
- **date-fns 4.1.0** - Date manipulation
- **dayjs 1.11.13** - Alternative date library
- **Lodash 4.17.21** - Utility functions
- **Sonner** - Toast notifications

### Development Tools
- **ESLint 9** - Code linting (Next.js config)
- **Prettier** - Code formatting
- **Cypress** - End-to-end testing

### Deployment
- **AWS Amplify** - Hosting and CI/CD (configured via `amplify.yml`)
- **Next.js SSR/SSG** - Server-side rendering capabilities

---

## Architecture

### Application Architecture Pattern
The application follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Pages, Components, Templates)     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Business Logic Layer        │
│     (Hooks, Context, Utils)         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         State Management Layer      │
│    (Redux Slices, TanStack Query)   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Data Access Layer           │
│    (tRPC Client, API Services)      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         External Services           │
│  (Backend API, Firebase, AWS)       │
└─────────────────────────────────────┘
```

### State Management Strategy

**Dual State Management Approach:**

1. **Redux Toolkit** - For client-side application state:
   - Authentication state
   - Cart state
   - User preferences
   - Client information
   - Search filters
   - Notifications

2. **TanStack Query + tRPC** - For server state:
   - Product data
   - Catalog information
   - Seller information
   - Real-time data fetching

### Routing Architecture

**Next.js App Router** with route groups:
- `(user-routes)` - Protected routes requiring authentication
  - Layout wrapper with authentication guards
  - Shared UI elements (navigation, sidebar)

---

## Project Structure

```
covalenty-app-v2/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (user-routes)/            # Protected user routes (route group)
│   │   │   ├── catalog/
│   │   │   ├── clients/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── quotation/
│   │   │   ├── search/
│   │   │   ├── seller/
│   │   │   ├── settings/
│   │   │   └── layout.tsx            # Shared layout for protected routes
│   │   ├── login/                    # Public login page
│   │   ├── sign-up/                  # Public signup pages
│   │   ├── r/[referral-code]/        # Referral routes
│   │   ├── _componentes/             # App-specific components
│   │   ├── _config/                  # Configuration files (Firebase, etc.)
│   │   ├── _constants/               # Application constants
│   │   ├── _context/                 # React Context providers
│   │   ├── _dialogs/                 # Dialog/Modal components
│   │   ├── _forms/                   # Form components
│   │   ├── _interfaces/              # TypeScript interfaces
│   │   ├── _samples/                 # Sample/mock data
│   │   ├── _templates/               # Page templates
│   │   ├── _utils/                   # Utility functions
│   │   ├── globals.css               # Global styles
│   │   └── layout.tsx                # Root layout
│   ├── components/                   # Shared components
│   │   └── ui/                       # shadcn/ui components
│   ├── context/                      # Global context providers
│   ├── data/                         # Data layer
│   │   └── trpc/                     # tRPC client setup
│   ├── hooks/                        # Custom React hooks
│   │   ├── app/                      # Application-level hooks
│   │   ├── cart/                     # Cart-related hooks
│   │   ├── client/                   # Client-related hooks
│   │   ├── product/                  # Product-related hooks
│   │   ├── referral/                 # Referral hooks
│   │   ├── seller/                   # Seller-related hooks
│   │   ├── shortage/                 # Shortage hooks
│   │   ├── user/                     # User-related hooks
│   │   └── utils/                    # Utility hooks
│   ├── lib/                          # Library code
│   │   └── utils.ts                  # Utility functions (cn helper)
│   ├── service/                      # Service layer
│   │   ├── analytics/                # Analytics services
│   │   └── api-http-client.service.ts # Axios HTTP client
│   └── store/                        # Redux store
│       ├── auth/                     # Auth slice
│       ├── cart/                     # Cart slice
│       ├── client/                   # Client slice
│       ├── search/                   # Search slice
│       ├── shortage/                 # Shortage slice
│       ├── user/                     # User slice
│       ├── forced-update/            # Forced update slice
│       ├── post-message/             # Post message slice
│       ├── pub-sub-notifications/    # Pub-sub notifications slice
│       ├── error.middleware.ts       # Error handling middleware
│       └── index.ts                  # Store configuration
├── public/                           # Static assets
├── .github/                          # GitHub workflows
├── amplify.yml                       # AWS Amplify config
├── components.json                   # shadcn/ui config
├── eslint.config.mjs                 # ESLint configuration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── postcss.config.mjs                # PostCSS config
├── .prettierrc                       # Prettier config
├── .nvmrc                            # Node version
└── .npmrc                            # NPM configuration
```

### Naming Conventions

1. **Folders with underscores** (`_componentes`, `_utils`) - Private/internal to the route
2. **Route groups** - Wrapped in parentheses `(user-routes)` - Don't affect URL structure
3. **Dynamic routes** - Wrapped in brackets `[sellerId]`
4. **Component files** - kebab-case: `product-card.tsx`
5. **Hook files** - camelCase with "use" prefix: `useGetProducts.ts`
6. **Store files** - Organized by feature with `index.ts`, `formatters.ts`, `req-interfaces.ts`

---

## Code Patterns & Conventions

### 1. Component Pattern (shadcn/ui style)

```tsx
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const componentVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'default-classes',
        secondary: 'secondary-classes',
      },
      size: {
        default: 'default-size',
        sm: 'small-size',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

export function Component({ className, variant, size, ...props }: ComponentProps) {
  return (
    <div className={cn(componentVariants({ variant, size, className }))} {...props}>
      {/* Component content */}
    </div>
  );
}
```

### 2. Custom Hook Pattern

```typescript
// hooks/feature/useFeatureName.ts
import { trpc } from '@/data/trpc/trpc-client';
import { useEffect } from 'react';

export const useFeatureName = (param: ParamType) => {
  const { data, isLoading, error, refetch } = trpc.feature.endpoint.useQuery(
    { param },
    {
      enabled: !!param,
    }
  );

  useEffect(() => {
    // Side effects
  }, [param]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
```

### 3. Redux Slice Pattern

```typescript
// store/feature/index.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { AsyncStoreState } from '..';

interface FeatureStoreState {
  feature: AsyncStoreState<FeatureType | null>;
}

const initialState: FeatureStoreState = {
  feature: { data: null, loading: false, error: '' },
};

export const fetchFeature = createAsyncThunk<ReturnType, ParamType>(
  'feature/fetch',
  async (params: ParamType) => {
    return ApiHttpClientService.get<ParamType, ReturnType>(
      '/endpoint',
      params,
      { authenticated: true }
    );
  }
);

export const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeature.fulfilled, (state, { payload }) => {
        state.feature.data = payload;
        state.feature.loading = false;
      })
      .addCase(fetchFeature.pending, (state) => {
        state.feature.loading = true;
        state.feature.error = '';
      })
      .addCase(fetchFeature.rejected, (state, action) => {
        state.feature.data = null;
        state.feature.loading = false;
        state.feature.error = action.error.message || 'Unknown error';
      });
  },
});

export default featureSlice.reducer;
```

### 4. Page Component Pattern

```tsx
'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useSearchParams } from 'next/navigation';

export default function PageName() {
  const pageParams = useSearchParams();
  const storeData = useSelector((state: RootState) => state.feature);

  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

### 5. tRPC Client Setup

```typescript
// data/trpc/trpc-client.ts
import { AppRouter } from '@covalenty/server-trpc-types';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();

// Usage in component:
const { data, isLoading, error } = trpc.feature.endpoint.useQuery(params);
```

### 6. API Service Pattern

The application uses a custom `ApiHttpClientService` with:
- Automatic token refresh on 401 errors
- Request cancellation support
- Type-safe request/response interfaces

```typescript
// Usage
const data = await ApiHttpClientService.get<ParamsType, ResponseType>(
  '/endpoint',
  params,
  { authenticated: true }
);
```

### Styling Conventions

1. **Tailwind CSS** - Primary styling method
2. **CSS Variables** - For theming (defined in `globals.css`)
3. **OKLCH Color System** - Modern color space
4. **Dark Mode** - Class-based dark mode support
5. **Custom Classes**:
   - `.clickable` - Interactive elements with hover/active states
   - Typography system with custom h1-h6 and p styles

### TypeScript Patterns

1. **Strict Mode** - Enabled in `tsconfig.json`
2. **Path Aliases** - `@/*` maps to `src/*`
3. **Interface Naming** - No prefix (e.g., `Product`, not `IProduct`)
4. **Type Exports** - Co-located with implementations

### ESLint Rules

Key enforced rules:
- `curly: 'error'` - Always use curly braces
- `object-shorthand: 'error'` - Use ES6 object shorthand
- `prefer-arrow-callback: 'error'` - Prefer arrow functions
- `no-console: 'error'` - Only allow `console.warn`, `console.error`, `console.info`
- `@typescript-eslint/no-unused-vars: 'warn'` - Warn on unused variables

---

## Contributing Guide

### Prerequisites

1. **Node.js** - Install version specified in `.nvmrc`
   ```bash
   nvm install
   nvm use
   ```

2. **NPM Access** - Configure GitHub Packages access:
   ```bash
   echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> .npmrc
   echo "@covalenty:registry=https://npm.pkg.github.com/" >> .npmrc
   ```

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd covalenty-app-v2
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Environment Variables**
   Create `.env.local` with required variables:
   ```env
   # API
   NEXT_PUBLIC_BASE_URL=
   NEXT_PUBLIC_TRPC_URL=

   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_API_ID=
   NEXT_PUBLIC_FIREBASE_MENSURAMENT_ID=

   # Analytics
   NEXT_PUBLIC_GTM_ID=
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Application will run on `http://localhost:3009`

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make changes following the patterns above**

3. **Run linting**
   ```bash
   npm run lint        # Fix issues
   npm run eslint      # Check only
   ```

4. **Type checking**
   ```bash
   npm run type-check
   ```

5. **Testing**
   ```bash
   npm run test:open   # Open Cypress UI
   npm run test        # Run tests headless
   ```

6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: description"
   git push origin feature/feature-name
   ```

### Code Review Checklist

- [ ] Follows established patterns (components, hooks, store slices)
- [ ] Uses TypeScript properly (no `any` unless necessary)
- [ ] Implements proper error handling
- [ ] Uses appropriate state management (Redux vs TanStack Query)
- [ ] Follows naming conventions
- [ ] Includes proper types/interfaces
- [ ] ESLint passes without errors
- [ ] TypeScript compilation succeeds
- [ ] Responsive design (mobile-first)
- [ ] Dark mode compatible
- [ ] Uses shadcn/ui components where applicable

### Adding New Dependencies

```bash
# Production dependency
npm install <package>

# Development dependency
npm install -D <package>

# Update tRPC types from private registry
npm run update:trpc
```

### Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

Components will be added to `src/components/ui/` and can be customized.

---

## Creating a New Repo with Same Stack

### Step-by-Step Setup

#### 1. Initialize Next.js Project

```bash
npx create-next-app@latest my-new-app
# Select options:
# ✔ TypeScript: Yes
# ✔ ESLint: Yes
# ✔ Tailwind CSS: Yes
# ✔ src/ directory: Yes
# ✔ App Router: Yes
# ✔ Import alias (@/*): Yes
```

#### 2. Install Core Dependencies

```bash
cd my-new-app

# State Management
npm install @reduxjs/toolkit react-redux
npm install @tanstack/react-query
npm install @trpc/client @trpc/react-query

# UI & Styling
npm install tailwindcss@latest postcss@latest
npm install @tailwindcss/postcss
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install next-themes
npm install tw-animate-css

# Forms & Validation
npm install react-hook-form
npm install @hookform/resolvers
npm install zod@latest

# Utilities
npm install axios
npm install lodash
npm install date-fns dayjs
npm install sonner

# Firebase
npm install firebase

# Dev Dependencies
npm install -D @types/lodash
npm install -D @types/node
npm install -D @types/react
npm install -D @types/react-dom
npm install -D typescript
```

#### 3. Configure shadcn/ui

```bash
npx shadcn@latest init
# Select options:
# ✔ Style: New York
# ✔ Base color: Neutral
# ✔ CSS variables: Yes
```

This creates `components.json`:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

#### 4. Setup Project Structure

```bash
# Create directories
mkdir -p src/app/_componentes
mkdir -p src/app/_config
mkdir -p src/app/_constants
mkdir -p src/app/_context
mkdir -p src/app/_dialogs
mkdir -p src/app/_forms
mkdir -p src/app/_interfaces
mkdir -p src/app/_templates
mkdir -p src/app/_utils
mkdir -p src/context
mkdir -p src/data/trpc
mkdir -p src/hooks/{app,utils}
mkdir -p src/lib
mkdir -p src/service
mkdir -p src/store
```

#### 5. Configure TypeScript

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 6. Configure ESLint

Create `eslint.config.mjs`:
```javascript
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'next'),
  {
    rules: {
      curly: 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': ['error', { allowUnboundThis: false }],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];

export default eslintConfig;
```

#### 7. Configure Prettier

Create `.prettierrc`:
```json
{
  "printWidth": 150,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "arrowParens": "always"
}
```

#### 8. Setup Tailwind CSS

Update `postcss.config.mjs`:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

Update `src/app/globals.css` with custom CSS variables and theme configuration (copy from reference project).

#### 9. Setup Redux Store

Create `src/store/index.ts`:
```typescript
import { configureStore } from '@reduxjs/toolkit';

export interface AsyncStoreState<T> {
  data: T;
  loading: boolean;
  error: string;
  message?: {
    type: 'error' | 'success' | 'warning';
    text: string;
  };
}

export const store = configureStore({
  reducer: {
    // Add your slices here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
```

#### 10. Setup tRPC Client

Create `src/data/trpc/trpc-client.ts`:
```typescript
import { createTRPCReact } from '@trpc/react-query';
// Import your AppRouter type from your backend

export const trpc = createTRPCReact<AppRouter>();
```

#### 11. Create App Providers

Create `src/app/_componentes/app-providers.tsx`:
```tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/data/trpc/trpc-client';
import { httpBatchLink } from '@trpc/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { store } from '@/store';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: process.env.NEXT_PUBLIC_TRPC_URL as string,
        headers: () => {
          // Add authentication headers here
          return {};
        },
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

#### 12. Update Root Layout

Update `src/app/layout.tsx`:
```tsx
import { Inter } from 'next/font/google';
import './globals.css';
import AppProviders from './_componentes/app-providers';

const inter = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
```

#### 13. Create Utility Files

Create `src/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### 14. Setup API Service

Create `src/service/api-http-client.service.ts` with axios instance and interceptors (reference the pattern from this project).

#### 15. Add NPM Scripts

Update `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "eslint": "eslint \"src/**/*.{js,jsx,ts,tsx}\"",
    "lint": "eslint --fix \"src/**/*.{js,jsx,ts,tsx}\"",
    "type-check": "tsc --project tsconfig.json --skipLibCheck true"
  }
}
```

#### 16. Setup Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_TRPC_URL=http://localhost:3000/trpc
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

#### 17. Configure Git

Create `.gitignore`:
```
# dependencies
/node_modules

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
*.log*

# env files
.env*

# typescript
*.tsbuildinfo
next-env.d.ts
```

#### 18. Initialize Git

```bash
git init
git add .
git commit -m "Initial commit with full stack setup"
```

### Optional: AWS Amplify Deployment

Create `amplify.yml`:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm install
        - nvm use
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

Create `.nvmrc`:
```
20
```

---

## Additional Resources

### Key Files to Reference

1. **Component Patterns**: `src/app/_componentes/product-card.tsx`
2. **Custom Hooks**: `src/hooks/product/useGetProducts.ts`
3. **Redux Slices**: `src/store/cart/index.ts`
4. **Page Components**: `src/app/(user-routes)/products/page.tsx`
5. **API Service**: `src/service/api-http-client.service.ts`
6. **Global Styles**: `src/app/globals.css`

### Common Commands

```bash
# Development
npm run dev                 # Start dev server (port 3009)
npm run build               # Production build
npm run start               # Start production server

# Code Quality
npm run lint                # Auto-fix ESLint issues
npm run eslint              # Check ESLint issues
npm run type-check          # Check TypeScript types

# Testing
npm run test:open           # Open Cypress UI
npm run test                # Run Cypress tests

# Dependencies
npm run update:trpc         # Update tRPC types

# shadcn/ui
npx shadcn@latest add button      # Add button component
npx shadcn@latest add dialog      # Add dialog component
```

### Best Practices

1. **Use TypeScript strictly** - Avoid `any`, use proper types
2. **Follow the folder structure** - Keep related files together
3. **Use shadcn/ui components** - Don't reinvent the wheel
4. **Leverage tRPC for type safety** - End-to-end type safety
5. **Separate concerns** - Use hooks, services, and store slices appropriately
6. **Test your code** - Write Cypress tests for critical flows
7. **Keep components small** - Single responsibility principle
8. **Use server state for server data** - TanStack Query over Redux
9. **Implement proper error handling** - Use try-catch and error boundaries
10. **Follow accessibility guidelines** - Use semantic HTML and ARIA attributes

---

## Support & Contact

For questions or issues related to this repository:
- Check existing documentation
- Review code examples in the repository
- Contact the development team

**Version**: 0.11.4
**Last Updated**: 2026-01-08
