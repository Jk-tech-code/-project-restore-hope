# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest (main branch) | ✅ |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, report them via email to: **info@projectrestorehope.com**

You should receive a response within 48 hours. If you do not, please follow up.

### What to include

- A clear description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Any suggested fixes (if known)

## What to Expect

- We will acknowledge receipt within 48 hours
- We will provide an initial assessment within 5 business days
- We will keep you informed of progress toward a fix
- We will credit you in the release notes (if desired)

## Scope

This security policy covers the public website and backend API at:

- `https://projectrestorehope.com`
- `https://api.projectrestorehope.com`

## Known Security Practices

This project follows these security practices:

- **Environment variables** — All secrets (database URIs, API keys, SMTP credentials) are stored in `backend/.env` and excluded from version control via `.gitignore`
- **Input validation** — Form inputs are validated server-side via Mongoose schemas
- **CORS** — Configurable CORS policy in the backend
- **HTTPS** — All production traffic should use HTTPS (configure at the hosting/CDN level)

## Out of Scope

- Social engineering attacks
- Physical attacks
- DDOS attacks
- Issues in third-party dependencies that are already reported upstream
