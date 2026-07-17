# Changelog

All notable changes to NurseSphere will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive README with architecture diagram and feature overview
- Environment variable examples for all apps (web, API, mobile)
- Root-level Prettier configuration and format scripts
- Shared TypeScript base configuration
- Error boundaries for web and mobile apps
- Jest testing setup for web app with crypto utility tests
- Jest testing setup for API app with auth controller tests
- CI/CD pipeline with lint, typecheck, build, and test stages
- CONTRIBUTING.md with development guidelines
- PRIVACY_POLICY.md covering GDPR, CCPA, and HIPAA considerations
- CHANGELOG.md (this file)
- SECURITY.md with vulnerability reporting guidelines

### Changed
- Strengthened TypeScript strictness in API (strict mode, noImplicitAny)
- Updated root package.json with comprehensive workspace scripts
- Improved CI/CD pipeline with parallel lint and typecheck jobs

### Security
- Added error boundary components to prevent full app crashes
- Updated API TypeScript config with strict null checks and implicit any prevention

## [1.0.0] - 2026-07-17

### Added
- Initial release of NurseSphere platform
- Web application (Next.js 14)
  - Landing page with animated UI
  - User authentication (register, login, email verification)
  - Dashboard with personalized content
  - NCLEX/CBT exam platform
  - Migration tracker (NCLEX, IELTS, OET, visa)
  - Clinical logbook
  - Dosage calculator
  - Job board with salary transparency
  - Community forums and threads
  - AI clinical assistant
  - AI study tutor
  - Direct messaging
  - AMA sessions
  - Nursing regulator directory
  - Mental health resources
  - Marketplace
  - Research hub
  - News feed
  - Reputation and badge system
  - Admin dashboard
  - Stripe payment integration
- API (NestJS)
  - JWT authentication
  - RESTful API with 20+ modules
  - Prisma ORM with PostgreSQL/SQLite support
  - WebSocket support for real-time features
  - Rate limiting and validation
- Mobile app (Expo)
  - Cross-platform iOS/Android support
  - Expo Router navigation
  - Redux state management
  - Firebase integration
  - Onboarding flow
