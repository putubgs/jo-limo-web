# Email Sending Debug Guide

If emails are not being sent after completing a booking, follow these steps to debug the issue.

## Quick Checklist

- [ ] Check browser console for errors
- [ ] Check server logs (terminal where `npm run dev` is running)
- [ ] Verify SendGrid API key is set
- [ ] Verify all required fields are filled in the form
- [ ] Check that booking was created successfully

## Step-by-Step Debugging

### 1. Check Browser Console

Open browser DevTools (F12) and look for:

**Success Messages:**

```
📧 Attempting to send invoice email...
📧 Full reservation data: {...}
📧 Billing data: {...}
📧 Invoice API response status: 200
✅ Invoice sent successfully: {...}
```

**Error Messages:**

```
❌ Failed to send invoice: ...
❌ Error sending invoice: ...
⚠️ Skipping invoice email - missing data: {...}
```

### 2. Check Server Logs

In your terminal where the dev server is running, look for:

**Success Flow:**

```
📧 Invoice API called
📧 Request body: {...}
✅ All required fields present
📊 Total bookings: X Next booking number: XXXXX
📧 Sending invoice email to: customer@email.com
✅ PDF generated, size: XXXXX bytes
📧 Attempting to send email via SendGrid to: customer@email.com
✅ Invoice email sent successfully
```

**Common Errors:**

```
❌ SENDGRID_API_KEY not found in environment variables
❌ Missing required fields
❌ Failed to send invoice
```

### 3. Verify Environment Variables

Check your `.env.local` file has:

```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**To verify in terminal:**

```bash
# Check if .env.local exists
ls -la .env.local

# Check if SENDGRID_API_KEY is set (don't print the actual key)
grep SENDGRID_API_KEY .env.local
```

**Restart dev server after adding/changing env vars:**

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### 4. Test Email API Directly

Test if the email API works independently:

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "YOUR_EMAIL@example.com",
    "pickupLocation": "Queen Alia International Airport",
    "dropoffLocation": "Amman City Center",
    "serviceClass": "Executive",
    "dateTime": "2024-11-24, 10:00 AM",
    "price": "50",
    "paymentMethod": "credit/debit",
    "mobileNumber": "+962791234567",
    "flightNumber": "",
    "pickupSign": "",
    "specialRequirements": "",
    "distance": ""
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "invoiceNumber": "AT12345678",
  "messageId": "sendgrid-message-id"
}
```

**If you get an error:**

- Check the error message
- Verify SendGrid API key
- Check server logs for detailed error

### 5. Common Issues & Solutions

#### Issue: "Missing required fields"

**Cause:** Required data not being passed from form

**Solution:**

1. Check browser console for the data being sent
2. Verify all form fields are filled:
   - Customer name (first + last)
   - Customer email
   - Mobile number
   - Pickup location
   - Drop-off location
   - Service class
   - Date and time
   - Price

#### Issue: "SENDGRID_API_KEY not found"

**Cause:** Environment variable not set or server not restarted

**Solution:**

1. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=your_key_here
   ```
2. Restart dev server (Ctrl+C, then `npm run dev`)

#### Issue: "Failed to send invoice email: ENOENT"

**Cause:** Missing image files

**Solution:**
Check that all images exist in `public/images/`:

```bash
ls -la public/images/ | grep -E "(jolimo-email-logo|google-play-badge|app-store-badge|jolimo-app|facebook-icon|x-icon|instagram-icon|linkedin-icon)"
```

All these files should exist:

- jolimo-email-logo.png
- google-play-badge.png
- app-store-badge.png
- jolimo-app.png
- facebook-icon.png
- x-icon.png
- instagram-icon.png
- linkedin-icon.png

#### Issue: Email sends but goes to spam/junk

**Cause:** Email deliverability issues

**Solution:**
See `EMAIL_DELIVERABILITY.md` for:

- Domain authentication
- Microsoft SNDS registration
- Spam prevention measures

#### Issue: "Skipping invoice email - missing data"

**Cause:** Booking created but email data incomplete

**Check browser console for:**

```
⚠️ Skipping invoice email - missing data: {
  hasResultData: true/false,
  hasCustomerEmail: true/false
}
```

**Solution:**

1. If `hasResultData: false` - booking failed, check booking API
2. If `hasCustomerEmail: false` - email not captured in form

### 6. Verify Form Data Flow

The data flows through these steps:

1. **Service Class Page** → Select vehicle, price calculated
2. **Pick-up Info Page** → Enter customer details, mobile, flight, etc.
3. **Payment Page** → Select payment method, complete booking
4. **Booking Created** → Data saved to database
5. **Email Sent** → Invoice API called automatically

**Check each step:**

**After Service Class:**

```javascript
// Browser console
console.log(useReservationStore.getState().reservationData);
// Should show: selectedClass, selectedClassPrice
```

**After Pick-up Info:**

```javascript
// Browser console
console.log(useReservationStore.getState().reservationData);
// Should show: mobileNumber, flightNumber, pickupSign, notesForChauffeur, billingData
```

**After Payment:**

```javascript
// Server logs should show booking creation and email sending
```

### 7. Check Network Tab

In browser DevTools → Network tab:

1. Complete a booking
2. Look for request to `/api/send-invoice`
3. Check:
   - **Status:** Should be 200
   - **Response:** Should show `{"success": true, ...}`
   - **Request Payload:** Should contain all booking data

### 8. Test with Different Payment Methods

Try each payment method to see if one works:

1. **Credit/Debit Card** - Uses HyperPay
2. **Pay Later (Cash)** - Direct booking
3. **Corporate** - Different flow

If one works but others don't, the issue is specific to that payment flow.

### 9. Check SendGrid Dashboard

1. Go to https://app.sendgrid.com/
2. Navigate to Activity Feed
3. Look for recent email attempts
4. Check status:
   - **Delivered** ✅ - Email sent successfully
   - **Bounced** ❌ - Invalid email address
   - **Blocked** ❌ - Spam filter or blacklist
   - **Deferred** ⏳ - Temporary issue, will retry

### 10. Enable Detailed Logging

Temporarily add more logging to debug:

**In `src/lib/booking-history.ts`:**

```typescript
console.log("📧 About to send invoice...");
console.log("📧 Reservation data:", JSON.stringify(reservationData, null, 2));
console.log("📧 Billing data:", JSON.stringify(billingData, null, 2));
```

**In `src/app/api/send-invoice/route.ts`:**

```typescript
console.log("📧 Received request body:", JSON.stringify(body, null, 2));
```

## Quick Fix Checklist

If email is not sending, try these in order:

1. ✅ Restart dev server
2. ✅ Check `.env.local` has `SENDGRID_API_KEY`
3. ✅ Test email API with curl (see step 4 above)
4. ✅ Check browser console for errors
5. ✅ Check server logs for errors
6. ✅ Verify all form fields are filled
7. ✅ Try with a different email address
8. ✅ Check SendGrid dashboard for delivery status

## Still Not Working?

If you've tried everything above:

1. **Check SendGrid Account:**
   - Is it active?
   - Is it verified?
   - Are you within sending limits?

2. **Check Email Address:**
   - Is it valid?
   - Is it a real email you can access?
   - Try with a different email provider (Gmail, Outlook, etc.)

3. **Check Code Changes:**
   - Did you modify any email-related files?
   - Try reverting recent changes
   - Check git diff to see what changed

4. **Contact Support:**
   - SendGrid support: https://support.sendgrid.com/
   - Check SendGrid status: https://status.sendgrid.com/

## Success Indicators

You'll know email is working when you see:

✅ Browser console: "✅ Invoice sent successfully"
✅ Server logs: "✅ Invoice email sent successfully"
✅ SendGrid dashboard: Email shows as "Delivered"
✅ Inbox: Email received with PDF attachment

---

**Last Updated:** November 2024
