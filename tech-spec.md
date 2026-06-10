# BudgetWise — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | DOM renderer |
| react-router-dom | ^7.1.0 | Client-side routing (landing, auth, dashboard routes) |
| vite | ^6.0.0 | Build tool |
| @vitejs/plugin-react | ^4.3.0 | Vite React integration |
| typescript | ^5.7.0 | Type safety |
| tailwindcss | ^4.0.0 | Utility-first CSS |
| @tailwindcss/vite | ^4.0.0 | Tailwind Vite plugin |
| framer-motion | ^12.0.0 | Page transitions, hero entrance, staggered children, AnimatePresence for modals |
| recharts | ^2.15.0 | Dashboard charts — LineChart, BarChart, PieChart, AreaChart, ResponsiveContainer, Tooltip |
| lucide-react | ^0.468.0 | Icon library (menu, close, chevron, user, bell, etc.) |
| axios | ^1.7.0 | HTTP client for all API communication |
| paystack-js | ^0.18.0 | Paystack inline payment integration |
| react-countdown | ^2.3.6 | Subscription expiration countdown timer on dashboard |
| date-fns | ^4.1.0 | Date formatting and manipulation for charts, subscription dates, transaction history |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @types/react | ^19.0.0 | React type definitions |
| @types/react-dom | ^19.0.0 | ReactDOM type definitions |
| @types/node | ^22.0.0 | Node type definitions |

### shadcn/ui Components (pre-installed via init script)

The webapp-building init script pre-installs 40+ shadcn/ui components. We use the following:

| Component | Usage |
|-----------|-------|
| Button | Primary/secondary CTAs, form submissions, navigation actions |
| Card | Feature cards, pricing cards, dashboard stat cards, blog post cards |
| Input | Registration form, login form, profile edit, expense/budget/savings forms |
| Label | Form field labels throughout |
| Dialog | Mobile menu overlay, confirmation modals (delete expense, cancel subscription) |
| Tabs | Dashboard section switching, settings tabs |
| Table | Transaction history list, billing history |
| Badge | Subscription status indicators, category tags |
| Avatar | User profile display in navbar and settings |
| Progress | Savings goal progress bars, budget utilization bars |
| Select | Category dropdown in expense forms, filter controls |
| Textarea | Note fields in expense/savings forms |
| Switch | Toggle preferences in settings, notification toggles |
| Separator | Visual dividers between sections |
| Sheet | Mobile sidebar navigation for dashboard |
| DropdownMenu | User profile dropdown, filter/sort menus |
| Skeleton | Loading states for dashboard stats, chart placeholders |
| Toast | Success/error notifications (via sonner, pre-installed) |
| Sonner | Toast notification system (wraps shadcn toast) |

### Google Fonts (loaded via `<link>` in index.html)

| Font | Weights | Purpose |
|------|---------|---------|
| DM Sans | 400 (Regular) | Display headings (H1–H5) |
| Inter | 300 (Light), 400 (Regular), 500 (Medium) | Body text, subheadings, buttons, UI elements |
| JetBrains Mono | 400 (Regular) | Data labels, metric values, monospace accents |

---

## Component Inventory

### Layout Components

| Component | Source | Reuse |
|-----------|--------|-------|
| Navbar | Custom | Landing page + all public pages (marketing site wrapper) |
| MobileMenu | Custom (shadcn Dialog) | Shared with Navbar, slides from right |
| DashboardLayout | Custom | All authenticated pages (sidebar + topbar + content area) |
| Sidebar | Custom (shadcn Sheet on mobile) | DashboardLayout child, collapsible on desktop |
| TopBar | Custom | DashboardLayout child, search + notifications + user avatar |
| Footer | Custom | Landing page + public pages |

### Page Sections (Landing / Public)

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Full-viewport hero with animated entrance |
| TrustedBySection | Custom | Logo grid with gradient fade edges |
| ProblemSection | Custom | 3-column feature cards with check lists |
| SolutionSection | Custom | 2-column alternating layout (3 repetitions) |
| ResourcesSection | Custom | Checklist + background image composition |
| BottomCTASection | Custom | Reusable CTA block (used twice on landing) |
| PricingSection | Custom | 2-card pricing (Free / Premium ₦2,000) |
| TestimonialsSection | Custom | 3 testimonial cards |
| FAQSection | Custom | Accordion-style FAQ list |
| FeaturesShowcaseSection | Custom | Feature grid with icons |
| AnalyticsShowcaseSection | Custom | Dashboard preview screenshots |

### Auth Components

| Component | Source | Notes |
|-----------|--------|-------|
| LoginForm | Custom (shadcn Input, Button) | Email + password, JWT storage |
| RegisterForm | Custom (shadcn Input, Button) | Full name + email + password, triggers Paystack payment before account creation |
| PaystackPayment | Custom (paystack-js) | Inline payment widget, handles success/failure callbacks |
| PaymentSuccessPage | Custom | Post-payment success + auto-login |
| PaymentFailedPage | Custom | Payment failure + retry CTA |
| SubscriptionExpiredPage | Custom | Blocker page when subscription lapses |
| RenewSubscriptionPage | Custom | Paystack renewal flow for expired users |
| ForgotPasswordForm | Custom | Email input + submission |

### Dashboard Components

| Component | Source | Notes |
|-----------|--------|-------|
| StatCard | Custom (shadcn Card) | Summary metrics (total expenses, monthly spend, budget remaining, savings progress) — 4 instances |
| ExpenseChart | Custom (recharts) | Monthly spending trend — LineChart with area fill |
| CategoryChart | Custom (recharts) | Spending by category — PieChart with legend |
| BudgetChart | Custom (recharts) | Budget vs actual — BarChart |
| SavingsChart | Custom (recharts) | Savings progress — AreaChart |
| ExpenseTable | Custom (shadcn Table) | Paginated transaction history with CRUD actions |
| AddExpenseModal | Custom (shadcn Dialog) | Form with voice entry toggle, category select (Nigerian categories) |
| BudgetCard | Custom (shadcn Card + Progress) | Budget item with utilization bar |
| SavingsGoalCard | Custom (shadcn Card + Progress) | Goal with progress ring/bar |
| ReminderList | Custom | Upcoming/past reminders with toggle/delete |
| NotificationPanel | Custom (shadcn Sheet) | Slide-out notification list |
| SubscriptionStatusCard | Custom | Active/expired badge + expiration countdown |
| SoftLifeScore | Custom | Gamified score display with visual meter |
| SavingsChallengeCard | Custom | Challenge progress + leaderboard hint |
| WhatsAppExportButton | Custom | Generates export message + opens WhatsApp |
| AIFinancialInsights | Custom | Generated insight cards based on spending patterns |
| VoiceExpenseEntry | Custom | Web Speech API integration for voice-to-text expense entry |
| RecentTransactions | Custom | Latest 5-10 transactions list |

### Reusable Components

| Component | Source | Usage |
|-----------|--------|-------|
| CTAButton | Custom | All primary/secondary CTAs across site — solid green with arrow icon |
| SectionHeading | Custom | H2 + paragraph pair used in every landing section |
| CheckItem | Custom | Green checkmark + text, used in feature cards and resources |
| FeatureCard | Custom | Icon + title + description + optional check list, used in ProblemSection and FeaturesShowcase |
| BlogCard | Custom | Image + category + title + date, used in BlogCarousel |
| LogoItem | Custom | Individual logo in TrustedBySection |
| LoadingScreen | Custom | Full-page loader with logo animation |
| EmptyState | Custom | Illustrated empty state for zero-data scenarios |
| ErrorState | Custom | Error boundary fallback + API error displays |
| GlassCard | Custom | Glassmorphism card wrapper used throughout dashboard |

### Hooks

| Hook | Purpose |
|------|---------|
| useAuth | JWT auth state, login/logout/register, token refresh, auth status |
| usePaystack | Initialize Paystack payment, handle callbacks, verify transactions |
| useSubscription | Check subscription status, expiration logic, renewal flow |
| useExpenses | CRUD operations for expenses, filtering, pagination |
| useBudgets | Budget CRUD, utilization calculation |
| useSavings | Savings goals CRUD, progress tracking |
| useReminders | Reminder CRUD, toggle active status |
| useNotifications | Fetch/read notifications, unread count |
| useDashboardStats | Aggregate stats computed from real MongoDB data |
| useToast | Trigger toast notifications (wraps sonner) |
| useVoiceEntry | Web Speech API wrapper for voice expense entry |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Hero entrance sequence (headline → subheadline → CTAs) | Framer Motion | `variants` with `staggerChildren: 0.15`, fade+translateY on each child. Triggered on mount. | Medium |
| Scroll-triggered section reveals (all landing sections) | Framer Motion | `whileInView` with `viewport={{ once: true, margin: "-100px" }}`, fade + translateY(40→0), duration 0.7s, ease-out | Low |
| Problem card staggered entrance | Framer Motion | Parent `staggerChildren: 0.15`, children fade+translateY, triggered by `whileInView` | Medium |
| Solution image scroll reveal (scale 1.2→1.0 + opacity) | Framer Motion | `whileInView` with initial `scale: 1.2, opacity: 0`, animate to `scale: 1, opacity: 1`, transition 1s ease-out. Uses `overflow: hidden` container. | Medium |
| Navbar shrink on scroll | Framer Motion | `useScroll` + `useTransform` to interpolate padding/height based on scrollY. Smooth spring transition. | Medium |
| Mobile menu slide-in | Framer Motion | `AnimatePresence` + slide from right (`x: 100% → 0%`), fade backdrop. Duration 0.3s. | Low |
| Page transitions (route changes) | Framer Motion | `AnimatePresence` wrapping router outlet, fade+slide on enter/exit. | Medium |
| Dashboard card entrance | Framer Motion | Staggered fade+scale on stat cards, triggered on route enter. | Low |
| Chart loading animation | Recharts built-in | `isAnimationActive={true}` with `animationDuration={1200}` on all charts. | Low |
| Skeleton shimmer loading | Custom CSS | `animate-pulse` Tailwind utility + gradient shimmer overlay. | Low |
| Toast notification enter/exit | Framer Motion + Sonner | Built-in sonner animations (slide+fade). | Low |
| Paystack loading spinner | Custom CSS | Rotating spinner with brand green color. | Low |
| Modal/dialog enter/exit | shadcn Dialog | Built-in Radix/Framer animations (fade+scale). | Low |
| Button hover effects | Tailwind + Framer | `whileHover={{ scale: 1.02 }}` + Tailwind transition classes for color/shadow changes. | Low |
| Glassmorphism hover lift | Framer Motion | `whileHover={{ y: -4, boxShadow: "..." }}` on GlassCard components. | Low |
| Scrollbar hide utility | CSS | `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` on horizontal scroll containers. | Low |

---

## State & Logic Plan

### 1. Authentication Architecture (JWT)

**Pattern**: Token stored in `localStorage` (access token), Axios request interceptor attaches `Authorization: Bearer <token>` header to every request. Response interceptor catches 401 → clears token → redirects to login.

**State**: React Context (`AuthContext`) providing `{ user, isAuthenticated, isLoading, login, register, logout }` globally. `useAuth` hook consumes this context.

**Flow**:
1. App mount → check localStorage for token → validate via `GET /api/auth/me` → set user state
2. Login → POST `/api/auth/login` → store token → fetch user → redirect to dashboard (check subscription)
3. Register → collect form data → redirect to Paystack payment → on success, backend creates account + returns JWT → auto-login
4. Logout → clear token + user state → redirect to landing page

### 2. Subscription Gating Logic

**Pattern**: Every authenticated route is wrapped in a `SubscriptionGuard` component that checks subscription status before rendering.

**Flow**:
1. Dashboard mount → `useSubscription` fetches user data including `subscriptionStatus` and `subscriptionEndDate`
2. If `status === "expired"` OR `new Date() > subscriptionEndDate` → redirect to `/subscription-expired`
3. SubscriptionExpired page shows countdown + Paystack renewal CTA
4. On successful renewal → backend extends `subscriptionEndDate` by 30 days → refresh user data → redirect to dashboard
5. Backend middleware on every protected API: verify JWT → check subscription status → reject with 403 if expired

### 3. Payment Flow (Paystack)

**Pattern**: Frontend initiates Paystack inline with user's email + amount (₦2,000). On callback, frontend sends reference to backend for verification.

**Flow**:
1. Registration → frontend calls `POST /api/payments/initialize` with email → backend creates payment record (status: pending) + returns Paystack authorization URL/reference
2. Frontend opens Paystack inline → user completes payment
3. Paystack callback (or webhook) → frontend calls `POST /api/payments/verify/:reference` → backend verifies with Paystack API using secret key → if successful, update payment status to "success", create user account with active subscription, return JWT
4. Frontend stores JWT → redirects to dashboard
5. If verification fails → show PaymentFailed page with retry option

**Security**: Paystack secret key NEVER exposed on frontend. All verification happens server-side.

### 4. Voice Expense Entry

**Pattern**: Uses Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).

**Flow**:
1. User clicks microphone icon in AddExpenseModal
2. Start `SpeechRecognition` with Nigerian English locale (`en-NG`)
3. On result → parse spoken text → extract amount (number detection) + description → populate form fields
4. Show real-time transcript feedback while listening
5. Handle API unavailability gracefully with fallback message

### 5. Dashboard Data Architecture

**Pattern**: Each dashboard section fetches its own data via custom hooks. Aggregated stats computed client-side from fetched data.

**Data Flow**:
- `useDashboardStats` → parallel fetches: expenses, budgets, savings → computes: total expenses, monthly spend, budget remaining, savings progress percentage
- Charts consume raw arrays from `useExpenses`, `useBudgets`, `useSavings` hooks
- All data fetched on dashboard mount, with periodic refresh (e.g., every 60s while active)
- Optimistic updates on CRUD operations (update UI immediately, sync with server)

### 6. Real-Time Notifications

**Pattern**: Polling-based (every 30s) for simplicity. `useNotifications` hook fetches unread count, displays bell icon badge, opens NotificationPanel on click.

**Triggers** (generated server-side):
- Subscription expiring soon (7 days, 3 days, 1 day)
- Budget exceeded
- Savings goal milestone reached
- New AI financial insight available
- Reminder due

### 7. Soft Life Score & Gamification

**Pattern**: Client-side calculation based on user's financial behavior.

**Formula components** (server computes, stores in `FinancialInsight`):
- Budget adherence ratio (spent vs budgeted)
- Savings consistency (regular deposits)
- Expense tracking frequency (daily entries)
- Category diversification
- Score: 0-100, displayed as animated circular progress

**Savings Challenges**: Server-managed challenges with progress tracking. Users join challenges, server tracks collective/participant progress.

---

## Other Key Decisions

### Routing Structure

```
/                           → LandingPage (public)
/login                      → LoginPage (public)
/register                   → RegisterPage (public)
/forgot-password            → ForgotPasswordPage (public)
/payment-success            → PaymentSuccessPage (public, post-payment)
/payment-failed             → PaymentFailedPage (public, post-payment)
/subscription-expired       → SubscriptionExpiredPage (auth, expired sub)
/renew-subscription        → RenewSubscriptionPage (auth, expired sub)
/dashboard                  → DashboardPage (auth + active sub)
/dashboard/expenses         → ExpensesPage (auth + active sub)
/dashboard/budgets          → BudgetsPage (auth + active sub)
/dashboard/savings          → SavingsPage (auth + active sub)
/dashboard/reminders        → RemindersPage (auth + active sub)
/dashboard/notifications    → NotificationsPage (auth + active sub)
/dashboard/settings         → SettingsPage (auth + active sub)
/dashboard/profile          → ProfilePage (auth + active sub)
```

### Responsive Breakpoints

Following the design system:
- Mobile: < 768px (single column, stacked nav, bottom spacing 60px)
- Tablet: 768px – 1024px (2-column grids, adjusted padding)
- Desktop: 1025px – 1440px (full layout, max-width 1248px container)
- Large: > 1440px (max-width 1600px container)

### API Client Setup

Axios instance with:
- Base URL from environment variable (`VITE_API_URL`)
- Request interceptor: attach JWT from localStorage
- Response interceptor: handle 401 (redirect login), 403 (subscription expired redirect), 500 (toast error)

### MongoDB Connection

Mongoose connection with:
- Connection string from environment variable (`MONGODB_URI` for MongoDB Atlas)
- Connection pooling, retry logic
- Schema timestamps enabled on all models
- `user: ObjectId` reference on all user-owned documents for data isolation

### Security Measures

- Passwords hashed with bcrypt (salt rounds: 12)
- JWT tokens with 24h expiry, refreshed on activity
- All API routes protected except auth/public endpoints
- CORS configured for frontend origin only
- Rate limiting on auth endpoints (prevent brute force)
- Input validation on all endpoints (mongoose schema + manual validation)
- Helmet.js for security headers
