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

---

## Features section progress

Reusable homepage feature highlights section added and integrated into customer landing page.

Location:

```bash
components/
└── home/
    └── Features.tsx
```

Integrated into:

```bash
app/
└── (customer)/
    └── page.tsx
```

Current features:

- reusable features section component
- four service highlight cards using mapped data structure
- icon-based feature presentation using lucide-react
- responsive grid layout for mobile and desktop
- delivery, organic, speed and payment indicators
- centralized content-driven rendering approach

Current techniques used:

- array mapping for UI generation
- reusable component composition
- responsive grid layout
- utility-first styling
- icon-driven UI structure

Current approach:

- keep homepage sections modular
- avoid repeated static UI blocks
- centralize section content into structured data
- maintain scalable landing page composition

---

## Categories section progress

Reusable homepage categories section added and integrated into customer landing page.

Location:

```bash
components/
└── home/
    └── Categories.tsx
```

Integrated into:

```bash
app/
└── (customer)/
    └── page.tsx
```

Current features:

- reusable categories section component
- category cards generated using mapped data structure
- horizontal scrollable category browsing layout
- category image integration using Next.js Image
- dynamic category-based navigation routes
- hover interaction states for category items
- responsive category card sizing

Current techniques used:

- client component using `"use client"`
- array mapping for UI generation
- Next.js Image optimization
- App Router Link navigation
- browser event handling
- utility-first responsive styling

Current approach:

- keep homepage sections modular
- centralize category data into structured objects
- avoid repeated static category markup
- support scalable content-driven rendering

---

## Product showcase progress

Implemented reusable product listing foundation and homepage integration.

Current updates:

- added reusable `ProductCard` component
- integrated popular products section on homepage
- added dynamic product detail navigation using product ids
- added add-to-cart interaction placeholder
- implemented pricing, discount and rating UI
- added optimized image rendering using `next/image`
- configured remote image support in `next.config.ts`
- added environment-based currency configuration

Current techniques used:

- reusable component composition
- dynamic route navigation with `useRouter`
- event propagation control using `stopPropagation`
- conditional rendering
- environment variables with `.env.local`
- Next.js image optimization

Current approach:

- keep product display logic reusable
- centralize app configuration through environment variables
- separate UI rendering from future cart/business logic

---

## Promo banner progress

Implemented promotional CTA section for homepage engagement.

Current updates:

- added reusable `PromoBanner` component
- integrated promotional section into homepage flow
- added app download call-to-action buttons
- integrated delivery illustration using `next/image`
- implemented responsive content and image layout

Component location:

```bash
components/
└── home/
    └── PromoBanner.tsx
```

Current techniques used:

- reusable component composition
- responsive flex layouts
- optimized image rendering with `next/image`
- call-to-action driven UI structure

Current approach:

- keep promotional sections isolated and reusable
- maintain homepage section-based architecture
- improve content flow using modular homepage components

---

## Newsletter section progress

Implemented reusable newsletter subscription section for homepage engagement.

Current updates:

- added reusable `NewsLetter` component
- integrated newsletter section into homepage flow
- added email subscription form UI
- added newsletter call-to-action section
- integrated `MailIcon` using lucide-react
- added form structure with basic submit handling

Component location:

```bash
components/
└── home/
    └── NewsLetter.tsx
```

Current techniques used:

- reusable component composition
- controlled form structure
- responsive layout design
- icon-based UI enhancement
- event handling with form submission prevention

Current approach:

- keep homepage sections modular
- isolate subscription UI into reusable components
- maintain section-based homepage architecture

---

## Footer progress

Implemented reusable footer component and connected it to the shared customer layout.

Current updates:

- added reusable `Footer` component
- integrated footer into customer layout
- added quick links section
- added customer service links
- added contact information section
- added social media actions
- implemented responsive multi-column layout

Component location:

```bash
components/
└── navigation/
    └── Footer.tsx
```

Layout integration:

```bash
app/
└── (customer)/
    └── layout.tsx
```

Current techniques used:

- reusable component composition
- array mapping for dynamic sections
- responsive grid layouts
- icon integration using lucide-react and react-simple-icons
- shared layout wrapping

Current approach:

- keep shared page sections inside layouts
- centralize navigation-related components
- reduce repeated page structure logic

---

## Cart system progress

Implemented shared cart state and integrated functional cart flow across customer pages.

Current updates:

- added `CartProvider` to root layout
- integrated `CartSidebar` into customer layout
- connected `ProductCard` add-to-cart actions
- connected navbar cart count and sidebar toggle
- added quantity update controls
- added remove product functionality
- added subtotal, delivery fee and total calculations
- added checkout navigation from cart sidebar

Component locations:

```bash
components/
├── cart/
│   └── CartSidebar.tsx
│
├── product/
│   └── ProductCard.tsx
│
└── navigation/
    └── Navbar.tsx
```

Context integration:

```bash
context/
└── cart/
```

Current techniques used:

- React Context API
- custom hooks using `useCart`
- shared state management
- provider wrapping through root layout
- event propagation control
- conditional rendering
- derived cart calculations
- client-side navigation

Current approach:

- centralize cart logic through context
- avoid prop drilling across components
- keep UI and cart state separated
- share cart functionality across layouts and pages
