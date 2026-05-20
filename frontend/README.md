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
