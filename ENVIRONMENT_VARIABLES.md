# Environment Variables Configuration

This document outlines all environment variables used across the Profesional platform.

## 🌍 Common Variables

### Required for all environments

```bash
NODE_ENV=development|production|test
LOG_LEVEL=debug|info|warn|error
```

### Optional observability

```bash
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
POSTHOG_KEY=phc_your-posthog-key
```

## 🌐 Web App Variables (Next.js)

### Required

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001          # Development
NEXT_PUBLIC_API_URL=https://api.profesional.com    # Production

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000          # Development
NEXT_PUBLIC_APP_URL=https://profesional.com        # Production
```

### Optional

```bash
# Analytics & Monitoring
NEXT_PUBLIC_POSTHOG_KEY=phc_your-posthog-key
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
```

## 🔧 API Variables (NestJS)

### Database

```bash
# PostgreSQL Connection
DATABASE_URL=postgresql://user:password@localhost:5432/profesional_dev
DATABASE_URL=postgresql://user:password@host:5432/profesional_prod
```

### Authentication

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Payment Gateway (MercadoPago)

```bash
# MercadoPago Configuration
MP_ACCESS_TOKEN=APP_USR-your-mercadopago-access-token
MP_WEBHOOK_SECRET=your-webhook-secret-key
MP_ENVIRONMENT=sandbox|production
```

### File Storage (S3 Compatible)

```bash
# Storage Configuration
STORAGE_ENDPOINT=https://s3.amazonaws.com
STORAGE_BUCKET=profesional-uploads
STORAGE_ACCESS_KEY=your-access-key
STORAGE_SECRET_KEY=your-secret-key
STORAGE_REGION=us-east-1
```

### Security & CORS

```bash
# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://profesional.com
```

### Email Service

```bash
# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📋 Environment Files Structure

### Development (.env.local)

```bash
# Common
NODE_ENV=development
LOG_LEVEL=debug

# Web App
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API
DATABASE_URL=postgresql://postgres:password@localhost:5432/profesional_dev
JWT_SECRET=development-jwt-secret-key-32-chars-min
JWT_REFRESH_SECRET=development-refresh-secret-key-32-chars-min
MP_ACCESS_TOKEN=TEST-your-test-token
MP_WEBHOOK_SECRET=test-webhook-secret
STORAGE_ENDPOINT=http://localhost:9000
STORAGE_BUCKET=profesional-dev
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
ALLOWED_ORIGINS=http://localhost:3000
```

### Production Environment Variables

```bash
# Common
NODE_ENV=production
LOG_LEVEL=info
SENTRY_DSN=https://your-production-sentry-dsn@sentry.io/project-id
POSTHOG_KEY=phc_your-production-posthog-key

# Web App
NEXT_PUBLIC_API_URL=https://api.profesional.com
NEXT_PUBLIC_APP_URL=https://profesional.com
NEXT_PUBLIC_POSTHOG_KEY=phc_your-production-posthog-key
NEXT_PUBLIC_SENTRY_DSN=https://your-production-sentry-dsn@sentry.io/project-id

# API
DATABASE_URL=postgresql://username:password@host:5432/profesional_prod
JWT_SECRET=production-super-secure-jwt-secret-key
JWT_REFRESH_SECRET=production-super-secure-refresh-secret-key
MP_ACCESS_TOKEN=APP_USR-your-production-token
MP_WEBHOOK_SECRET=production-webhook-secret
STORAGE_ENDPOINT=https://s3.amazonaws.com
STORAGE_BUCKET=profesional-production
STORAGE_ACCESS_KEY=your-production-access-key
STORAGE_SECRET_KEY=your-production-secret-key
ALLOWED_ORIGINS=https://profesional.com
```

## 🚦 Deployment Configuration

### Vercel (Web App)

Set these in Vercel dashboard:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`

### Railway (API)

Set these in Railway dashboard:

- `DATABASE_URL` (auto-provided by Railway PostgreSQL)
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `MP_ACCESS_TOKEN`
- `MP_WEBHOOK_SECRET`
- `STORAGE_*` variables
- `ALLOWED_ORIGINS`
- `SENTRY_DSN`
- `NODE_ENV=production`

## 🔐 Security Notes

1. **Never commit secrets** to version control
2. **Use strong, unique secrets** for production
3. **Rotate secrets regularly**
4. **Use environment-specific values**
5. **Validate all environment variables** at runtime
