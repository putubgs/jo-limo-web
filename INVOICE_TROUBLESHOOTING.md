# Invoice System Troubleshooting Guide

## Issue: Emails Not Being Sent

If invoices are not being sent after booking completion, follow these debugging steps:

### Step 1: Check Environment Variables

Ensure `SENDGRID_API_KEY` is properly configured:

```bash
# Check if the variable exists in .env.local
cat .env.local | grep SENDGRID_API_KEY
```

**Required:**

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

If missing, add it to `.env.local` and restart the development server.

### Step 2: Check Browser Console Logs

After completing a booking, open the browser console (F12) and look for these logs:

**Expected logs:**

```
✅ Booking history created successfully with REAL DATA!
📧 Attempting to send invoice email...
Invoice data: { customerName: "...", customerEmail: "...", ... }
📧 Invoice API response status: 200
✅ Invoice sent successfully: { success: true, invoiceNumber: "...", ... }
```

**Problem indicators:**

```
⚠️ Skipping invoice email - missing data: { hasResultData: false, ... }
❌ Failed to send invoice: ...
❌ Error sending invoice: ...
```

### Step 3: Check Server Logs (Terminal)

Look at your Next.js development server terminal for these logs:

**Expected logs:**

```
📧 Invoice API called
📧 Request body: { ... }
✅ All required fields present
📧 sendInvoiceEmail called with data: { ... }
✅ SendGrid API key found
📧 Payment text: The amount has been...
📧 Attempting to send email via SendGrid to: customer@example.com
✅ Invoice email sent successfully via SendGrid: { messageId: "...", ... }
```

**Problem indicators:**

```
❌ SENDGRID_API_KEY not found in environment variables
❌ Missing required fields: ...
❌ Error sending invoice email: ...
```

### Step 4: Test the Invoice API Directly

Test the API endpoint independently:

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "your-email@example.com",
    "bookingId": 99999,
    "pickupLocation": "Queen Alia International Airport",
    "dropoffLocation": "Amman City Center",
    "serviceClass": "Executive",
    "dateTime": "2024-11-24, 10:00 AM",
    "price": "50",
    "paymentMethod": "credit/debit"
  }'
```

**Expected response:**

```json
{
  "success": true,
  "invoiceNumber": "AT1732446789123",
  "messageId": "xxxxxxxxxxxxx"
}
```

### Step 5: Verify SendGrid Configuration

1. **Check SendGrid Dashboard:**

   - Go to [SendGrid Dashboard](https://app.sendgrid.com/)
   - Check "Activity" to see if emails are being sent
   - Look for any delivery errors

2. **Verify Sender Email:**

   - Go to "Settings" > "Sender Authentication"
   - Ensure `tech@jo-limo.com` is verified
   - If not verified, complete sender verification

3. **Check API Key Permissions:**
   - Go to "Settings" > "API Keys"
   - Ensure your API key has "Mail Send" permission
   - If expired or revoked, create a new API key

### Step 6: Common Issues and Solutions

#### Issue: "SENDGRID_API_KEY not found"

**Solution:**

1. Add `SENDGRID_API_KEY` to `.env.local`
2. Restart Next.js development server
3. Verify the variable is loaded: `console.log(process.env.SENDGRID_API_KEY)` in API route

#### Issue: "Sender email not verified"

**Solution:**

1. Go to SendGrid Dashboard
2. Navigate to "Sender Authentication"
3. Verify `tech@jo-limo.com` as single sender
4. Or set up domain authentication for better deliverability

#### Issue: "Invoice API returning 400 - Missing required fields"

**Solution:**
Check that all required fields are being passed:

- `customerName`
- `customerEmail`
- `bookingId`
- `pickupLocation`
- `dropoffLocation`
- `serviceClass`
- `dateTime`
- `price`
- `paymentMethod`

#### Issue: "Emails sent but not received"

**Solution:**

1. Check spam/junk folder
2. Verify email address is correct
3. Check SendGrid activity for delivery status
4. Review bounce/complaint reports in SendGrid
5. Try sending to a different email address

#### Issue: "⚠️ Skipping invoice email - missing data"

**Solution:**
Check the browser console for what's missing:

```javascript
{
  hasResultData: false,  // Booking not created successfully
  hasCustomerEmail: false  // Email not provided in billing info
}
```

Ensure:

- Booking is created successfully before invoice sending
- Customer email is filled in the billing form

### Step 7: Manual Test Flow

1. **Complete a full booking:**

   - Go through reservation form
   - Fill in pick-up info with valid email
   - Complete payment (credit card or cash)

2. **Monitor console logs:**

   - Keep browser console open (F12)
   - Watch for invoice-related logs

3. **Check email:**
   - Wait 1-2 minutes
   - Check inbox and spam folder
   - Verify email content matches invoice design

### Step 8: Verify Booking Flow

Ensure the booking process is completing successfully:

1. **Check database:**

   - Verify booking is saved in `bookinghistory` table
   - Note the booking ID

2. **Verify invoice trigger:**
   - Invoice should be sent AFTER successful booking creation
   - Check if `result.data` exists in booking response

## Debug Checklist

- [ ] `SENDGRID_API_KEY` is set in `.env.local`
- [ ] Next.js server has been restarted after adding env variable
- [ ] SendGrid sender email (`tech@jo-limo.com`) is verified
- [ ] API key has "Mail Send" permission in SendGrid
- [ ] Booking is created successfully (check database)
- [ ] Customer email is provided in billing form
- [ ] Browser console shows invoice logs
- [ ] Server terminal shows SendGrid logs
- [ ] No errors in browser or server logs
- [ ] Checked spam/junk folder

## Testing Commands

### Test API Endpoint

```bash
# Replace YOUR_EMAIL with your actual email
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d "{
    \"customerName\": \"Test User\",
    \"customerEmail\": \"YOUR_EMAIL@example.com\",
    \"bookingId\": 99999,
    \"pickupLocation\": \"Queen Alia International Airport\",
    \"dropoffLocation\": \"Amman City Center\",
    \"serviceClass\": \"Executive\",
    \"dateTime\": \"2024-11-24, 10:00 AM\",
    \"price\": \"50\",
    \"paymentMethod\": \"credit/debit\"
  }"
```

### Check Logs in Real-time

```bash
# In your Next.js terminal, filter for invoice logs
# Look for 📧, ✅, and ❌ emoji indicators
```

## Production Deployment Notes

When deploying to production:

1. **Set environment variable in hosting platform:**

   - Vercel: Add `SENDGRID_API_KEY` in project settings
   - Other platforms: Use their environment variable configuration

2. **Verify sender domain:**

   - Use domain authentication instead of single sender
   - Better deliverability and reputation

3. **Monitor email delivery:**

   - Set up SendGrid webhooks for delivery notifications
   - Track bounce rates and complaints
   - Review SendGrid analytics regularly

4. **Rate limiting:**
   - Be aware of SendGrid's sending limits
   - Free tier: 100 emails/day
   - Paid plans: Higher limits

## Support

If issues persist after following this guide:

1. Check SendGrid status page: [status.sendgrid.com](https://status.sendgrid.com/)
2. Review SendGrid documentation: [docs.sendgrid.com](https://docs.sendgrid.com/)
3. Contact SendGrid support if issue is on their end
4. Review application logs for any other errors

## Quick Fixes

### Fix 1: Restart Everything

```bash
# Stop the dev server (Ctrl+C)
# Clear Next.js cache
rm -rf .next
# Restart
npm run dev
```

### Fix 2: Verify SendGrid in Code

Add to `/api/send-invoice/route.ts` temporarily:

```typescript
console.log("SendGrid Key exists:", !!process.env.SENDGRID_API_KEY);
console.log("Key starts with:", process.env.SENDGRID_API_KEY?.substring(0, 10));
```

### Fix 3: Test SendGrid Connection

Create `/api/test-sendgrid/route.ts`:

```typescript
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

export async function GET() {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

    const msg = {
      to: "your-email@example.com",
      from: "tech@jo-limo.com",
      subject: "SendGrid Test",
      text: "This is a test email",
    };

    await sgMail.send(msg);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
```

Access: `http://localhost:3000/api/test-sendgrid`
