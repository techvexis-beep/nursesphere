# NurseSphere

Global-first nursing advocacy and professional intelligence platform. AI-powered ecosystem for education, migration tracking, exam preparation, and career advancement.

## Architecture

```
nursesphere/
├── apps/
│   ├── web/          # Next.js 14 (App Router) — Landing, Dashboard, Full Platform
│   ├── api/          # NestJS REST API — Auth, Business Logic, WebSocket Events
│   └── mobile/       # Expo (React Native) — iOS/Android Mobile App
├── packages/
│   └── ui/           # Shared UI components (Button, Card, Badge, Input, Label)
├── .github/
│   └── workflows/    # CI/CD pipeline (lint, test, build, deploy)
├── package.json      # Root workspace scripts
├── vercel.json       # Vercel deployment config
└── .nvmrc            # Node 22
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | Next.js 14, React 18, TypeScript, TailwindCSS, Framer Motion, Shadcn/Radix UI |
| Mobile | Expo SDK 51, React Native, Redux Toolkit, Expo Router |
| API | NestJS, Prisma ORM, Passport (JWT), Socket.IO |
| Database | PostgreSQL (prod) / SQLite (dev), Redis |
| Payments | Stripe |
| AI | xAI Grok, OpenAI, Claude integration |
| Auth | JWT + bcryptjs, Email verification |
| Deployment | Vercel (web), Render (API), EAS (mobile) |

## Features

- **Migration Tracker** — End-to-end tracking for NCLEX, IELTS, OET, visa processing, credential evaluation
- **CBT Exam Platform** — Adaptive computer-based testing with analytics and performance insights
- **AI Clinical Intelligence** — AI-powered clinical decision support, drug interaction alerts
- **Global Nursing Regulators** — Official licensing pathways from 120+ countries with verified boards
- **Community Network** — Forums, threads, Q&A, upvotes, community moderation
- **Job Board** — International nursing positions with salary insights and visa sponsorship filters
- **Clinical Logbook** — Digital portfolio for clinical hours, procedures, competencies
- **Dosage Calculator** — Weight-based, pediatric, and renal-adjusted dosing
- **Marketplace** — Buy/sell study materials, equipment, scrubs
- **Mental Health & Wellness** — Burnout assessments, peer support, mindfulness
- **Advocacy & Salary Transparency** — Anonymous salary reports, workplace advocacy
- **Live Q&A Sessions** — Real-time sessions with nursing regulators
- **Direct Messaging** — Conversation-based messaging between users
- **Reputation System** — Badges, expert levels, follower/following
- **AI Study Tutor** — Personalized study plans, spaced repetition
- **Research Hub** — Latest nursing research and evidence-based practice

## Prerequisites

- Node.js 20+ (`.nvmrc` specifies 22)
- PostgreSQL 16+ (or SQLite for local dev)
- Redis 7+ (optional, for caching)
- Docker & Docker Compose (optional)

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-org/nursesphere.git
cd nursesphere
npm install
```

### 2. Set up environment variables

```bash
# API
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your values

# Web
cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local with your values
```

### 3. Start the API (with SQLite, no Docker needed)

```bash
cd apps/api
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
# API runs at http://localhost:4000
```

### 4. Start the Web app

```bash
cd apps/web
npm install
npm run dev
# Web runs at http://localhost:3000
```

### 5. Start the Mobile app

```bash
cd apps/mobile
npm install
npx expo start
# Scan QR code with Expo Go
```

### Alternative: Docker Compose (PostgreSQL + Redis)

```bash
docker-compose up -d
```

## Environment Variables

### API (`apps/api/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (or SQLite `file:./dev.db`) |
| `JWT_SECRET` | Yes | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `PORT` | No | API port (default: `4000`) |
| `NEXT_PUBLIC_APP_URL` | No | Frontend URL for CORS |
| `ENCRYPTION_KEY` | Yes | 32-char key for data encryption |
| `REDIS_URL` | No | Redis connection string |

### Web (`apps/web/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | API base URL (default: `http://localhost:4000`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key |
| `STRIPE_SECRET_KEY` | No | Stripe secret key (server-side) |
| `NEXT_PUBLIC_ENCRYPTION_KEY` | No | Encryption key for client-side crypto |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/users/me` | Get profile |
| PUT | `/api/users/me` | Update profile |
| GET | `/api/migration/progress` | Get migration progress |
| PUT | `/api/migration/progress` | Update progress |
| GET | `/api/clinical-logs` | Get clinical logs |
| POST | `/api/clinical-logs` | Create clinical log |
| GET | `/api/exams/questions` | Get exam questions |
| POST | `/api/exams/submit` | Submit exam attempt |
| POST | `/api/advocacy/report` | Submit advocacy report |
| POST | `/api/advocacy/salary` | Submit salary data |
| GET | `/api/jobs` | List jobs |
| POST | `/api/jobs` | Create job listing |
| GET | `/api/regulators` | List nursing regulators |
| GET | `/api/community` | List communities |
| GET | `/api/ai/chat` | AI chat assistant |
| POST | `/api/stripe/create-checkout-session` | Stripe checkout |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:web` | Start web dev server |
| `npm run dev:api` | Start API dev server |
| `npm run build:web` | Build web app |
| `cd apps/web && npm run lint` | Lint web app |
| `cd apps/api && npm run lint` | Lint API |
| `cd apps/mobile && npm run start` | Start mobile app |

## Project Structure

### Web (`apps/web/src/`)
- `app/` — Next.js App Router pages and API routes
- `components/` — React components (UI, features, modals)
- `lib/` — Utilities, API client, crypto, Stripe, Prisma, email
- `hooks/` — Custom React hooks

### API (`apps/api/src/`)
- `auth/` — Authentication (JWT, register, login)
- `users/` — User management
- `migration/` — Migration progress tracking
- `clinical-log/` — Clinical logbook
- `exam/` — CBT exam platform
- `advocacy/` — Advocacy reports and salary transparency
- `jobs/` — Job board
- `ai/` — AI integration
- `community/` — Community forums and threads
- `regulator/` — Nursing regulator management
- `live-qa/` — Live Q&A sessions (WebSocket)
- `messages/` — Direct messaging
- `ama/` — AMA sessions
- `documents/` — Document management
- `notifications/` — Notification system
- `events/` — Real-time events (Socket.IO)
- `profile/` — User profiles
- `reputation/` — Reputation and badges
- `prisma/` — Prisma service, schema, seeds

### Mobile (`apps/mobile/`)
- `app/` — Expo Router screens (auth, onboarding, tabs)
- `src/` — Redux store, services, screens, navigation, components

## Database

The project uses Prisma ORM with two schema files:

- **`apps/api/src/prisma/schema.prisma`** — Authoritative schema (40+ models, SQLite for dev)
- **`apps/web/prisma/schema.prisma`** — Web-specific schema (PostgreSQL)

Key models: `User`, `ClinicalLog`, `MigrationProgress`, `ExamAttempt`, `Job`, `Employer`, `Community`, `CommunityPost`, `Regulator`, `DirectMessage`, `Conversation`, `AMASession`, `Badge`, `UserProfile`, and many more.

## Deployment

### Web (Vercel)
- Automatic deploys from `main` branch
- Configured via `vercel.json`

### API (Render)
- Deploy NestJS API with PostgreSQL
- Set environment variables in Render dashboard

### Mobile (EAS)
```bash
cd apps/mobile
npx eas build --platform ios
npx eas build --platform android
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
