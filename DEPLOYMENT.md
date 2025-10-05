# Deployment Guide

This guide covers deployment configuration for the Profesional platform using Vercel (web) and Railway (API).

## 🚀 Quick Deploy

### Prerequisites

- GitHub repository connected
- Vercel account
- Railway account
- Environment variables configured

## 📱 Web App Deployment (Vercel)

### 1. Vercel Configuration

Create `vercel.json` in `apps/web/`:

```json
{
  "framework": "nextjs",
  "buildCommand": "cd ../.. && pnpm build --filter=web",
  "devCommand": "cd ../.. && pnpm dev --filter=web",
  "installCommand": "cd ../.. && pnpm install",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@next-public-api-url",
    "NEXT_PUBLIC_APP_URL": "@next-public-app-url",
    "NEXT_PUBLIC_POSTHOG_KEY": "@next-public-posthog-key",
    "NEXT_PUBLIC_SENTRY_DSN": "@next-public-sentry-dsn"
  }
}
```

### 2. Environment Variables in Vercel

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

**Production:**

```bash
NEXT_PUBLIC_API_URL=https://api.profesional.com
NEXT_PUBLIC_APP_URL=https://profesional.com
NEXT_PUBLIC_POSTHOG_KEY=phc_your_production_key
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project
```

**Preview (for PR builds):**

```bash
NEXT_PUBLIC_API_URL=https://api-staging.profesional.com
NEXT_PUBLIC_APP_URL=https://staging.profesional.com
NEXT_PUBLIC_POSTHOG_KEY=phc_your_staging_key
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project
```

### 3. Deploy Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Link project (run in apps/web/)
vercel link

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## 🔧 API Deployment (Railway)

### 1. Railway Configuration

Create `railway.toml` in `apps/api/`:

```toml
[build]
builder = "nixpacks"
buildCommand = "cd ../.. && pnpm install && pnpm build --filter=api"

[deploy]
startCommand = "cd apps/api && pnpm start:prod"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "always"

[environment]
NODE_ENV = "production"
```

### 2. Nixpacks Configuration

Create `nixpacks.toml` in project root:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "pnpm"]

[phases.install]
cmds = ["pnpm install --frozen-lockfile"]

[phases.build]
cmds = [
  "pnpm build --filter=api",
  "cd apps/api && pnpm prisma generate"
]

[start]
cmd = "cd apps/api && pnpm start:prod"
```

### 3. Environment Variables in Railway

Set these in Railway Dashboard → Project → Variables:

```bash
# Database (auto-provided by Railway PostgreSQL addon)
DATABASE_URL=${{ PGUSER }}:${{ PGPASSWORD }}@${{ PGHOST }}:${{ PGPORT }}/${{ PGDATABASE }}

# Authentication
JWT_SECRET=your-production-jwt-secret-32-chars-minimum
JWT_REFRESH_SECRET=your-production-refresh-secret-32-chars-minimum

# MercadoPago
MP_ACCESS_TOKEN=APP_USR-your-production-token
MP_WEBHOOK_SECRET=your-production-webhook-secret
MP_ENVIRONMENT=production

# Storage
STORAGE_ENDPOINT=https://s3.amazonaws.com
STORAGE_BUCKET=profesional-production
STORAGE_ACCESS_KEY=your-access-key
STORAGE_SECRET_KEY=your-secret-key

# Security
ALLOWED_ORIGINS=https://profesional.com

# Observability
SENTRY_DSN=https://your-dsn@sentry.io/project
POSTHOG_KEY=phc_your_production_key

# System
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
```

## 🔄 Automated Deployment

### GitHub Actions Integration

The CI/CD pipeline automatically deploys when:

1. **Quality gates pass** (lint, test, typecheck)
2. **Push to main branch**
3. **Build succeeds**

### Deployment Flow:

```
PR Created → Quality Checks → PR Merged → Deploy Production
```

### Manual Deployment

**Vercel:**

```bash
# From apps/web/
vercel --prod
```

**Railway:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Deploy
railway up
```

## 🔍 Health Checks

### API Health Endpoint

```typescript
// apps/api/src/health/health.controller.ts
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  };
}
```

### Monitoring URLs

- **API Health:** `https://api.profesional.com/health`
- **Web Status:** Vercel automatically monitors Next.js apps

## 📊 Environment-Specific Configurations

### Development

```bash
# Local development
pnpm dev

# Environment files
apps/web/.env.local
apps/api/.env.local
```

### Staging

```bash
# Staging branches auto-deploy to preview URLs
# Vercel: Deploy preview for each PR
# Railway: Can set up staging service
```

### Production

```bash
# Production deployment
# Triggered by push to main branch
# Manual: vercel --prod / railway up
```

## 🚨 Rollback Strategy

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Railway Rollback

```bash
# Via Railway CLI
railway rollback

# Or redeploy previous commit
git revert [commit-hash]
git push origin main
```

## 📋 Post-Deployment Checklist

- [ ] Health endpoints responding
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates active
- [ ] Domain names configured
- [ ] Monitoring alerts configured
- [ ] Error tracking active
- [ ] Analytics tracking active
- [ ] Performance monitoring enabled
