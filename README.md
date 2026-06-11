# NurseSphere 🌍

Global-First Nursing Advocacy & Professional Intelligence Platform

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn UI
- **Backend**: NestJS (coming soon)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Monorepo**: Turborepo

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16+
- Redis 7+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/nursesphere.git
cd nursesphere
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your values
```

4. Start Docker services:
```bash
docker-compose up -d
```

5. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
nursesphere/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend (coming soon)
├── packages/
│   ├── ui/           # Shared UI components
│   ├── config/       # Shared config
│   └── types/        # Shared TypeScript types
├── turbo.json        # Turborepo config
└── docker-compose.yml
```

## Available Scripts

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps
- `npm run lint` - Lint all apps
- `npm run clean` - Clean all build outputs

## License

MIT
