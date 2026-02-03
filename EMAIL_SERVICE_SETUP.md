# Email Service Setup Guide

## Phase 3 Implementation Complete ✅

All email verification and password reset functionality has been implemented! Here's what was done and what you need to configure.

---

## What Was Implemented

### 1. Database Changes
- **EmailVerificationToken** model (24-hour validity tokens)
- **PasswordResetToken** model (1-hour validity, single-use)
- **emailVerified** field on User model (default: false for new users)
- Existing users automatically set to verified (migration included)

### 2. Email Verification Flow
- ✅ New users register with `emailVerified: false`
- ✅ Verification email sent automatically after registration
- ✅ Users cannot log in until email is verified (STRICT VERIFICATION)
- ✅ Verification links valid for 24 hours
- ✅ Resend verification email option on login page
- ✅ Success messages and proper redirects

### 3. Password Reset Flow
- ✅ "Forgot Password?" link on login page
- ✅ Request password reset via email
- ✅ Reset links valid for 1 hour
- ✅ Single-use links (expires after first use)
- ✅ Rate limiting: Max 3 requests per hour per email
- ✅ Password change confirmation email
- ✅ Proper error handling and user feedback

### 4. New Pages Created
- `/verify-email` - Email verification page
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with token

### 5. Updated Pages
- `/login` - Shows verification status, forgot password link, resend verification option
- `/register` - Sends verification email after successful registration

---

## Email Service Configuration

### Files to Configure

The email service is fully abstracted in `/lib/email.ts`. You have two options:

### Option 1: SMTP (Recommended for DigitalOcean)

**Most Compatible Option** - Works with almost any email provider

1. **Add nodemailer package:**
   ```bash
   npm install nodemailer
   npm install --save-dev @types/nodemailer
   ```

2. **Add these environment variables to your `.env` file:**

   ```env
   # Email Configuration
   EMAIL_FROM="noreply@companyfinder.al"
   EMAIL_FROM_NAME="CompanyFinder Albania"
   APP_URL="https://companyfinder.al"  # Or http://localhost:3000 for dev

   # SMTP Configuration
   SMTP_HOST="smtp.yourmailprovider.com"
   SMTP_PORT="587"
   SMTP_USER="your-smtp-username"
   SMTP_PASSWORD="your-smtp-password"
   SMTP_SECURE="false"  # true for port 465, false for other ports
   ```

### Option 2: API-Based Provider (SendGrid, Mailgun, etc.)

If you prefer an API-based service, uncomment the API section in `/lib/email.ts` (lines 75-95) and add:

```env
EMAIL_API_KEY="your-api-key"
EMAIL_API_URL="https://api.provider.com/send"
```

---

## DigitalOcean Email Setup Options

### Option A: DigitalOcean Managed Email (If Available)
1. Go to DigitalOcean Dashboard → Networking → Email
2. Set up your email domain
3. Get SMTP credentials
4. Add credentials to `.env` file

### Option B: Third-Party SMTP (Recommended)

Popular options that work well:
1. **SendGrid** - Free tier: 100 emails/day
2. **Mailgun** - Free tier: 5,000 emails/month
3. **Amazon SES** - Very affordable
4. **Brevo (formerly Sendinblue)** - Free tier: 300 emails/day

### Option C: Google Workspace SMTP
If you have Google Workspace for your domain:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@companyfinder.al"
SMTP_PASSWORD="your-app-password"  # Use app password, not account password
SMTP_SECURE="false"
```

---

## Development vs Production

### Development Mode
- Emails are **logged to console** instead of sent
- No email provider needed
- Perfect for testing the flow

### Production Mode
- Emails are actually sent via your configured provider
- Make sure to set `NODE_ENV=production` in your production environment

---

## Testing the Implementation

### 1. Test Email Verification Flow

```bash
# 1. Register a new user at /register
# 2. Check console (dev) or inbox (prod) for verification email
# 3. Click verification link
# 4. Try to log in - should work after verification
# 5. Try to log in before verification - should be blocked
```

### 2. Test Password Reset Flow

```bash
# 1. Go to /login
# 2. Click "Forgot password?"
# 3. Enter email address
# 4. Check console (dev) or inbox (prod) for reset email
# 5. Click reset link
# 6. Enter new password
# 7. Log in with new password
```

### 3. Test Resend Verification

```bash
# 1. Try to log in with unverified account
# 2. Should see error about email verification
# 3. Click "Resend verification email" button
# 4. Check for new verification email
```

---

## Email Templates

All email templates are in `/lib/email.ts` and include:

1. **Welcome Email** (Email Verification)
   - Professional design with company branding
   - Clear call-to-action button
   - 24-hour expiry notice
   - Fallback link for email clients without button support

2. **Password Reset Email**
   - Security-focused design (red theme)
   - Warning about 1-hour expiry
   - Clear instructions
   - Security tips

3. **Password Changed Email**
   - Confirmation of password change
   - Warning if user didn't make the change
   - Contact support information

---

## Security Features Implemented

✅ **Email Verification**
- Strict verification before login
- 24-hour token expiry
- Tokens deleted after use

✅ **Password Reset**
- 1-hour token expiry
- Single-use tokens
- Rate limiting (3 requests/hour)
- All tokens invalidated after successful reset
- Confirmation email after password change

✅ **Privacy**
- Doesn't reveal if email exists (security best practice)
- Tokens are cryptographically secure (32 random bytes)
- Proper error messages without leaking information

---

## Migration Instructions

### For Existing Database

Run these migrations in order:

```bash
# 1. Apply the email verification and password reset tables
npx prisma migrate deploy

# 2. Set existing users as verified (grandfather existing accounts)
# This is already in the migration files
```

### For Fresh Database

```bash
# Simply run
npx prisma migrate reset
```

All existing users will be automatically set to `emailVerified: true`.

---

## Troubleshooting

### Emails not sending in development?
✅ **This is normal!** Emails are logged to console in development mode.
Check your terminal/console for the email content.

### Emails not sending in production?
1. Check environment variables are set correctly
2. Verify SMTP credentials are correct
3. Check if your email provider requires domain verification
4. Look for error messages in your application logs

### "Invalid credentials" error on login?
- Make sure user has verified their email
- Check the auth.ts file is checking emailVerified
- Verify the user exists in database with correct email

### Password reset link expired?
- Links expire after 1 hour
- User needs to request a new reset link
- This is intentional for security

### Verification link expired?
- Links expire after 24 hours
- User can request a new one from login page
- Click "Resend verification email"

---

## Next Steps

1. ✅ Choose your email provider (SMTP recommended)
2. ✅ Get SMTP credentials from your provider
3. ✅ Add credentials to `.env` file
4. ✅ Install nodemailer: `npm install nodemailer`
5. ✅ Test in development (emails will log to console)
6. ✅ Test in production with real emails
7. ✅ Consider customizing email templates with your branding

---

## Important Files Reference

- `/lib/email.ts` - Email service (configure here)
- `/lib/auth-actions.ts` - Auth actions with email functions
- `/auth.ts` - Login email verification check (line 45-50)
- `/app/verify-email/page.tsx` - Email verification page
- `/app/forgot-password/page.tsx` - Request password reset
- `/app/reset-password/page.tsx` - Reset password form
- `/app/login/page.tsx` - Login with verification messages
- `/components/auth/login-form.tsx` - Login form with resend verification

---

## Support

If you need help:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a real email account you have access to
4. Make sure nodemailer is installed if using SMTP

---

**Status:** ✅ Phase 3 Complete - All code implemented and ready for configuration
**Next:** Add your SMTP credentials and test!
