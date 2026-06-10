# BudgetWise — Your Smart Money Companion

A complete full-stack MERN SaaS expense tracking and spending management web application built for the Nigerian market.

## Features

### Core Features
- **Smart Expense Tracking** — Log expenses with Nigerian categories (Food & Jollof, Bolt/Uber, Generator Fuel, NEPA Bills, Church Offering, etc.)
- **Budget Management** — Set monthly budgets with real-time utilization tracking
- **Savings Goals** — Create and track savings targets with visual progress indicators
- **AI Financial Insights** — Personalized spending analysis and recommendations
- **Soft Life Score** — Gamified financial health scoring (0-100)
- **Voice Expense Entry** — Speech-to-text expense logging
- **Smart Reminders** — Never miss bill payments or savings deposits
- **Notifications** — Real-time alerts for budgets, goals, and subscriptions

### SaaS Features
- **Monthly Subscription** — ₦2,000/month via Paystack
- **JWT Authentication** — Secure login/register with bcrypt password hashing
- **Subscription Gating** — Expired subscriptions block dashboard access
- **Payment Flow** — Paystack inline payment with backend verification
- **Renewal System** — Automatic expiration detection and renewal flow

## Tech Stack

### Frontend
- React.js + TypeScript + Vite
- Tailwind CSS + shadcn/ui components
- Framer Motion (animations)
- Recharts (charts & analytics)
- Lucide React (icons)
- Axios (API client)
- React Router DOM (routing)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication + bcryptjs
- Paystack API integration
- Helmet.js + CORS + Rate Limiting

## Project Structure

```
/BudgetWise/
├── app/                    # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/    # Landing page sections
│   │   │   └── dashboard/  # Dashboard layout & components
│   │   ├── context/        # Auth context
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services (Axios)
│   │   ├── types/          # TypeScript types
│   │   └── ...
│   ├── .env
│   └── package.json
│
├── server/                 # Backend Express application
│   ├── config/             # Configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth & subscription middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── server.js           # Entry point
│   ├── .env.example
│   └── package.json
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Paystack account (for payments)

### 1. Clone & Setup

```bash
# Backend setup
cd BudgetWise/server
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Paystack keys
npm install

# Frontend setup
cd ../app
# Edit .env with your API URL and Paystack public key
npm install
```

### 2. Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=24h
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
```

### 3. Run

```bash
# Backend (from /BudgetWise/server)
npm run server
# Server runs on http://localhost:5000

# Frontend (from /BudgetWise/app)
npm run dev
# Frontend runs on http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Get current user
- `POST /api/auth/forgot-password` — Request password reset

### Expenses
- `GET /api/expenses` — List expenses
- `POST /api/expenses` — Create expense
- `PUT /api/expenses/:id` — Update expense
- `DELETE /api/expenses/:id` — Delete expense

### Budgets
- `GET /api/budgets` — List budgets
- `POST /api/budgets` — Create budget
- `PUT /api/budgets/:id` — Update budget

### Savings
- `GET /api/savings` — List savings goals
- `POST /api/savings` — Create goal
- `PUT /api/savings/:id` — Update goal
- `DELETE /api/savings/:id` — Delete goal

### Reminders
- `GET /api/reminders` — List reminders
- `POST /api/reminders` — Create reminder
- `PUT /api/reminders/:id` — Update reminder
- `DELETE /api/reminders/:id` — Delete reminder

### Payments (Paystack)
- `POST /api/payments/initialize` — Initialize payment
- `POST /api/payments/verify/:reference` — Verify payment
- `POST /api/payments/renew` — Renew subscription
- `GET /api/payments/history` — Payment history

### Dashboard
- `GET /api/dashboard/stats` — Dashboard statistics
- `GET /api/dashboard/insights` — AI insights
- `GET /api/dashboard/soft-life-score` — Soft Life Score
- `GET /api/dashboard/challenges` — Savings challenges

## Nigerian Expense Categories

- Transport, Bolt/Uber, Food & Jollof, Generator Fuel
- POS Charges, Airtime, Data Subscription
- Family Support, Church Offering, Rent, NEPA Bills

## Deployment

### Frontend
- **Vercel** or **Netlify**
- Build: `npm run build`
- Deploy the `dist/` folder

### Backend
- **Render** or **Railway**
- Start: `npm run server`
- Set environment variables on the platform

### Database
- **MongoDB Atlas** — Free tier available

## License

MIT License
