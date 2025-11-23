# Fix: Corporate Company Email CC Not Sending

## Issue

When a user books using a corporate account, the email was being sent with CC to `putubaguswidia@outlook.com` but **not** to the company email.

## Root Cause

In `/src/app/api/corporate-mobility/booking/create/route.ts`, we were trying to access `payload.company_email`, but the JWT token stores the company email as just `payload.email`.

### JWT Token Structure

```typescript
const token = await generateToken({
  id: corporateAccount.company_id,
  email: corporateAccount.company_email, // ← Stored as "email"
  role: "corporate",
  corporate_reference: corporateAccount.corporate_reference,
  company_name: corporateAccount.company_name,
});
```

## Fix Applied

### Before (❌ Incorrect)

```typescript
companyEmail: payload.company_email || "",  // ❌ Wrong property name
```

### After (✅ Correct)

```typescript
companyEmail: payload.email || "",  // ✅ Correct property name
```

## Files Modified

1. **`/src/app/api/corporate-mobility/booking/create/route.ts`**
   - Changed `payload.company_email` to `payload.email`
   - Added debug logging for corporate account info

2. **`/src/utils/email.ts`**
   - Added debug logging for CC list construction
   - Shows when company email is added to CC
   - Displays final CC list

## Testing

### Test 1: Check Logs After Corporate Booking

After completing a corporate booking, check the server logs:

```
📧 Preparing to send corporate invoice email
📧 Corporate account info: {
  companyName: 'Acme Corporation',
  companyEmail: 'billing@acme.com',  ← Should show the company email
  referenceCode: 'CORP-2025-001'
}

📧 Is corporate booking: true
📧 Company email: billing@acme.com  ← Should be present
📧 Adding company email to CC: billing@acme.com  ← Should appear
📧 Final CC list: ['putubaguswidia@outlook.com', 'billing@acme.com']  ← Both emails
```

### Test 2: Complete Corporate Booking Through UI

1. **Login to Corporate Portal:**

   ```
   http://localhost:3000/corporate-mobility/login
   ```

2. **Make a Booking:**
   - Fill in all booking details
   - Complete the booking

3. **Check Email Inboxes:**
   - ✅ Customer email should receive invoice
   - ✅ `putubaguswidia@outlook.com` should receive CC
   - ✅ Company email (from corporate account) should receive CC

### Test 3: Verify Email Headers

Check the email headers to confirm CC recipients:

**Expected Headers:**

```
To: customer@example.com
Cc: putubaguswidia@outlook.com, billing@acme.com
From: JoLimo - Jordan Limousine Services <tech@jo-limo.com>
Subject: Your JoLimo Booking Confirmation - Invoice AT12345678
```

### Test 4: Test with Different Corporate Accounts

Create bookings with different corporate accounts to ensure each company's email receives CC:

| Company Name   | Company Email      | Expected CC       |
| -------------- | ------------------ | ----------------- |
| Acme Corp      | billing@acme.com   | ✅ Should receive |
| Tech Solutions | accounts@tech.com  | ✅ Should receive |
| Global Inc     | finance@global.com | ✅ Should receive |

## Verification Checklist

✅ Server logs show correct company email from JWT
✅ Server logs show company email being added to CC list
✅ Server logs show final CC list with both emails
✅ Customer receives email
✅ `putubaguswidia@outlook.com` receives CC
✅ Company email receives CC
✅ Email headers show both CC recipients
✅ Works for all corporate accounts

## Debug Commands

### Check JWT Token Payload

If emails still aren't being sent, add this logging in the booking create route:

```typescript
console.log("🔍 Full JWT payload:", payload);
console.log("🔍 Available properties:", Object.keys(payload));
```

Expected output:

```
🔍 Full JWT payload: {
  id: 'company-uuid',
  email: 'billing@acme.com',
  role: 'corporate',
  corporate_reference: 'CORP-2025-001',
  company_name: 'Acme Corporation'
}
🔍 Available properties: ['id', 'email', 'role', 'corporate_reference', 'company_name']
```

### Check Email Data Sent to API

Add this in the booking create route before calling the invoice API:

```typescript
console.log(
  "🔍 Data being sent to invoice API:",
  JSON.stringify(
    {
      customerEmail: body.email,
      companyName: payload.company_name,
      companyEmail: payload.email,
      paymentMethod: "corporate",
    },
    null,
    2
  )
);
```

### Check SendGrid Response

If CC still doesn't work, check SendGrid logs at:
https://app.sendgrid.com/email_activity

Filter by:

- Recipient: Company email
- Status: All
- Date: Last 24 hours

## Common Issues & Solutions

### Issue: Company email is undefined

**Solution:** Verify the corporate account has `company_email` in the database:

```sql
SELECT company_id, company_name, company_email
FROM corporateaccounts
WHERE company_id = 'your-company-id';
```

### Issue: CC not visible in email client

**Solution:** Some email clients hide CC from the main view. Check:

- Gmail: Click "Show details" in the email
- Outlook: Look in message properties
- Apple Mail: View > Message > All Headers

### Issue: Email goes to spam

**Solution:**

- Check SendGrid sender authentication
- Verify SPF, DKIM, DMARC records
- Ask company to whitelist tech@jo-limo.com

## Success Criteria

The fix is successful when:

✅ Corporate bookings send email to 3 recipients:

1.  Customer email (To)
2.  putubaguswidia@outlook.com (CC)
3.  Company email from corporate account (CC)

✅ General bookings send email to 2 recipients:

1.  Customer email (To)
2.  putubaguswidia@outlook.com (CC)

✅ Logs clearly show CC list construction

✅ No errors in SendGrid delivery logs

## Rollback

If this fix causes issues, revert with:

```typescript
// Revert to original (incorrect but known state)
companyEmail: payload.company_email || "",
```

Then investigate JWT token structure further.

## Next Steps

1. ✅ Deploy the fix
2. ✅ Test with a real corporate booking
3. ✅ Monitor SendGrid delivery logs
4. ✅ Confirm with a test company they received the CC
5. ✅ Document the correct JWT property names

## Related Files

- JWT Token Generation: `/src/app/api/corporate-mobility/auth/login/route.ts`
- JWT Token Verification: `/src/utils/jwt.ts`
- Corporate Booking Creation: `/src/app/api/corporate-mobility/booking/create/route.ts`
- Email Sending: `/src/utils/email.ts`
- Invoice API: `/src/app/api/send-invoice/route.ts`
