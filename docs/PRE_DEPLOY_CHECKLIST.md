# Pre-Deploy Checklist

**Lex Intel Visual Design - Desenvolvido por Lex Intelligentia**

This document provides a complete checklist for deploying the application to staging and production environments.

---

## Quick Start

```bash
# Run automated pre-deploy verification
./scripts/pre-deploy.sh

# Quick mode (skip tests and build)
./scripts/pre-deploy.sh --quick
```

---

## 1. GitHub Secrets Configuration

The following secrets must be configured in **GitHub Repository Settings > Secrets and variables > Actions**:

### Required Secrets

| Secret Name | Description | How to Obtain |
|-------------|-------------|---------------|
| `RAILWAY_TOKEN` | Railway API token for deployment | Run `railway login && railway token` |
| `RAILWAY_PROJECT_ID` | Railway project identifier | Railway Dashboard > Project Settings |
| `RAILWAY_SERVICE_STAGING` | Service ID for staging environment | Railway Dashboard > Project > Service > Settings |
| `RAILWAY_SERVICE_PRODUCTION` | Service ID for production (optional) | Railway Dashboard > Project > Service > Settings |

### Environment Variables (Repository Variables)

Configure in **Settings > Secrets and variables > Actions > Variables**:

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `DEPLOY_URL_STAGING` | Staging environment URL | `https://staging.lexintel.app` |
| `DEPLOY_URL_PRODUCTION` | Production environment URL | `https://lexintel.app` |

---

## 2. Environment Variables (Railway/Server)

Configure these in Railway service environment or `.env` file:

### Required Variables

```bash
# Authentication
JWT_SECRET=<32+ character secret>        # Generate: openssl rand -base64 32
OAUTH_SERVER_URL=https://oauth.manus.app # Manus OAuth server URL

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Environment
NODE_ENV=production                       # Must be 'production'
PORT=3000                                 # Server port (Railway sets automatically)
```

### Recommended Variables

```bash
# Error Tracking (Sentry)
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Security
ALLOWED_ORIGINS=https://lexintel.app,https://www.lexintel.app
LOG_LEVEL=info                            # Options: debug, info, warn, error

# Performance (Optional)
REDIS_URL=redis://...                     # For distributed rate limiting
MAX_PAYLOAD_SIZE_MB=50                    # Max request body size
```

---

## 3. Database Setup

### Supabase PostgreSQL

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for initialization (~2 minutes)

2. **Get Connection String**
   - Go to **Settings > Database**
   - Copy the **Connection string (URI)**
   - Replace `[YOUR-PASSWORD]` with your database password

3. **Run Migrations**
   ```bash
   # Set DATABASE_URL in environment
   export DATABASE_URL="postgresql://..."

   # Run migrations
   pnpm run db:push
   ```

4. **Verify Tables**
   ```bash
   pnpm run db:studio
   ```

   Expected tables:
   - `users`
   - `petitions`
   - `user_consents`

---

## 4. Pre-Deploy Verification Checklist

### Phase 1: Code Quality ✓

- [ ] TypeScript compilation passes: `pnpm run check`
- [ ] All tests pass: `pnpm test`
- [ ] No security vulnerabilities: `pnpm audit --audit-level=moderate`
- [ ] Production build succeeds: `pnpm run build:production`

### Phase 2: Configuration ✓

- [ ] All GitHub secrets configured
- [ ] Environment variables set in Railway
- [ ] Database migrations applied
- [ ] Sentry DSN configured (recommended)

### Phase 3: Security ✓

- [ ] `JWT_SECRET` is 32+ characters
- [ ] `ALLOWED_ORIGINS` set for production domain
- [ ] HTTPS enabled (Railway provides automatically)
- [ ] Rate limiting configured

### Phase 4: Monitoring ✓

- [ ] Health check endpoint verified: `/health`
- [ ] Sentry error tracking enabled
- [ ] Log aggregation configured (optional)

---

## 5. Deployment Commands

### Deploy to Staging

```bash
# Option 1: Push to main branch (automatic)
git push origin main

# Option 2: Manual trigger
# GitHub Actions > Workflows > Deploy > Run workflow > Select "staging"
```

### Deploy to Production

```bash
# Option 1: Create release (automatic)
git tag v1.0.0
git push origin v1.0.0

# Option 2: Manual trigger
# GitHub Actions > Workflows > Deploy > Run workflow > Select "production"
```

---

## 6. Post-Deploy Verification

### Health Check

```bash
# Staging
curl https://staging.lexintel.app/health

# Production
curl https://lexintel.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-04T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### Smoke Tests

1. **Authentication**
   - [ ] Login via Manus OAuth works
   - [ ] Session persists after page refresh
   - [ ] Logout clears session

2. **Core Features**
   - [ ] Create new petition
   - [ ] Edit petition content
   - [ ] Save petition (draft)
   - [ ] Export to PDF
   - [ ] Export to DOCX

3. **Security**
   - [ ] Rate limiting triggers after excessive requests
   - [ ] CSRF protection active
   - [ ] Security headers present (check with [securityheaders.com](https://securityheaders.com))

---

## 7. Rollback Procedure

### Railway Rollback

1. Go to Railway Dashboard > Project > Deployments
2. Find the previous successful deployment
3. Click **Rollback to this deployment**

### Manual Rollback

```bash
# Find previous working commit
git log --oneline -10

# Revert to previous commit
git revert HEAD
git push origin main
```

---

## 8. Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Deploy fails with "No RAILWAY_TOKEN" | Secret not configured | Add RAILWAY_TOKEN to GitHub Secrets |
| Health check fails | App not starting | Check Railway logs for errors |
| Database connection error | Wrong DATABASE_URL | Verify Supabase connection string |
| OAuth fails | Wrong OAUTH_SERVER_URL | Verify Manus OAuth configuration |
| 403 on API requests | CORS misconfigured | Add domain to ALLOWED_ORIGINS |

### Viewing Logs

```bash
# Railway CLI
railway logs

# Or in Railway Dashboard
# Project > Service > Logs
```

---

## 9. Contact & Support

- **Repository Issues**: [GitHub Issues](https://github.com/fbmoulin/lex-intel-visual-design/issues)
- **Security Issues**: Report privately via GitHub Security Advisories
- **Documentation**: See `docs/` folder for detailed guides

---

**Last Updated**: December 2025
**Version**: 1.0.0-beta
