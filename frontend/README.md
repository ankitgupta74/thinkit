# ThinkIt

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

## Cart context architecture progress

Implemented structured cart state management using Context API and custom hooks.

Current updates:

- added `CartContext` shared state setup
- added `CartProvider` for global cart access
- added reusable `useCart` custom hook
- added provider guard validation
- added localStorage cart persistence
- extracted cart operations into helper functions
- added cart count and total calculations
- separated cart logic into hooks, utils and types

Current structure:

```bash
context/
└── cart/
    ├── CartProvider.tsx
    ├── cartContext.ts
    ├── useCart.ts
    ├── hooks/
    │   └── useCartStorage.ts
    ├── utils/
    │   └── cartHelpers.ts
    └── types/
        └── cart.types.ts
```

Current techniques used:

- React Context API
- custom hooks
- provider pattern
- localStorage persistence
- lazy state initialization
- guard pattern validation
- helper utility extraction
- immutable state updates

Current approach:

- centralize cart business logic
- separate storage from UI logic
- avoid prop drilling
- keep reusable state logic isolated

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

---

## Product listing and filter system progress

Implemented URL-based product filtering and reusable product transformation flow.

Current updates:

- added products page with filtering, sorting and pagination
- added reusable `FilterPanel` component
- added category filtering
- added organic product filtering
- added price range filtering
- added sorting controls
- added pagination handling
- added mobile filter drawer
- added filter reset functionality
- added active filter detection
- added product result count display
- added empty state and loading state handling

Hook and utility structure:

```bash
hooks/
├── useBodyScrollLock.ts
└── useProduct.ts

utils/
└── productHelpers.ts

components/
└── product/
    └── FilterPanel.tsx
```

Current techniques used:

- URL state using `useSearchParams`
- route updates using `router.replace`
- custom hooks
- reusable helper functions
- `useMemo` for derived state
- modal body scroll locking
- local and URL state separation
- filtering → sorting → pagination pipeline
- responsive drawer pattern
- immutable data transformation

Current approach:

- keep URL as single source of truth
- centralize query update logic
- isolate business logic inside hooks
- keep page components focused on coordination and rendering
- separate UI state from transformation logic

---

## Pagination system progress

Implemented reusable pagination UI and shared pagination logic across product sections.

Current updates:

- added reusable `Pagination` component
- added generic `usePagination` custom hook
- integrated pagination into products page
- integrated pagination into flash deals page
- added URL-based page state handling
- added page update through query params
- added scroll-to-top behavior during page changes
- moved pagination logic out of page components

Structure:

```bash
components/
└── ui/
    └── Pagination.tsx

hooks/
└── usePagination.ts
```

Current techniques used:

- custom hooks
- generic TypeScript hooks
- URL state management
- reusable UI components
- query param updates
- memoization using `useMemo`
- pagination slicing pattern

Current approach:

- keep pagination logic reusable
- separate UI from calculations
- keep page state shareable through URLs
- avoid repeating pagination logic across pages

Flash Deals page integration:

```bash
app/
└── (customer)/
    └── flashDeals/
        └── page.tsx
```

Flash Deals updates:

- added dedicated flash deals page
- added reusable product listing flow
- added loading state handling
- added empty state handling
- reused shared pagination system
- reused ProductCard rendering structure
- integrated URL-based pagination state

Current approach:

- reuse existing product display patterns
- keep page logic lightweight
- reuse shared hooks and UI components
- maintain same pagination behavior across pages

---

## Product details page progress

Implemented dynamic product details flow and reusable review system.

Current updates:

- added dynamic product details page using `[id]`
- added product lookup using route params
- added breadcrumb navigation
- added browser back navigation
- added product quantity controls
- connected add-to-cart and quantity update flow
- added stock availability states
- added related products section
- reused `ProductCard` rendering flow
- added reusable `DummyReviewsSection`

Structure:

```bash
app/
└── (customer)/
    └── products/
        └── [id]/
            └── page.tsx

components/
└── ui/
    └── DummyReviewsSection.tsx
```

Current techniques used:

- dynamic routing using `useParams`
- route-based data lookup
- conditional rendering
- reusable component composition
- derived UI state
- memoization using `useMemo`
- seeded random generation
- shared cart integration
- reusable product flow

Current approach:

- keep product page state derived from route data
- reuse existing cart and product systems
- keep review generation isolated
- maintain reusable page sections

---

## Shop layout and orders progress

Implemented shared shop layout structure and orders page flow.

Current updates:

- created shared `(shop)` layout wrapper
- moved `(customer)` and `(protected)` inside `(shop)`
- removed duplicated customer layout
- centralized shared page wrappers
- added orders page UI and order listing flow
- added loading and empty states
- added tab-based order sections
- added order summary cards
- added order status display
- connected cart clearing through query params
- updated delivery partner types

Structure:

```bash
app/
└── (shop)/
    ├── layout.tsx
    │
    ├── (customer)/
    └── (protected)/
        └── orders/
```

Current techniques used:

- nested route groups
- shared layout composition
- query parameter handling
- conditional rendering
- reusable state patterns
- centralized UI wrappers
- derived order states

Current approach:

- avoid duplicate layouts
- keep shared UI at a higher route level
- reuse layout wrappers across route groups
- isolate order flow inside page-level logic

---

## Order details and tracking progress

Implemented order details flow with live order tracking and delivery progress UI.

Current updates:

- created dynamic order details page using `[id]`
- added reusable `OrderOTP` component
- added reusable `OrderTimeLine` component
- added reusable `LiveMap` component
- added delivery partner information section
- added item summary and pricing breakdown
- added delivery address section
- added dynamic order status handling
- updated order types with tracking-related models
- added mounted state handling in navbar

Structure:

```bash
app/
└── (shop)/
    └── (protected)/
        └── orders/
            └── [id]/

components/
└── order/
    ├── LiveMap.tsx
    ├── OrderOTP.tsx
    └── OrderTimeLine.tsx
```

Current techniques used:

- dynamic routes
- dynamic imports with SSR disabled
- reusable component composition
- conditional rendering
- status-driven UI flow
- client-side map rendering
- timeline progression pattern
- hydration-safe rendering

Current approach:

- keep order tracking features modular
- separate tracking, OTP and timeline concerns
- avoid SSR issues for browser-only libraries
- drive UI from order status and order history
- extend domain models as features evolve

Current tracking flow:

- order page loads by route id
- status controls OTP visibility
- status history drives timeline progress
- live location updates map position
- delivery partner data controls tracking actions

---

## Address management progress

Implemented address management flow with reusable address UI and local CRUD interactions.

Current updates:

- created reusable `AddressCard` component
- created reusable `AddressForm` modal component
- implemented addresses management page
- added add address functionality
- added edit address functionality
- added delete address functionality
- added default address handling
- added local controlled form state
- added modal-based form interaction
- added loading state handling
- added empty state UI for addresses

Structure:

```bash
app/
└── (shop)/
    └── (protected)/
        └── addresses/

components/
└── address/
    ├── AddressCard.tsx
    └── AddressForm.tsx
```

Current techniques used:

- reusable component composition
- controlled forms
- local state management
- modal interaction pattern
- conditional rendering
- callback-driven actions
- immutable state updates
- TypeScript prop typing

Current approach:

- keep address UI modular and reusable
- separate form logic from card rendering
- centralize address state inside page component
- reuse same form for create and edit flows
- keep UI interaction responsive and isolated

Current address flow:

- user opens modal from add button
- same form handles create and edit modes
- edit mode pre-fills existing address data
- local state updates immediately after actions
- empty state appears when no addresses exist

---

## Checkout flow progress

Implemented multi-step checkout flow with reusable checkout sections and order review system.

Current updates:

- created checkout page flow
- added reusable `CheckoutAddress` component
- added reusable `CheckoutPayment` component
- added reusable `CheckoutReview` component
- added address selection flow
- added payment method selection
- added order review section
- added dynamic order summary calculations
- integrated cart context into checkout
- added empty cart fallback UI
- added loading state during order placement
- added step-based checkout navigation

Structure:

```bash
app/
└── (shop)/
    └── (protected)/
        └── checkout/

components/
└── checkout/
    ├── CheckoutAddress.tsx
    ├── CheckoutPayment.tsx
    └── CheckoutReview.tsx
```

Current techniques used:

- multi-step form flow
- reusable component composition
- controlled state management
- conditional rendering
- cart context integration
- dynamic pricing calculation
- sticky sidebar layout
- local loading states
- step-driven UI rendering

Current approach:

- split checkout into isolated reusable sections
- keep checkout state centralized in page component
- separate address, payment and review concerns
- derive pricing values dynamically from cart state
- keep checkout progression simple and guided

Current checkout flow:

- user selects delivery address
- user selects payment method
- user reviews items and totals
- order summary updates dynamically
- final action triggers order placement flow

---

## Search system progress

Implemented product search functionality and expanded static application data for development and UI workflows.

Current updates:

- created search results page
- added query-based product search using URL parameters
- added real-time product filtering from static dataset
- added search results count display
- added search results grid using reusable ProductCard component
- added empty state UI for unmatched searches
- added breadcrumb navigation
- added fallback navigation to products page
- expanded static application data across products, categories, addresses, orders, cart, dashboard and delivery partner flows

Structure:

```bash
app/
└── (shop)/
    └── (customer)/
        └── search/
            └── page.tsx

public/
└── assets.ts
```

Current techniques used:

- URL search params
- query-driven UI state
- client-side filtering
- memoization using useMemo
- conditional rendering
- reusable product cards
- breadcrumb navigation
- static mock data architecture

Current approach:

- derive search state directly from URL query parameters
- keep search results shareable and refresh-safe
- filter products on the client side from a centralized dataset
- reuse existing product display components
- provide clear feedback for both successful and empty search results

Current search flow:

- user enters search term
- query is read from URL parameters
- products are filtered by name match
- matching products are displayed in a responsive grid
- empty state appears when no products match the search term

---

## Delivery order management progress

Implemented delivery partner order management workflow with status actions, OTP verification and cancellation handling.

Current updates:

- added reusable `DeliveryOrderCard` component
- added reusable `OTPModal` component
- added reusable `CancelModal` component
- added active delivery action controls
- added completed delivery summary view
- added delivery status progression workflow
- added OTP-based delivery completion flow
- added cancellation reason collection flow
- added dynamic status badge rendering
- added customer information display
- added delivery address display
- added payment method display
- added delivery amount summary display
- added delivery date display for completed orders

Structure:

```bash
components/
└── delivery/
    ├── DeliveryOrderCard.tsx
    ├── OTPModal.tsx
    └── CancelModal.tsx
```

Current techniques used:

- reusable modal components
- controlled form inputs
- conditional rendering
- status-driven UI
- parent-child state communication
- callback-based action handling
- delivery workflow state transitions
- reusable card composition

Current approach:

- keep business logic in parent pages
- keep delivery cards focused on presentation
- keep modals reusable and isolated
- drive actions from order status
- prevent duplicate submissions using loading states
- require OTP verification before marking deliveries complete
- collect cancellation reasons before cancelling deliveries

Current delivery workflow:

```text
Assigned
   ↓
Packed
   ↓
Out for Delivery
   ↓
OTP Verification
   ↓
Delivered
```

Cancellation flow:

```text
Open Cancel Modal
   ↓
Enter Reason
   ↓
Confirm Cancellation
```

Current UI behavior:

- action buttons change automatically based on order status
- OTP verification is available only for deliveries in progress
- cancellation is hidden for completed orders
- completed deliveries display delivery date instead of actions
- customer and delivery information remain visible throughout the workflow

---

## Delivery partner portal progress

Implemented delivery partner authentication flow, shared delivery layout and delivery management dashboard.

Current updates:

- created delivery login page
- added controlled login form state
- added delivery partner layout
- added shared delivery navigation header
- added delivery partner profile display
- added logout navigation flow
- created delivery dashboard page
- added active deliveries tab
- added completed deliveries tab
- added delivery order listing flow
- added live location sharing toggle
- integrated delivery status management workflow
- integrated OTP verification workflow
- integrated delivery cancellation workflow
- added loading state handling
- added empty state handling

Structure:

```bash
app/
└── delivery/
    ├── layout.tsx
    ├── page.tsx
    └── login/
        └── page.tsx
```

Current techniques used:

- route-specific layouts
- controlled form inputs
- local state management
- conditional rendering
- reusable component integration
- dashboard state coordination
- modal-driven workflows
- status-based UI behavior
- loading and empty state patterns

Current approach:

- isolate delivery features from customer flows
- provide a dedicated layout for delivery pages
- centralize delivery actions inside dashboard state
- reuse delivery workflow components
- keep delivery authentication separate from customer authentication

Current delivery dashboard flow:

```text
Login
   ↓
Delivery Dashboard
   ↓
View Assigned Orders
   ↓
Update Delivery Status
   ↓
OTP Verification
   ↓
Complete Delivery
```

Current dashboard features:

- active/completed delivery switching
- assigned order management
- location sharing toggle
- OTP verification modal
- cancellation modal
- delivery partner session UI
- order action management

---

## Admin panel progress

Implemented admin management area with dashboard, products, orders and delivery partner administration.

Current updates:

- created shared admin layout
- added sidebar navigation system
- added admin dashboard page
- added dashboard statistics cards
- added recent orders overview table
- added product management page
- added product inventory table
- added stock management workflow foundation
- added product create form
- added product edit form
- added image upload preview handling
- added category and inventory management fields
- added order management page
- added order status update workflow
- added delivery partner assignment workflow
- added delivery partners management page
- added delivery partner onboarding form
- added partner activation and deactivation workflow foundation
- added loading states across admin pages
- added empty state handling
- added modal-based management workflows

Structure:

```bash
app/
└── admin/
    ├── layout.tsx
    ├── page.tsx
    ├── products/
    │   ├── page.tsx
    │   └── new/
    │       └── page.tsx
    ├── orders/
    │   └── page.tsx
    └── deliveryPartners/
        └── page.tsx
```

Current techniques used:

- shared route layouts
- configuration-driven navigation
- dashboard card generation
- table-based administration UI
- controlled forms
- modal workflows
- image preview handling
- conditional rendering
- loading and empty state patterns
- reusable management flows
- dummy data integration

Current approach:

- centralize admin navigation in a single layout
- separate management areas by domain
- reuse form patterns for create and edit operations
- keep administration workflows isolated from customer flows
- prepare pages for future API integration

Current admin modules:

- dashboard analytics
- product management
- inventory management
- order management
- delivery partner management
- onboarding workflows

## Backend foundation and database modeling progress

Implemented backend project foundation and core database models using MongoDB and Mongoose.

Current updates:

- configured MongoDB database integration
- installed and configured Mongoose
- added environment variable setup for database connection
- established backend model architecture
- created User model
- created Product model
- created Order model
- created Address model
- created DeliveryPartner model
- added model relationships using ObjectId references
- added schema validation rules
- added default values and field constraints
- added timestamps across all collections
- added database indexes for frequently queried fields
- added embedded schemas for order items, status history, live location and shipping address snapshots
- implemented model reuse pattern using `models || model` to prevent Next.js hot reload issues
- aligned database schemas with existing frontend TypeScript types

Structure:

```bash
models/
├── Address.ts
├── DeliveryPartner.ts
├── Order.ts
├── Product.ts
└── User.ts
```

Current concepts covered:

- MongoDB document modeling
- Mongoose schemas and models
- collection relationships
- embedded documents
- referenced documents
- schema validation
- indexing
- timestamps
- data normalization
- snapshot-based order storage

Current techniques used:

- ObjectId references with `ref`
- nested sub-schemas
- reusable schema composition
- model caching pattern
- field constraints and defaults
- collection indexing
- TypeScript-compatible schema design

Current approach:

- design database models before API development
- keep collections separated by domain responsibility
- use references for related entities
- use snapshots for order accuracy and historical data
- align backend schemas with frontend types
- centralize business data structure inside Mongoose models

## Authentication, Infrastructure and Core Backend Utilities Progress

Implemented the foundational backend infrastructure required for authentication, database access, file storage, email delivery, role management and application-wide utility handling.

### Steps Taken

1. Installed backend dependencies and TypeScript type packages.
2. Configured environment-based application settings using `.env.local`.
3. Connected Next.js application with MongoDB using Mongoose.
4. Implemented reusable database connection utility.
5. Configured JWT-based authentication system.
6. Added authenticated user retrieval from cookies and tokens.
7. Implemented admin access validation utilities.
8. Configured Cloudinary for media storage and delivery.
9. Configured Nodemailer SMTP service for email sending.
10. Centralized order lifecycle statuses.
11. Added reusable API error handling helper.
12. Organized backend utilities inside the `lib` directory.

### Progress

- MongoDB integration completed.
- Mongoose connection management completed.
- JWT token generation and verification completed.
- Cookie-based authentication flow completed.
- Admin authorization helper completed.
- Cloudinary configuration completed.
- SMTP email service configuration completed.
- Reusable email sender utility completed.
- Centralized order status management completed.
- Standardized API error response handling completed.
- Environment variable configuration completed.

### Concepts Covered

- Environment Configuration
- Authentication
- Authorization
- JWT Tokens
- Cookie-Based Sessions
- Database Connectivity
- Cloud Storage Integration
- Email Infrastructure
- Role-Based Access Control
- Centralized Error Handling
- Configuration Management
- Shared Backend Utilities

### Approach

- Keep infrastructure logic separated from business logic.
- Centralize reusable backend functionality inside `lib`.
- Use environment variables for all sensitive configuration.
- Protect admin functionality through dedicated authorization checks.
- Reuse utility functions across APIs to reduce duplication.
- Maintain consistent API responses and authentication flow.

### Techniques Used

- Mongoose connection reuse pattern
- JWT signing and verification
- Next.js cookie handling
- Environment-based role management
- Cloudinary SDK configuration
- Nodemailer transporter abstraction
- Shared utility architecture
- Centralized constants management
- Standardized server error responses

### Packages and Libraries Configured

- mongoose
- mongodb
- jsonwebtoken
- cloudinary
- nodemailer
- bcryptjs
- inngest
- TypeScript type packages for backend integrations

### Backend Utility Structure

```text
lib/
├── admin.ts
├── apiError.ts
├── auth.ts
├── cloudinary.ts
├── jwt.ts
├── mongodb.ts
├── nodemailer.ts
└── orderStatus.ts
```

## Background Jobs & Workflow Automation Progress

Implemented event-driven background workflows using Inngest to automate operational tasks, inventory monitoring, delivery partner assignment and customer engagement emails.

### Steps Taken

1. Installed and configured Inngest.
2. Created a centralized Inngest client for workflow registration.
3. Connected workflows with MongoDB models and application services.
4. Implemented event-driven inventory monitoring workflow.
5. Implemented scheduled monthly marketing email workflow.
6. Implemented automated delivery rider assignment workflow.
7. Integrated workflow email notifications through Nodemailer.
8. Connected workflows with product, user, order and delivery partner collections.
9. Added workflow logging for execution tracking and debugging.

### Progress

- Inngest background job infrastructure completed.
- Shared workflow client setup completed.
- Low stock alert automation completed.
- Monthly promotional email automation completed.
- Automatic delivery rider assignment workflow completed.
- Event-based workflow execution completed.
- Cron-based workflow scheduling completed.
- Workflow integration with MongoDB completed.
- Automated email notification workflows completed.

### Concepts Covered

- Event-Driven Architecture
- Background Jobs
- Workflow Automation
- Scheduled Tasks
- Cron Jobs
- Inventory Monitoring
- Email Campaign Automation
- Order Fulfillment Automation
- Delivery Assignment Logic
- Workflow Orchestration
- Async Processing
- Operational Automation

### Approach

- Separate long-running business operations from user requests.
- Trigger workflows through events or schedules.
- Reuse existing database, email and model utilities.
- Encapsulate each business process inside an independent workflow.
- Maintain execution visibility through workflow logs.

### Techniques Used

- Inngest event triggers
- Inngest cron scheduling
- Workflow step execution (`step.run`)
- Delayed execution (`step.sleep`)
- Batch processing for email campaigns
- Database-driven workflow decisions
- Automated OTP generation
- Dynamic email generation
- Event-based inventory tracking
- Rider availability filtering and assignment

## Workflows Implemented

### Low Stock Alert

- Triggered on inventory updates.
- Checks product stock levels.
- Sends automated email alerts to admins when stock falls below threshold.

#### Monthly Offers Campaign

- Runs automatically on a monthly schedule.
- Fetches available promotional products.
- Retrieves customer list.
- Sends marketing emails in batches.

#### Auto Assign Rider

- Triggered after order placement.
- Validates order state.
- Finds available delivery partners.
- Auto-generates delivery OTP.
- Updates order status and assignment history.

### Backend Structure Added

```text
inngest/
├── client.ts
└── functions/
    ├── autoAssignRider.ts
    ├── lowStockAlert.ts
    └── sendMonthlyOffers.ts
```

### Packages & Integrations Used

- inngest
- mongoose
- nodemailer
- mongodb
- Next.js App Router backend utilities

## Authentication API Progress

Implemented complete authentication backend using Next.js Route Handlers, MongoDB, Mongoose, JWT, secure cookies and password hashing.

### Steps Taken

1. Created authentication API routes using Next.js App Router.
2. Connected APIs with MongoDB through Mongoose.
3. Added user registration endpoint.
4. Added user login endpoint.
5. Implemented request body validation.
6. Added email format validation.
7. Added password strength validation.
8. Implemented duplicate account prevention.
9. Added password hashing using bcrypt.
10. Implemented JWT token generation.
11. Added secure cookie-based authentication.
12. Integrated admin role detection.
13. Added centralized server error handling.
14. Sanitized user data before API responses.

### Progress

- Authentication API structure completed.
- User registration API completed.
- User login API completed.
- Password encryption completed.
- JWT authentication completed.
- Secure cookie session handling completed.
- Admin access detection completed.
- Validation and error handling completed.
- Database integration completed.

### API Workflow

#### Register API

```text
Client Request
→ Validate Input Fields
→ Validate Email Format
→ Validate Password Rules
→ Connect Database
→ Check Existing User
→ Hash Password
→ Create User
→ Generate JWT Token
→ Set Secure Cookie
→ Return User Data
```

#### Login API

```text
Client Request
→ Validate Input Fields
→ Validate Email Format
→ Connect Database
→ Find User
→ Verify Password
→ Generate JWT Token
→ Set Secure Cookie
→ Return User Data
```

### Concepts Covered

- Authentication
- Authorization
- JWT Tokens
- Secure Cookies
- Password Hashing
- User Registration
- User Login
- Input Validation
- Role-Based Access
- API Security
- Session Management
- Error Handling

### Approach

- Keep authentication logic inside dedicated API routes.
- Store passwords only as hashes.
- Use JWT for identity verification.
- Persist authentication using HTTP-only cookies.
- Prevent duplicate accounts through email uniqueness checks.
- Return sanitized user objects to the frontend.
- Centralize unexpected error handling.

### Techniques Used

- Next.js Route Handlers
- Mongoose Database Queries
- bcrypt Password Hashing
- bcrypt Password Verification
- JWT Token Generation
- HTTP-only Cookies
- Secure Cookie Configuration
- Email Normalization
- Request Validation
- Centralized API Error Handling

### Files Added / Integrated

```text
app/api/auth/
├── login/route.ts
└── register/route.ts
```

### Packages & Backend Utilities Used

- next/server
- mongoose
- mongodb
- bcryptjs
- jsonwebtoken
- cookies API
- JWT helper utilities
- MongoDB connection helper
- Admin access helper
- Centralized API error helper

## Products API Progress

Implemented complete product management APIs using Next.js Route Handlers, MongoDB and Mongoose, covering product listing, filtering, searching, sorting, flash deals, product details, product creation, updates and deletion with admin protection.

### Steps Taken

1. Created products collection and connected it with MongoDB.
2. Built product listing API.
3. Added category filtering.
4. Added organic product filtering.
5. Added product search using text matching.
6. Added min/max price filtering.
7. Added product sorting options.
8. Added dynamic discount calculation.
9. Built flash deals API.
10. Built single product details API.
11. Added product creation API.
12. Added product update API.
13. Added product deletion API.
14. Added ObjectId validation.
15. Added admin authorization checks.
16. Added product data validation.
17. Integrated centralized error handling.

### Progress

- Products listing API completed.
- Product filtering system completed.
- Product search system completed.
- Product sorting system completed.
- Flash deals API completed.
- Single product details API completed.
- Product creation API completed.
- Product update API completed.
- Product deletion API completed.
- Admin product management completed.
- Dynamic discount calculation completed.
- Database integration completed.

### API Workflows

#### Products Listing API (GET /api/products)

```text
Client Request
→ Read Query Parameters
→ Build MongoDB Filters
→ Apply Search Filters
→ Apply Price Filters
→ Apply Sorting Rules
→ Fetch Products
→ Calculate Discounts
→ Return Product List
```

#### Flash Deals API (GET /api/products/flashDeals)

```text
Client Request
→ Connect Database
→ Fetch In-Stock Products
→ Calculate Discounts
→ Filter Discounted Products
→ Return Flash Deals
```

#### Product Details API (GET /api/products/[id])

```text
Client Request
→ Validate Product ID
→ Connect Database
→ Fetch Product
→ Calculate Discount
→ Return Product Details
```

#### Create Product API (POST /api/products)

```text
Admin Request
→ Verify Admin Access
→ Validate Product Data
→ Connect Database
→ Create Product
→ Save Product
→ Return Created Product
```

#### Update Product API (PUT /api/products/[id])

```text
Admin Request
→ Verify Admin Access
→ Validate Product ID
→ Validate Product Data
→ Connect Database
→ Verify Product Exists
→ Update Product
→ Return Updated Product
```

#### Delete Product API (DELETE /api/products/[id])

```text
Admin Request
→ Verify Admin Access
→ Validate Product ID
→ Connect Database
→ Verify Product Exists
→ Delete Product
→ Return Success Response
```

### Concepts Covered

- REST APIs
- Route Handlers
- CRUD Operations
- Admin Authorization
- Query Parameters
- Search Functionality
- Product Filtering
- Product Sorting
- Dynamic Calculations
- Input Validation
- Database Queries
- Error Handling

### Approach

- Keep product operations separated by endpoint -esponsibility.
- Use query parameters for filtering and sorting.
- Protect write operations with admin verification.
- Validate incoming data before database operations.
- Calculate discounts dynamically instead of storing derived values.
- Use centralized error handling for consistent responses.

### Techniques Used

- Next.js Route Handlers
- MongoDB Queries
- Mongoose Models
- Dynamic Route Parameters
- Query Parameter Filtering
- Regex Search
- Range Filtering
- Multi-field Sorting
- ObjectId Validation
- Admin Route Protection
- CRUD Patterns
- Centralized Error Handling

### Files Added / Integrated

```text
app/api/products/
├── route.ts
├── flashDeals/
│   └── route.ts
└── [id]/
    └── route.ts
```

### Backend Patterns Implemented

- Product Listing
- Product Search
- Category Filtering
- Organic Filtering
- Price Range Filtering
- Product Sorting
- Flash Deals Logic
- Product CRUD Operations
- Admin Protected APIs
- Dynamic Discount Calculation
- MongoDB Query Building

## Orders API Progress

Implemented complete order management APIs covering order creation, customer order history, order details, order cancellation, admin order management, order status updates, and live order tracking using Next.js Route Handlers, MongoDB and Mongoose.

### Steps Taken

1. Created order management API structure.
2. Added customer order history endpoint.
3. Added order placement endpoint.
4. Added stock validation before checkout.
5. Added order snapshot creation.
6. Added automatic order total calculations.
7. Added inventory reduction after purchase.
8. Added single order details endpoint.
9. Added customer order cancellation endpoint.
10. Added admin order listing endpoint.
11. Added admin order deletion endpoint.
12. Added admin order status update endpoint.
13. Added status history tracking.
14. Added live order tracking endpoint.
15. Added user ownership verification.
16. Added admin authorization checks.
17. Added model population for related data.

### Progress

- Customer order history API completed.
- Order placement API completed.
- Product stock verification completed.
- Order pricing calculation completed.
- Inventory deduction completed.
- Order details API completed.
- Order cancellation API completed.
- Admin order management API completed.
- Order status management API completed.
- Status timeline tracking completed.
- Live delivery tracking API completed.
- User and admin authorization completed.

### API Workflows

#### Order History API (GET /api/orders)

```text
Customer Request
→ Verify Login
→ Fetch User Orders
→ Populate Delivery Partner
→ Sort Latest First
→ Return Orders
```

#### Place Order API (POST /api/orders)

```text
Customer Request
→ Verify Login
→ Validate Order Items
→ Fetch Products
→ Verify Stock Availability
→ Create Order Snapshot
→ Calculate Pricing
→ Create Order
→ Add Initial Status History
→ Update Product Stock
→ Populate Order Data
→ Return Order
```

#### Order Details API (GET /api/orders/[id])

```text
Customer Request
→ Verify Login
→ Verify Order Ownership
→ Fetch Order
→ Populate User & Rider Data
→ Return Order Details
```

#### Cancel Order API (PATCH /api/orders/[id])

```text
Customer Request
→ Verify Login
→ Verify Order Ownership
→ Validate Order Status
→ Append Status History
→ Update Order Status
→ Return Updated Order
```

#### Admin Orders API (GET /api/orders/all)

```text
Admin Request
→ Verify Admin Access
→ Fetch All Orders
→ Populate User Details
→ Populate Rider Details
→ Sort Latest First
→ Return Orders
```

#### Order Status API (PUT /api/orders/[id]/status)

```text
Admin Request
→ Verify Admin Access
→ Validate Status
→ Fetch Order
→ Append Status History
→ Update Status
→ Return Updated Order
```

#### Delete Order API (DELETE /api/orders/[id])

```text
Admin Request
→ Verify Admin Access
→ Find Order
→ Delete Order
→ Return Success Response
```

#### Live Tracking API (GET /api/orders/[id]/location)

```text
Customer Request
→ Verify Login
→ Verify Order Ownership
→ Fetch Tracking Data
→ Return Location & Status
```

### Concepts Covered

- Order Management
- Checkout Processing
- Inventory Management
- Order Lifecycle
- Order Status Tracking
- Status History
- Order Ownership Validation
- Admin Authorization
- Live Order Tracking
- Data Population
- Stock Validation
- Order Snapshot Pattern

### Approach

- Store product snapshots inside orders to preserve historical accuracy.
- Verify stock directly from the database before order creation.
- Protect customer routes through ownership validation.
- Protect management routes through admin authorization.
- Maintain complete order timelines using status history.
- Keep pricing calculations server-side.
- Populate related documents only when required.

### Techniques Used

- Next.js Route Handlers
- MongoDB Queries
- Mongoose Populate
- Authentication Guards
- Authorization Guards
- Inventory Validation
- Dynamic Price Calculation
- Snapshot Data Storage
- Status History Tracking
- MongoDB Atomic Updates
- Protected API Routes
- Order Tracking Pattern

### Files Added / Integrated

```text
app/api/orders/
├── route.ts
├── all/
│   └── route.ts
└── [id]/
    ├── route.ts
    ├── status/
    │   └── route.ts
    └── location/
        └── route.ts
```

### Backend Patterns Implemented

- Customer Order Management
- Checkout Processing
- Inventory Deduction
- Order Timeline Tracking
- Status Workflow Management
- Admin Order Operations
- Ownership-Based Access Control
- Live Delivery Tracking
- Snapshot-Based Order Storage
- Protected Resource Access

## Background Jobs & Upload API Progress

Implemented Inngest workflow integration and secure image upload functionality using Next.js Route Handlers, Cloudinary and background event processing.

### Steps Taken

1. Configured Inngest client.
2. Created centralized Inngest API endpoint.
3. Registered all background workflows.
4. Connected auto rider assignment workflow.
5. Connected low stock monitoring workflow.
6. Connected monthly promotional email workflow.
7. Created secure image upload API.
8. Added admin-only upload access.
9. Added image validation rules.
10. Added file size validation.
11. Added Cloudinary image storage integration.
12. Added upload response handling.

### Progress

- Inngest event processing configured.
- Background workflow registration completed.
- Scheduled and event-driven jobs connected.
- Product image upload API completed.
- Cloudinary integration completed.
- Upload validation completed.
- Admin-protected upload endpoint completed.

### API Workflows

#### Inngest API

```text
Event / Cron Trigger
→ Inngest Endpoint
→ Match Workflow
→ Execute Function
→ Return Result
```

#### Upload API

```text
Admin Request
→ Verify Admin Access
→ Validate Uploaded File
→ Validate File Type
→ Validate File Size
→ Convert File To Buffer
→ Upload To Cloudinary
→ Return Image URL
```

### Concepts Covered

- Background Jobs
- Event-Driven Architecture
- Scheduled Workflows
- Workflow Registration
- Secure File Uploads
- Cloud Image Storage
- Role-Based Authorization
- Server-Side Validation

### Approach

- Centralized all workflows through a single Inngest endpoint.
- Registered background jobs in one location.
- Restricted uploads to admin users.
- Validated files before cloud upload.
- Stored images externally using Cloudinary.

### Techniques Used

- Next.js Route Handlers
- Inngest Integration
- Cron Jobs
- Event-Based Processing
- Cloudinary Upload API
- FormData Processing
- Buffer Conversion
- File Validation
- Role-Based Access Control
- Secure Media Storage

### Files Added / Integrated

```text
app/api/inngest/route.ts
app/api/upload/route.ts
```

### Backend Patterns Implemented

- Background Job Processing
- Event Registration Hub
- Scheduled Task Execution
- Secure Upload Pipeline
- Admin Protected APIs
- External Media Storage
- Request Validation Layer

## Database Seeding System Progress

Implemented reusable database seeding infrastructure for populating MongoDB with development and testing data.

### Steps Taken

1. Installed seeding dependencies and runtime support.
2. Added dedicated scripts directory for database population.
3. Configured environment loading for standalone script execution.
4. Created shared bootstrap setup for script initialization.
5. Added npm commands for running seed operations.
6. Created user seeding workflow.
7. Created product seeding workflow.
8. Created delivery partner seeding workflow.
9. Created address seeding workflow.
10. Added reusable product dataset for bulk insertion.
11. Added password hashing before storing seeded accounts.
12. Added database cleanup before inserting fresh records.
13. Added relationship mapping between users and addresses.
14. Added randomized delivery partner data generation.

### Progress

- Database seeding infrastructure completed.
- Environment-aware script execution configured.
- User seed data completed.
- Product catalog seed data completed.
- Delivery partner seed data completed.
- Address seed data completed.
- MongoDB bulk insertion workflow completed.
- Development dataset generation completed.

### Seed Workflow

#### User Seed

```text
Run Script
→ Load Environment Variables
→ Connect Database
→ Remove Existing Users
→ Hash Passwords
→ Create Users
→ Insert Records
```

#### Product Seed

```text
Run Script
→ Load Environment Variables
→ Connect Database
→ Remove Existing Products
→ Load Product Dataset
→ Bulk Insert Products
```

#### Delivery Partner Seed

```text
Run Script
→ Load Environment Variables
→ Connect Database
→ Remove Existing Riders
→ Hash Password
→ Generate Rider Data
→ Bulk Insert Riders
```

#### Address Seed

```text
Run Script
→ Load Environment Variables
→ Connect Database
→ Remove Existing Addresses
→ Fetch Users
→ Map Addresses To Users
→ Bulk Insert Addresses
```

### Concepts Covered

- Database Seeding
- Development Data Generation
- Bulk Data Insertion
- Environment Configuration
- Data Relationships
- Password Hashing
- Script Automation
- Dataset Management

### Approach

- Centralized script initialization using a shared bootstrap file.
- Isolated seed logic into dedicated scripts.
- Reset collections before inserting fresh records.
- Generated relational data using existing database records.
- Used reusable datasets for product population.

### Techniques Used

- MongoDB Seed Scripts
- Mongoose Models
- Bulk Insert Operations
- Collection Cleanup
- bcrypt Password Hashing
- Environment Variable Loading
- TSX Script Execution
- Dynamic Data Generation
- Relationship Mapping
- Script-Based Database Management

### Packages & Tooling Added

- dotenv
- tsx

### NPM Scripts Added

```text
seed:users
seed:products
seed:riders
seed:addresses
```

### Files Added

```text
scripts/bootstrap.ts
scripts/seedUsers.ts
scripts/seedProducts.ts
scripts/seedDeliveryPartners.ts
scripts/seedAddresses.ts
scripts/data/products.ts
```

Product dataset prepared for bulk product population and catalog initialization.

## Authentication Session APIs Progress

### Steps Taken

1. Created logout API endpoint.
2. Implemented secure token cookie removal.
3. Added current authenticated user API endpoint.
4. Integrated token-based user identification.
5. Added unauthorized access handling.
6. Sanitized user data before API responses.
7. Reused centralized authentication and error utilities.
8. Standardized authentication-related API responses.

### Progress

- Logout API completed.
- Current user profile API completed.
- Session termination workflow completed.
- Token-based user retrieval completed.
- Protected profile access completed.
- Safe user response handling completed.
- Authentication state verification completed.

### API Workflows

#### Logout API (POST /api/auth/logout)

```text
Logout Request
→ Read Authentication Cookie
→ Delete Token Cookie
→ End User Session
→ Return Success Response
```

#### Current User API (GET /api/auth/me)

```text
Read Token Cookie
→ Verify Authentication
→ Find User
→ Remove Sensitive Fields
→ Return Safe User Data
```

### Concepts Covered

- Authentication
- Session Management
- Cookie-Based Authentication
- Protected APIs
- User Profile Retrieval
- Authorization Validation
- Secure API Responses
- Authentication State Persistence

### Approach

- Manage authentication through secure cookies.
- Centralize user retrieval using shared authentication utilities.
- Protect authenticated routes through token validation.
- Never expose sensitive user information.
- Keep authentication responses consistent across APIs.

### Techniques Used

- Next.js Route Handlers
- HTTP-only Cookies
- JWT Authentication
- Authentication Guards
- User Data Sanitization
- Centralized Error Handling
- Shared Authentication Utilities
- Protected Route Patterns

### Files Added / Integrated

```text
app/api/auth/
├── logout/route.ts
└── me/route.ts
```

### Backend Patterns Implemented

- Session Logout
- Current User Retrieval
- Authentication Verification
- Protected API Access
- Safe User Response Pattern
- Cookie-Based Session Management

## Homepage Product Integration & Navigation Progress

### Steps Taken

- Connected homepage product section with backend products API.
- Replaced static homepage product data with database-driven product loading.
- Implemented client-side product fetching using API requests.
- Added loading state handling during product retrieval.
- Limited homepage showcase to featured product subset.
- Integrated reusable ProductCard rendering with backend data.
- Connected homepage sections into a unified customer landing page.
- Enhanced navigation search workflow using URL query parameters.
- Integrated authentication-aware navbar behavior.
- Connected cart state with navigation badge updates.
- Added role-based navigation rendering for admin users.
- Implemented hydration-safe rendering for client-only state.

### Progress

- Backend-powered homepage products completed.
- Popular products API integration completed.
- Homepage section composition completed.
- Search navigation integration completed.
- Cart badge integration completed.
- Authentication-aware navbar completed.
- Admin navigation visibility completed.
- Shared navigation workflow completed.
- Responsive customer navigation completed.

### API Workflow

#### Homepage Products Flow

```text
Customer Visits Homepage
→ PopularProducts Mounts
→ Request /api/products
→ Fetch Product Data
→ Store Products In State
→ Limit Display Items
→ Render Product Cards
```

#### Search Workflow

```text
Customer Enters Search
→ Submit Search Form
→ Validate Query
→ Generate URL Parameter
→ Navigate To Search Page
→ Display Matching Results
```

#### Navigation Workflow

```text
Page Load
→ Load Auth State
→ Load Cart State
→ Determine User Role
→ Render Navigation Actions
→ Enable Search / Cart / Account Access
```

### Concepts Covered

- Frontend API Integration
- Client-Side Data Fetching
- Shared Layout Architecture
- State-Driven UI
- Authentication-Aware Rendering
- Role-Based Navigation
- Search Navigation
- Cart State Synchronization
- Component Composition
- Responsive Navigation

### Approach

- Consume product data directly from backend APIs.
- Keep homepage sections modular and reusable.
- Centralize navigation inside a shared layout.
- Render user actions based on authentication state.
- Keep search state URL-driven.
- Separate data loading from presentation components.

### Techniques Used

- Fetch API
- React useEffect
- React useState
- Conditional Rendering
- Next.js App Router Navigation
- URL Query Parameters
- Shared Layout Composition
- Context API Integration
- Hydration-Safe Rendering
- Reusable Component Architecture

### Files Updated

```text
app/(shop)/(customer)/page.tsx

components/home/
└── PopularProducts.tsx

components/navigation/
└── Navbar.tsx
```

### Backend Integration Pattern

Frontend Component
→ API Request
→ Backend Route Handler
→ MongoDB Query
→ JSON Response
→ Component State Update
→ UI Rendering

## Order Management & Delivery Workflow APIs Progress

Implemented complete order lifecycle management, delivery assignment, order tracking, status management, and background workflow integration.

### Steps Taken

- add customer order management APIs
- add admin order management APIs
- add order details and cancellation APIs
- add order status update APIs
- add rider assignment APIs
- add live order tracking APIs
- integrate order status history system
- integrate delivery OTP generation workflow
- integrate inventory reduction workflow
- integrate Inngest event triggering for automation
- add order ownership validation
- add admin authorization protection
- add delivery partner validation

### Progress

- customer order creation completed
- customer order history completed
- order details retrieval completed
- customer order cancellation completed
- admin order listing completed
- admin order deletion completed
- admin status management completed
- manual rider assignment completed
- live order tracking completed
- order timeline tracking completed
- inventory synchronization completed
- background workflow integration completed

### API Workflows

#### Customer Order Creation

```text
Customer Checkout
→ Verify Login
→ Validate Products
→ Verify Stock
→ Create Order
→ Reduce Inventory
→ Trigger Stock Events
→ Trigger Rider Assignment Event
→ Return Order
```

#### Customer Order History

```text
Customer Request
→ Verify Login
→ Fetch User Orders
→ Populate Rider Details
→ Return Orders
```

#### Order Details

```text
Customer Request
→ Verify Login
→ Verify Order Ownership
→ Fetch Order
→ Populate Related Data
→ Return Order Details
```

#### Order Cancellation

```text
Customer Request
→ Verify Login
→ Verify Order Ownership
→ Validate Order State
→ Add Status History
→ Update Status
→ Return Updated Order
```

#### Admin Orders

```text
Admin Request
→ Verify Admin Access
→ Fetch Orders
→ Populate User & Rider Data
→ Return Results
```

#### Order Status Update

```text
Admin Request
→ Verify Admin Access
→ Validate Status
→ Verify Delivery Requirements
→ Update Timeline
→ Update Order Status
→ Return Updated Order
```

#### Rider Assignment

```text
Admin Request
→ Select Rider
→ Verify Order & Rider
→ Generate Delivery OTP
→ Assign Rider
→ Update Order Status
→ Return Updated Order
```

#### Order Tracking

```text
Customer Request
→ Verify Login
→ Verify Order Ownership
→ Fetch Tracking Data
→ Return Location & Status
```

### Concepts Covered

- Order Lifecycle Management
- Role-Based Access Control
- Order Ownership Validation
- Delivery Assignment System
- Delivery OTP Verification
- Order Timeline Tracking
- Inventory Management
- Event-Driven Architecture
- Background Workflow Integration
- Real-Time Delivery Tracking

### Approach

- separate customer and admin responsibilities
- validate ownership before exposing order data
- maintain complete order status history
- use delivery partner assignment workflow
- trigger business automations through events
- keep order snapshots independent from product changes
- enforce authorization at API level

### Techniques Used

- Next.js Route Handlers
- MongoDB & Mongoose Relations
- Populate Queries
- JWT Authentication
- Admin Authorization Guards
- Event-Driven Workflows
- Inngest Event Triggers
- Order Status Timeline Tracking
- Inventory Synchronization
- OTP Generation
- Defensive Validation
- Structured API Responses

### APIs Implemented

```text
/api/orders
/api/orders/all
/api/orders/[id]
/api/orders/[id]/status
/api/orders/[id]/assign
/api/orders/[id]/location
```

## Implement Authentication Context & Global Session Management

- create centralized authentication context architecture
- add AuthContext for shared authentication state
- implement AuthProvider for session lifecycle management
- create reusable useAuth hook for consuming auth state
- integrate AuthProvider into RootLayout
- connect frontend authentication state with backend auth APIs
- configure global user session loading on application startup
- add logout workflow with automatic session refresh
- provide authentication state access across the entire application

### Progress

- global authentication state management completed
- user session persistence completed
- current user loading workflow completed
- logout workflow completed
- authentication context integration completed
- application-wide auth availability completed
- protected UI state synchronization completed

### Authentication Flow

```text
Application Start
→ AuthProvider Mounts
→ Call /api/auth/me
→ Verify Token Cookie
→ Load Current User
→ Store User In Context
→ Components Access State Using useAuth()
```

### Logout Flow

```text
User Logout
→ Call /api/auth/logout
→ Remove Token Cookie
→ Refresh Auth State
→ Clear User Context
→ Update Application UI
```

### Concept

- Context API based authentication management
- Global session persistence
- Centralized user state management
- Provider-consumer architecture
- Client-side authentication synchronization

### Approach

- keep authentication state in a single source of truth
- load authenticated user once during application startup
- expose reusable auth actions through context
- synchronize frontend state with backend session APIs
- make authentication available to all components through RootLayout

### Techniques Used

- React Context API
- Custom Hooks Pattern
- Provider Pattern
- Global State Management
- Session Persistence
- Cookie-based Authentication
- Next.js App Router Integration
- Authentication Lifecycle Management
- Client-side Session Refresh
- Shared Application Providers

## Implement Address Management, Admin Dashboard & Delivery Partner APIs

- create customer address management APIs
- implement address CRUD operations with ownership validation
- add authenticated address retrieval and creation workflows
- build admin dashboard statistics endpoint
- integrate business metrics aggregation for orders, users, products and riders
- implement delivery partner management APIs
- add delivery partner authentication system using dedicated cookies
- create rider login, logout and profile APIs
- implement rider order management and assigned delivery workflows
- add delivery partner authorization helper for protected rider routes

### Progress

- customer address backend completed
- address update and deletion workflow completed
- admin dashboard analytics API completed
- delivery partner management system completed
- delivery partner authentication completed
- rider session management completed
- rider assigned orders API completed
- admin controlled rider creation and update completed
- role-based API protection completed

### Address API Flow

```text
Customer Request
→ Verify Login
→ Verify Address Ownership
→ Read / Create / Update / Delete Address
→ Return Address Data
```

### Admin Dashboard Flow

```text
Admin Request
→ Verify Admin Access
→ Collect System Metrics
→ Fetch Recent Orders
→ Return Dashboard Data
```

### Delivery Partner Authentication Flow

```text
Rider Login
→ Verify Email & Password
→ Generate JWT
→ Save delivery-token Cookie
→ Rider Authenticated
```

### Delivery Partner Order Flow

```text
Rider Request
→ Verify Rider Session
→ Fetch Assigned Orders
→ Populate Customer Details
→ Return Delivery Queue
```

### Concept

- customer-specific resource ownership
- role-based access control
- multi-authentication architecture
- rider authentication isolation
- dashboard analytics aggregation
- protected business operations

### Approach

- secure every endpoint using authentication middleware
- separate customer, admin and rider access layers
- validate ownership before modifying resources
- use JWT cookie-based sessions for riders
- centralize delivery partner authentication logic
- aggregate dashboard data directly from database collections

### Techniques Used

- Next.js Route Handlers
- JWT Authentication
- HTTP-only Cookie Sessions
- Role-Based Authorization
- Resource Ownership Validation
- Mongoose CRUD Operations
- MongoDB Aggregation Metrics
- Protected API Architecture
- Multi-Role Authentication System
- Document Population
- Centralized Auth Helpers

## Integrate Authentication UI With Backend APIs

- connect customer login and registration pages with authentication APIs
- integrate delivery partner login page with rider authentication API
- connect frontend authentication flow with JWT cookie sessions
- integrate AuthContext with backend user session endpoints
- implement automatic user state synchronization after login and logout
- add authenticated route redirection logic
- connect application layout with global authentication provider
- integrate protected user session management across the application

### Progress

- customer authentication frontend connected with backend APIs
- delivery partner authentication frontend connected with backend APIs
- AuthContext setup completed
- global authentication state management completed
- session persistence completed
- automatic user loading completed
- login, register and logout lifecycle completed
- protected page redirection completed
- root layout authentication integration completed

### Customer Authentication Flow

```text
Login / Register Form
→ Call Auth API
→ Validate Credentials
→ Generate JWT Cookie
→ Refresh AuthContext
→ Update Global User State
→ Redirect User
```

### Delivery Partner Authentication Flow

```text
Delivery Login Form
→ Call Rider Login API
→ Verify Credentials
→ Generate delivery-token Cookie
→ Create Rider Session
→ Redirect To Delivery Dashboard
```

### AuthContext Flow

```text
App Startup
→ AuthProvider Mounts
→ Call /api/auth/me
→ Load Current User
→ Store User In Context
→ Share User Across Application
```

### Concept

- frontend-backend authentication integration
- centralized authentication state management
- cookie-based session handling
- global user state sharing
- role-specific authentication flows
- authenticated navigation control

### Approach

- use API routes as the single authentication source
- store authentication state inside React Context
- reload user information from backend after auth actions
- use HTTP-only cookies for session persistence
- wrap application with shared authentication provider
- synchronize frontend state with backend session state

### Techniques Used

- Next.js Route Handlers
- React Context API
- Custom Hooks Pattern
- JWT Cookie Authentication
- Client-Side API Integration
- Protected Route Redirection
- Global State Management
- Session Persistence
- useEffect Authentication Hydration
- Context Provider Architecture
- Form Submission Workflows
- Role-Based Authentication

## integrate customer storefront with backend product APIs

- connect homepage popular products section with products API
- replace static product data with database-driven product fetching
- integrate product listing page with backend filtering, sorting and pagination
- connect flash deals page with live product catalog data
- integrate search page with backend product inventory
- connect product details page with dynamic product API route
- implement related products loading using category-based matching
- synchronize product catalog with cart functionality and URL-driven state

### Progress

- homepage now loads products from database APIs
- products page fully connected with backend product endpoints
- flash deals page uses live product inventory data
- search page fetches and filters products from API responses
- product details page loads dynamic product information by id
- related products section connected with live catalog data
- cart interactions now work with database-backed products
- URL-driven filtering, sorting and pagination integrated with backend data

### Product Catalog Flow

- Customer Visits Store
- Fetch Products API
- Apply Filters & Sorting
- Paginate Results
- Render Product Grid

### Product Details Flow

- Read Product ID From URL
- Fetch Product By ID
- Load Related Products
- Sync Cart State
- Render Product Information

### Search Flow

- Read Search Query From URL
- Fetch Product Catalog
- Filter Matching Products
- Display Search Results

### Flash Deals Flow

- Fetch Product Catalog
- Identify Discounted Products
- Filter In-Stock Deals
- Paginate Results
- Render Flash Deals

### Concept

- frontend-backend integration
- API-driven product catalog
- dynamic product rendering
- URL-based application state
- reusable data fetching patterns
- database-backed storefront

### Approach

- use API routes as the single source of product data
- fetch live catalog data instead of static assets
- keep filter and pagination state inside URL parameters
- separate UI rendering from data retrieval logic
- reuse shared product APIs across customer pages

### Techniques Used

- Next.js Route Handlers
- Client-side Data Fetching
- Dynamic Route Integration
- URL Search Params
- Custom Hooks
- Pagination Architecture
- Category-based Product Matching
- Loading & Error State Handling
- API-driven UI Rendering
- Cart State Synchronization
- Query Parameter State Management

## implement dynamic product catalog and checkout data integration

- configure external image domains for GitHub and Cloudinary in Next.js
- create reusable product data hook for filtering, sorting and pagination
- connect product catalog pages with backend product APIs
- implement URL-driven product filtering and pagination workflow
- integrate dynamic product search using live catalog data
- connect flash deals page with discounted inventory data
- implement dynamic product details and related products loading
- integrate checkout address selection using authenticated user addresses
- connect order review step with live cart, address and pricing data

### Progress

- product catalog fully connected with backend product APIs
- product filtering, sorting and pagination centralized in custom hook
- search and flash deals pages use live product inventory
- product details page loads dynamic product and related catalog data
- checkout address step uses authenticated customer addresses
- order review step displays live cart and delivery information
- external image hosting support configured for production assets

### Product Catalog Flow

- Customer Opens Catalog
- Fetch Products API
- Apply Filters
- Apply Sorting
- Apply Pagination
- Render Products

### Product Details Flow

- Read Product ID
- Fetch Product Data
- Fetch Related Products
- Sync Cart State
- Render Product Page

### Checkout Flow

- Load User Addresses
- Select Delivery Address
- Review Cart Items
- Confirm Order Details
- Submit Order

### Concept

- API-driven storefront
- reusable data transformation hooks
- URL-based state management
- dynamic product rendering
- authenticated checkout workflow
- centralized product data processing

### Approach

- use backend APIs as the source of product data
- centralize filtering and pagination logic inside custom hooks
- keep product filters synchronized with URL parameters
- reuse shared product endpoints across customer pages
- separate data processing from UI rendering
- use authenticated user data during checkout

### Techniques Used

- Custom React Hooks
- API Integration
- URL Search Parameters
- Client-side Filtering
- Client-side Sorting
- Pagination Logic
- Dynamic Routing
- Related Product Matching
- Authenticated User Data Access
- Checkout State Management
- External Image Configuration

## implement authenticated customer workflows with live backend integration

- create protected route layout using AuthContext-based access control
- connect address management page with address CRUD APIs
- implement address loading, creation, editing and deletion workflows
- integrate checkout flow with authenticated customer addresses
- connect checkout process with order creation API
- implement dynamic order history using customer-specific order data
- integrate detailed order tracking with live order and location APIs
- connect delivery partner information and order timeline data
- synchronize cart, checkout and order lifecycle with backend database

### Progress

- protected customer routes secured through centralized authentication checks
- address management fully connected with backend APIs
- checkout flow integrated with live address and order data
- order placement connected to backend order creation workflow
- order history displays authenticated customer orders
- order details page loads real order, tracking and delivery information
- live location tracking integrated through dedicated tracking endpoints

### Customer Flow

- Login
- Access Protected Routes
- Manage Addresses
- Select Delivery Address
- Place Order
- View Orders
- Track Delivery

### Address Flow

- Load Addresses
- Create / Edit / Delete Address
- Refresh Data
- Sync UI With Database

### Checkout Flow

- Load Addresses
- Select Address
- Select Payment Method
- Review Order
- Create Order
- Redirect To Orders

### Order Tracking Flow

- Load Order
- Load Live Location
- Show Timeline
- Show Delivery Partner
- Track Delivery Progress

### Concept

- authenticated customer experience
- protected route architecture
- API-driven order lifecycle
- centralized address management
- real-time delivery tracking
- customer-specific data access

### Approach

- use AuthContext as the frontend authentication source
- protect sensitive pages through shared layout guards
- fetch customer-specific data from secured APIs
- separate address, checkout and order responsibilities
- synchronize frontend state with backend records
- use dedicated endpoints for tracking and order details

### Techniques Used

- Protected Layout Pattern
- React Context Authentication
- Route Guarding
- CRUD API Integration
- Dynamic Route Parameters
- Order Lifecycle Management
- Live Tracking Requests
- State Synchronization
- Conditional Rendering
- Customer Ownership Validation

## implement admin management workflows with live backend integration

### Steps Taken

- create protected admin layout with role-based access control
- connect admin dashboard with aggregated business statistics API
- integrate product management with product listing APIs
- implement product creation and editing workflow
- integrate image upload workflow before product persistence
- connect order management with admin order APIs
- implement order status update workflow
- integrate delivery partner assignment workflow
- connect delivery partner management with onboarding APIs
- implement delivery partner activation and deactivation controls

### Progress

- admin routes protected using authentication and admin authorization checks
- dashboard displays live order, product, user and partner metrics
- products loaded from database inside admin panel
- product creation and editing connected to backend APIs
- image uploads integrated into product management workflow
- orders loaded and managed through admin dashboard
- delivery partners assignable to customer orders
- order status updates synchronized with backend records
- delivery partner onboarding and activation fully integrated

### Admin Flow

- Authenticate Admin
- Load Dashboard Data
- Manage Products
- Manage Orders
- Assign Delivery Partners
- Update Order Status
- Manage Delivery Partner Availability

### Concept

- role-based access control
- centralized admin operations
- API-driven management workflows
- product lifecycle management
- order fulfillment management
- delivery partner administration

### Approach

- use protected admin layouts for authorization
- fetch management data from dedicated admin APIs
- separate dashboard, products, orders and partner responsibilities
- synchronize UI state with backend responses
- reuse create and edit forms through shared workflows
- keep administrative actions database-driven

### Techniques Used

- Role-Based Route Protection
- React Context Authentication
- Admin Dashboard Aggregation
- CRUD API Integration
- File Upload Integration
- Order Status Management
- Delivery Partner Assignment
- State Synchronization
- Modal-Based Workflows
- Conditional Rendering

## implement admin and delivery management dashboards with protected access and live backend integration

### Steps Taken

- create protected admin layout with role-based access validation
- implement admin dashboard with aggregated business statistics
- connect dashboard cards and recent orders with backend APIs
- build product management interface with create, edit and stock controls
- implement delivery partner management with onboarding workflow
- add delivery partner activation and deactivation controls
- connect order management with status update workflow
- implement rider assignment workflow for customer orders
- create protected delivery partner layout with session validation
- connect delivery dashboard with assigned order APIs
- implement active and completed delivery views
- add delivery tracking, OTP verification and cancellation workflows

### Progress

- admin routes secured using authentication and admin role checks
- dashboard displays live orders, products, users and partner statistics
- products managed through integrated CRUD workflows
- orders managed through status updates and rider assignment
- delivery partners onboarded and managed from admin panel
- delivery portal protected using rider authentication
- assigned delivery orders loaded dynamically from backend
- delivery operations organized through tracking and delivery workflows

### Concept

- role-based access control
- dashboard-driven administration
- centralized order management
- delivery partner lifecycle management
- order fulfillment workflow
- protected operational portals

### Approach

- restrict admin pages using authentication context
- fetch dashboard and management data from APIs
- separate product, order and partner responsibilities
- synchronize frontend state with backend responses
- protect delivery pages through rider session validation
- organize delivery operations around assigned orders

### Techniques Used

- Role-Based Route Protection
- Authentication Context
- Dashboard Aggregation APIs
- CRUD Operations
- Order Status Management
- Delivery Partner Assignment
- State Synchronization
- Modal-Based Actions
- Conditional Rendering
- Protected Layouts
- Delivery Session Validation
- Order Fulfillment Workflow

implement admin delivery partner management and order assignment system

### Steps Taken

- create admin delivery partner management page
- connect delivery partner listing with backend APIs
- implement delivery partner update workflow
- add delivery partner status management controls
- create admin dashboard metrics for delivery operations
- implement order-to-rider assignment workflow
- connect order assignment APIs with delivery partner records
- update order management flow to support rider allocation
- extend delivery partner types and shared application data models
- centralize order status handling and delivery-related constants

### Progress

- admin panel can manage delivery partners from a dedicated dashboard
- delivery partner records are fetched, updated and maintained through APIs
- order assignment workflow integrated with delivery operations
- admin dashboard includes delivery-related statistics and monitoring
- order management supports rider allocation and tracking
- frontend and backend delivery management flows are synchronized

### Concept

- delivery partner lifecycle management
- admin-controlled rider operations
- order assignment workflow
- centralized delivery management
- role-based operational control
- order fulfillment coordination

### Approach

- manage delivery partners through protected admin routes
- connect frontend dashboards directly with backend APIs
- maintain delivery data through shared types and models
- keep rider assignment logic linked with order workflows
- centralize status management for consistent order handling
- synchronize delivery operations across admin and delivery modules

### Techniques Used

- Role-Based Access Control
- REST API Integration
- Delivery Partner Management
- Order Assignment Workflow
- Dashboard Data Aggregation
- Shared Type Definitions
- Status Management System
- CRUD Operations
- Client-Side Data Fetching
- State Synchronization
