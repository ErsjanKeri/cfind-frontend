# DigitalOcean Migration Guide

## Run Migrations on DigitalOcean App Platform

### Method 1: Using Console (Easiest)

1. Go to your app: https://cloud.digitalocean.com/apps/cfind
2. Click **"Console"** tab in the top navigation
3. Click **"Launch Console"** button
4. Wait for terminal to load
5. Run these commands:

```bash
# Navigate to your app directory
cd /workspace

# Run migrations
npx prisma migrate deploy

# Verify migrations
npx prisma migrate status
```

### Method 2: Add to Build Commands (Best for Production)

This ensures migrations run automatically on every deploy.

1. Go to your app: https://cloud.digitalocean.com/apps/cfind
2. Click **Settings** tab
3. Find your **"company-finder"** component
4. Click **"Edit"**
5. Scroll to **"Build Command"**
6. Update to:

```bash
npm run build && npx prisma migrate deploy
```

7. Click **"Save"**
8. Your app will redeploy automatically

### Method 3: Using doctl CLI (Advanced)

If you have DigitalOcean CLI installed:

```bash
# Get your app ID
doctl apps list

# Run command in your app
doctl apps exec <APP_ID> npx prisma migrate deploy
```

## What Migrations Will Run?

1. **Existing migrations** - Creates missing columns like `annual_revenue_eur`
2. **New rejection tracking migration** - Adds rejection fields we just created

## After Migration

Your app should work at:
- ✅ https://cfind-vgdms.ondigitalocean.app
- ✅ https://cfind.ai (once DNS is configured)
- ✅ https://www.cfind.ai (once DNS is configured)

## Troubleshooting

### If migration fails:
```bash
# Check current database state
npx prisma db pull

# Check migration status
npx prisma migrate status

# Reset if needed (DANGER: deletes data!)
npx prisma migrate reset
```

### If you see "Environment variables not loaded":
Make sure your DATABASE_URL is set in App Platform environment variables.
