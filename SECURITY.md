# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability within NurseSphere, please send an email to **security@nursesphere.com**. All security vulnerabilities will be promptly addressed.

**Please do NOT report security vulnerabilities through public GitHub issues.**

### What to include

- Type of vulnerability (e.g., SQL injection, XSS, authentication bypass)
- Full paths of source file(s) related to the vulnerability
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact assessment

### Response timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 5 business days
- **Resolution timeline:** Depends on severity, typically 7-30 days
- **Disclosure:** Coordinated disclosure after fix is deployed

## Security Practices

### Authentication
- JWT tokens with short expiration (7 days default)
- Password hashing with bcrypt (10 salt rounds)
- Email verification required for sensitive actions
- Rate limiting on auth endpoints

### Data Protection
- AES-256 encryption for sensitive data at rest
- TLS 1.2+ for all data in transit
- Secure token generation using `crypto.randomBytes`
- Environment-based encryption keys (never hardcoded)

### API Security
- Input validation and sanitization via class-validator
- CORS configured per-environment
- Request whitelisting (NestJS ValidationPipe)
- SQL injection prevention via Prisma ORM parameterized queries

### Mobile Security
- Expo SecureStore for credential storage (uses iOS Keychain / Android Keystore)
- No sensitive data in AsyncStorage
- Certificate pinning for production builds

### Infrastructure
- Database backups and access controls
- Environment variables for all secrets (never committed)
- CI/CD pipeline with security scanning
- Dependency auditing via `npm audit`

## Scope

The following are in scope:
- NurseSphere web application (`apps/web`)
- NurseSphere API (`apps/api`)
- NurseSphere mobile app (`apps/mobile`)
- Authentication and authorization mechanisms
- Data encryption and storage
- API endpoints and input handling

The following are out of scope:
- Third-party services (Stripe, Firebase, etc.)
- Social engineering attacks
- Physical security

## Safe Harbor

We support responsible disclosure and will not take legal action against researchers who:

- Make a good faith effort to avoid privacy violations and data destruction
- Only interact with accounts you own or have explicit permission to test
- Do not exploit a vulnerability beyond what is necessary to confirm its existence
- Report vulnerabilities promptly and do not publicly disclose before a fix is available

## Contact

- **Email:** security@nursesphere.com
- **PGP Key:** Available on request
