# DigitalOcean Email Setup Guide (2025)

## Critical Information About DigitalOcean & Email

⚠️ **IMPORTANT**: DigitalOcean does NOT provide email sending services. You need to use a third-party provider.

### Why DigitalOcean Doesn't Work for Direct Email

1. **SMTP Ports Blocked**: DigitalOcean blocks outbound traffic on ports 25, 465, and 587 on all Droplets by default
2. **Anti-Spam Policy**: This is to prevent spam and abuse
3. **No Native Service**: Unlike AWS (SES) or Google Cloud (SendGrid integration), DigitalOcean doesn't have email infrastructure

---

## ✅ RECOMMENDED SOLUTIONS FOR 2025

### Option 1: Resend (BEST for 2025 - Modern & Simple)

**Why Resend?**
- ✅ Built specifically for developers
- ✅ Modern API, very easy to use
- ✅ Free tier: 3,000 emails/month (100/day)
- ✅ Excellent deliverability
- ✅ React email templates support
- ✅ Built-in email testing

**Pricing:**
- Free: 3,000 emails/month
- Pro: $20/month - 50,000 emails

**Setup Steps:**

1. **Sign up at [Resend.com](https://resend.com)**

2. **Verify your domain:**
   - Add DNS records to your domain (MX, TXT, CNAME)
   - This ensures emails come from your domain (noreply@companyfinder.al)

3. **Get your API key:**
   - Dashboard → API Keys → Create API Key

4. **Install package:**
   ```bash
   npm install resend
   ```

5. **Update `.env`:**
   ```env
   EMAIL_PROVIDER="resend"
   RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
   EMAIL_FROM="noreply@companyfinder.al"
   EMAIL_FROM_NAME="CompanyFinder Albania"
   APP_URL="https://companyfinder.al"
   ```

6. **Update `/lib/email.ts`:**
   ```typescript
   // Add this at the top
   import { Resend } from 'resend'

   // In sendEmail function, add this BEFORE the SMTP section:
   if (process.env.RESEND_API_KEY) {
     const resend = new Resend(process.env.RESEND_API_KEY)

     await resend.emails.send({
       from: `${emailFromName} <${emailFrom}>`,
       to,
       subject,
       html,
     })

     console.log(`✅ Email sent to ${to}: ${subject}`)
     return { success: true }
   }
   ```

---

### Option 2: Mailgun (EXCELLENT Choice)

**Why Mailgun?**
- ✅ Industry standard, very reliable
- ✅ Free tier: 5,000 emails/month for 3 months, then pay-as-you-go
- ✅ Excellent deliverability
- ✅ Advanced features (analytics, tracking)

**Pricing:**
- Free trial: 5,000 emails/month for 3 months
- Pay-as-you-go: $0.80 per 1,000 emails

**Setup Steps:**

1. **Sign up at [Mailgun.com](https://www.mailgun.com)**

2. **Verify your domain:**
   - Add DNS records (they give you exact instructions)

3. **Get SMTP credentials:**
   - Mailgun Dashboard → Sending → Domain Settings → SMTP credentials

4. **Add to `.env`:**
   ```env
   SMTP_HOST="smtp.mailgun.org"
   SMTP_PORT="587"
   SMTP_USER="postmaster@mg.companyfinder.al"
   SMTP_PASSWORD="your-mailgun-password"
   SMTP_SECURE="false"
   EMAIL_FROM="noreply@companyfinder.al"
   EMAIL_FROM_NAME="CompanyFinder Albania"
   APP_URL="https://companyfinder.al"
   ```

5. **Install nodemailer:**
   ```bash
   npm install nodemailer
   npm install --save-dev @types/nodemailer
   ```

---

### Option 3: SendGrid (Popular Choice)

**Why SendGrid?**
- ✅ Very popular, well-documented
- ✅ Free tier: 100 emails/day forever
- ✅ Good deliverability
- ✅ Owned by Twilio (reliable)

**Pricing:**
- Free: 100 emails/day (3,000/month)
- Essentials: $15/month - 50,000 emails

**Setup Steps:**

1. **Sign up at [SendGrid.com](https://sendgrid.com)**

2. **Verify sender identity:**
   - Settings → Sender Authentication → Verify a domain

3. **Create API Key:**
   - Settings → API Keys → Create API Key

4. **Install SendGrid SDK:**
   ```bash
   npm install @sendgrid/mail
   ```

5. **Add to `.env`:**
   ```env
   SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxxx"
   EMAIL_FROM="noreply@companyfinder.al"
   EMAIL_FROM_NAME="CompanyFinder Albania"
   APP_URL="https://companyfinder.al"
   ```

6. **Update `/lib/email.ts`:**
   ```typescript
   // Add at top
   import sgMail from '@sendgrid/mail'

   // In sendEmail function, add BEFORE SMTP section:
   if (process.env.SENDGRID_API_KEY) {
     sgMail.setApiKey(process.env.SENDGRID_API_KEY)

     await sgMail.send({
       from: { email: emailFrom, name: emailFromName },
       to,
       subject,
       html,
     })

     console.log(`✅ Email sent to ${to}: ${subject}`)
     return { success: true }
   }
   ```

---

### Option 4: Brevo (formerly Sendinblue)

**Why Brevo?**
- ✅ Generous free tier: 300 emails/day
- ✅ All-in-one marketing platform
- ✅ Good for European compliance (GDPR)

**Pricing:**
- Free: 300 emails/day (9,000/month)
- Starter: €25/month - 20,000 emails

**Setup Steps:**

1. **Sign up at [Brevo.com](https://www.brevo.com)**

2. **Verify domain**

3. **Get SMTP credentials:**
   - SMTP & API → SMTP Settings

4. **Add to `.env`:**
   ```env
   SMTP_HOST="smtp-relay.brevo.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@example.com"
   SMTP_PASSWORD="your-brevo-smtp-key"
   SMTP_SECURE="false"
   EMAIL_FROM="noreply@companyfinder.al"
   EMAIL_FROM_NAME="CompanyFinder Albania"
   APP_URL="https://companyfinder.al"
   ```

---

### Option 5: Amazon SES (Most Affordable at Scale)

**Why Amazon SES?**
- ✅ Extremely cheap: $0.10 per 1,000 emails
- ✅ Highly reliable
- ✅ Integrated with AWS ecosystem

**Pricing:**
- $0.10 per 1,000 emails (one of the cheapest)
- Free tier: 62,000 emails/month if hosted on AWS

**Setup Steps:**

1. **Sign up for AWS**

2. **Verify domain in SES**

3. **Create SMTP credentials**

4. **Add to `.env`:**
   ```env
   SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
   SMTP_PORT="587"
   SMTP_USER="your-aws-smtp-username"
   SMTP_PASSWORD="your-aws-smtp-password"
   SMTP_SECURE="false"
   EMAIL_FROM="noreply@companyfinder.al"
   EMAIL_FROM_NAME="CompanyFinder Albania"
   APP_URL="https://companyfinder.al"
   ```

**Note:** AWS SES starts in sandbox mode - you need to request production access.

---

## 📊 Comparison Table (2025)

| Provider | Free Tier | Cost (10k emails) | Best For | Ease of Setup |
|----------|-----------|-------------------|----------|---------------|
| **Resend** | 3,000/month | Free | Developers, modern apps | ⭐⭐⭐⭐⭐ |
| **Mailgun** | 5,000/3mo | $0.80 | Reliability, features | ⭐⭐⭐⭐ |
| **SendGrid** | 3,000/month | $15/month | Popular, documented | ⭐⭐⭐⭐ |
| **Brevo** | 9,000/month | Free | Marketing + email | ⭐⭐⭐⭐ |
| **Amazon SES** | 62k/month* | $0.10 | Scale, low cost | ⭐⭐⭐ |

*Free tier only if using AWS EC2/ECS

---

## 🎯 MY RECOMMENDATION FOR YOU

### For CompanyFinder Albania, I recommend **Resend** or **Mailgun**

**Choose Resend if:**
- ✅ You want the easiest setup
- ✅ You prefer modern, developer-friendly tools
- ✅ 3,000 emails/month is enough to start
- ✅ You might scale later

**Choose Mailgun if:**
- ✅ You want more free emails to start (5,000/month)
- ✅ You need advanced email features
- ✅ You want proven reliability
- ✅ You're okay with slightly more complex setup

---

## 🚀 QUICKSTART: Resend Setup (Recommended)

### Step 1: Sign up and verify domain

```bash
# 1. Go to https://resend.com
# 2. Sign up
# 3. Add your domain: companyfinder.al
# 4. Add DNS records they provide
```

### Step 2: Install package

```bash
npm install resend
```

### Step 3: Get API Key

- Dashboard → API Keys → Create
- Copy the key (starts with `re_`)

### Step 4: Update .env

```env
RESEND_API_KEY="re_your_key_here"
EMAIL_FROM="noreply@companyfinder.al"
EMAIL_FROM_NAME="CompanyFinder Albania"
APP_URL="http://localhost:3000"  # Change to your domain in production
```

### Step 5: Update /lib/email.ts

Add at the very top of the file:

```typescript
import { Resend } from 'resend'
```

Then update the `sendEmail` function - add this section RIGHT AFTER the configuration lines and BEFORE the SMTP section:

```typescript
async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const { to, subject, html, text } = options
  const emailFrom = process.env.EMAIL_FROM || "noreply@companyfinder.al"
  const emailFromName = process.env.EMAIL_FROM_NAME || "CompanyFinder Albania"

  try {
    // ========================================================================
    // RESEND (Modern API-based provider) - RECOMMENDED
    // ========================================================================
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)

      const result = await resend.emails.send({
        from: `${emailFromName} <${emailFrom}>`,
        to,
        subject,
        html,
      })

      console.log(`✅ Email sent via Resend to ${to}: ${subject}`)
      return { success: true }
    }

    // Rest of the SMTP code stays below...
```

### Step 6: Test!

```bash
# Run your app
npm run dev

# Register a new user
# Check console for email output (in development)
# In production, check your inbox!
```

---

## 🔧 Domain Verification (Required for All Providers)

All email providers require you to verify your domain. This involves:

1. **Adding DNS Records** to your domain registrar:
   - **MX Records**: For receiving emails
   - **TXT Records (SPF)**: Proves you authorize sending
   - **TXT Records (DKIM)**: Cryptographic signature
   - **CNAME Records**: For tracking/authentication

2. **Why this matters:**
   - ✅ Emails won't go to spam
   - ✅ Better deliverability
   - ✅ Professional appearance
   - ✅ Required by all providers

3. **How to do it:**
   - Your email provider will give you exact DNS records
   - Log into your domain registrar (where you bought companyfinder.al)
   - Add the DNS records
   - Wait 24-48 hours for propagation
   - Verify in provider dashboard

---

## 📝 Testing Before Going Live

### Development Testing (No Email Provider Needed)

Your code already handles this! Just don't set any email environment variables:

```bash
# Don't set RESEND_API_KEY, SMTP_HOST, etc.
# Emails will log to console
npm run dev
```

### Production Testing

1. **Use a test email first:**
   - Register with your personal email
   - Verify it works end-to-end

2. **Check spam folder:**
   - Sometimes first emails go to spam
   - After domain verification, this stops

3. **Test all flows:**
   - Registration → Email verification
   - Forgot password → Reset email
   - Password changed → Confirmation email

---

## 💰 Cost Estimation for Your App

Let's estimate for CompanyFinder:

**Assumptions:**
- 50 new users/month = 50 verification emails
- 10 password resets/month = 10 reset emails
- Total: ~60 emails/month to start

**Best Options:**
1. **Resend**: FREE (3,000/month limit)
2. **Brevo**: FREE (9,000/month limit)
3. **Mailgun**: FREE for first 3 months (5,000/month)
4. **SendGrid**: FREE (100/day limit)

**When you scale to 1,000 users/month:**
- ~1,000 emails/month
- Still FREE on most providers!

**At 10,000+ emails/month:**
- **Resend**: $20/month (50k emails)
- **Mailgun**: ~$8/month
- **SendGrid**: $15/month
- **Amazon SES**: $1/month

---

## ⚠️ Common Mistakes to Avoid

1. **Not verifying domain**: Emails will go to spam
2. **Using personal email**: Use professional domain email
3. **Forgetting APP_URL**: Links in emails will break
4. **Not testing in production**: Always test with real emails
5. **Ignoring rate limits**: Respect free tier limits

---

## 🎓 Summary

**What you need to do RIGHT NOW:**

1. ✅ Choose a provider (I recommend **Resend**)
2. ✅ Sign up and verify your domain
3. ✅ Install the package: `npm install resend`
4. ✅ Get API key or SMTP credentials
5. ✅ Add to `.env` file
6. ✅ Update `/lib/email.ts` with provider code
7. ✅ Test in development (console logs)
8. ✅ Test in production (real emails)

**Total setup time:** 15-30 minutes

**Cost:** FREE to start, pennies at scale

---

## 📞 Need Help?

If you get stuck:
1. Check provider documentation (all have excellent docs)
2. Verify DNS records are correct
3. Check console logs for errors
4. Test with a simple email first
5. Make sure environment variables are loaded

Let me know which provider you choose and I'll help you integrate it! 🚀
