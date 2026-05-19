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
