# Contributing to NurseSphere

Thank you for your interest in contributing to NurseSphere. This guide will help you get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy environment files:
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   ```
4. Set up the database:
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Start development servers:
   ```bash
   npm run dev:web   # Web at localhost:3000
   npm run dev:api   # API at localhost:4000
   ```

## Project Structure

- `apps/web` — Next.js 14 web application
- `apps/api` — NestJS REST API
- `apps/mobile` — Expo React Native mobile app
- `packages/ui` — Shared UI components

## Code Standards

### TypeScript

- Strict mode is enabled across all projects
- Use explicit return types on exported functions
- Avoid `any` — use proper types or `unknown` with type guards

### Style

- We use Prettier for formatting (run `npm run format` before committing)
- Follow existing patterns in each app
- Components: PascalCase files, named exports
- Utilities: camelCase files, named exports

### Git

- Use descriptive commit messages
- Reference issues where applicable (e.g., `feat: add NCLEX question bank (#42)`)
- Keep commits focused — one logical change per commit

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes following the code standards above
3. Add tests for new functionality
4. Run lint and type checks:
   ```bash
   npm run lint
   npm run typecheck:web
   npm run typecheck:api
   ```
5. Ensure all tests pass
6. Submit your PR with a clear description of changes

### PR Description Template

```
## What
Brief description of the change.

## Why
Context for why this change is needed.

## How
Implementation details if non-obvious.

## Testing
How to verify the change works.
```

## Testing

### Web (Jest)
```bash
cd apps/web
npm run test
npm run test:coverage
```

### API (Jest)
```bash
cd apps/api
npm run test
npm run test:cov
```

## Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Include steps to reproduce for bugs
- Include environment details (OS, Node version, browser)
- For security issues, see SECURITY.md

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## Questions?

Open a GitHub Discussion or reach out on the NurseSphere community forums.
