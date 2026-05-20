# ThinkIt Frontend

Frontend application for ThinkIt grocery delivery platform.

## Current Setup Progress

Project structure initialization completed.

### Folder updates

- organized frontend type definitions
- separated interfaces into domain files
- added barrel exports through `types/index.ts`
- added Next.js App Router folder structure
- added route groups for auth, customer and protected pages
- added placeholder pages for routing setup
- added customer shared layout structure
- added global toaster configuration
- implemented responsive authentication page UI
- added split-screen login layout with hero section
- added login/register mode switching
- added reusable controlled auth form state handling
- integrated loading states and submission flow
- added icon-based form inputs using lucide-react

---

## Types structure

```bash
types/
├── address.ts
├── cart.ts
├── category.ts
├── common.ts
├── delivery.ts
├── index.ts
├── order.ts
├── product.ts
└── user.ts
```

## Current implemented models

- User
- Address
- Product
- Category
- Cart Item
- Order
- Delivery Partner
- Shared response types

---

## Frontend routes in progress

```bash
app/
├── (auth)/
│   ├── login/
│   └── register/
│
├── (customer)/
│   ├── page.tsx
│   ├── products/
│   │   └── [id]/
│   ├── flashDeals/
│   └── search/
│
├── (protected)/
│   ├── checkout/
│   ├── address/
│   └── orders/
│       └── [id]/
```

---

## Routing concepts being implemented

### Route Groups

Used to organize pages without affecting URLs.

Examples:

```bash
(auth)
(customer)
(protected)
```

These folders do not appear in the browser URL.

---

### Dynamic Routes

Used for parameter-based pages.

Examples:

```bash
products/[id]
orders/[id]
```

Examples:

```bash
/products/123
/orders/567
```

---

### Layout System

Shared UI can be placed in layout files.

Examples:

- navbar
- footer
- cart sidebar
- banners

Layouts wrap child pages automatically.

---

## Authentication UI progress

Implemented authentication flow foundation using App Router.

Current auth features:

- split-screen responsive authentication layout
- left-side grocery hero section
- login and signup mode switching
- controlled form inputs using React state
- loading state handling
- icon-supported input fields
- reusable form structure for backend integration

Route:

```bash
/login
```

---

## Customer layout progress

Shared customer layout structure introduced using App Router layouts.

Current shared layout content:

- top announcement banner

Layout structure:

```bash
app/
└── (customer)/
    └── layout.tsx
```

Layout wraps all customer pages automatically.

Current approach:

- place reusable shared UI in route layouts
- avoid repeating navbar/footer across pages
- keep page files focused on page-specific content

---

## Banner component progress

Reusable banner component added for customer pages.

Location:

```bash
components/
└── home/
    └── Banner.tsx
```

Current features:

- client component using `"use client"`
- local visibility state using `useState`
- dismiss action support
- session-based persistence using `sessionStorage`
- icon integration using `lucide-react`

Current behavior:

- banner displays on first visit
- dismiss action hides banner
- dismissed state persists during session
- banner appears again after session reset

Current techniques used:

- client-side rendering
- conditional rendering
- browser storage
- reusable component composition
- shared layout integration

---

## Navigation progress

Reusable navigation system added and connected to customer layout.

Location:

```bash
components/
└── navigation/
    └── Navbar.tsx
```

Integrated into:

```bash
app/
└── (customer)/
    └── layout.tsx
```

Current navigation features:

- reusable navbar component
- integrated logo and primary navigation links
- search functionality with query navigation
- cart icon with count display
- authenticated user state support
- guest user state support
- dropdown profile menu
- admin navigation entry
- responsive desktop and mobile behavior

Current techniques used:

- App Router navigation using `useRouter`
- controlled input using `useState`
- conditional rendering
- reusable component composition
- event handling for forms
- responsive UI structure
- dynamic route query generation

Current navigation approach:

- keep navigation shared through layout wrapping
- separate business logic from page files
- centralize user actions in reusable components
- support role-based navigation rendering

Example search route:

```bash
/search?q=milk
```

Current menu states:

- authenticated user menu
- guest menu
- admin-specific actions

---

## Home page progress

Customer landing page foundation added using a reusable Hero component.

Location:

```bash
components/
└── home/
    └── Hero.tsx

Integrated into:

```bash
app/
└── (customer)/
    └── page.tsx
```

Current hero features:

- reusable hero section component
- full-width background image using Next.js Image
- gradient overlay for text readability
- responsive typography and layout structure
- primary and secondary call-to-action buttons
- icon integration using lucide-react
- optimized image rendering
- centralized landing content structure

Current techniques used:

- reusable component composition
- Next.js Image optimization
- responsive utility-first styling
- layered positioning with overlays
- App Router page composition
- Link-based navigation handling

Current approach:

- keep page files lightweight
- move reusable UI into isolated components
- separate presentation from route structure
- create scalable homepage section architecture
