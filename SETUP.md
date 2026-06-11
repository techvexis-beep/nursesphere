# NurseSphere Development Environment

## Quick Start (No Docker Required!)

### Prerequisites
- Node.js 20+

### Setup Steps

1. **Install backend dependencies**:
```bash
cd nursesphere/apps/api
npm install
```

2. **Generate Prisma client and create database**:
```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
```

3. **Install frontend dependencies**:
```bash
cd apps/web
npm install
```

4. **Start the development servers**:

Backend (Terminal 1):
```bash
cd apps/api
npm run start:dev
```
API runs at: http://localhost:4000

Frontend (Terminal 2):
```bash
cd apps/web
npm run dev
```
App runs at: http://localhost:3000

## Features Implemented

- ✅ User authentication (JWT)
- ✅ Migration tracker (NCLEX, IELTS, OET, Visa)
- ✅ Clinical logbook
- ✅ Drug dosage calculators
- ✅ CBT exam platform
- ✅ Advocacy & salary transparency
- ✅ Mental health resources
- ✅ Nurse marketplace

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/users/me | Get profile |
| PUT | /api/users/me | Update profile |
| GET | /api/migration/progress | Get migration progress |
| PUT | /api/migration/progress | Update progress |
| GET | /api/clinical-logs | Get all logs |
| POST | /api/clinical-logs | Create log |
| GET | /api/exams/questions | Get exam questions |
| POST | /api/exams/submit | Submit exam |
| POST | /api/advocacy/report | Submit report |
| POST | /api/advocacy/salary | Submit salary data |

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Backend**: NestJS, Prisma ORM
- **Database**: SQLite (local dev)
- **Auth**: JWT
