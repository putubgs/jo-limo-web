# Quick Email Test

## Test if Email System Works

Run this command in your terminal to test if the email system is working:

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "PUT_YOUR_EMAIL_HERE@gmail.com",
    "pickupLocation": "Queen Alia International Airport",
    "dropoffLocation": "Amman City Center",
    "serviceClass": "Executive",
    "dateTime": "2024-11-24, 10:00 AM",
    "price": "50",
    "paymentMethod": "cash"
  }'
```

**Replace `PUT_YOUR_EMAIL_HERE@gmail.com` with your actual email address!**

## Expected Result

If working, you should see:

```json
{
  "success": true,
  "invoiceNumber": "AT12345678",
  "messageId": "..."
}
```

And you should receive an email within 1-2 minutes.

## If It Doesn't Work

### Error: "Missing required fields"

- Make sure you replaced the email address

### Error: "SENDGRID_API_KEY not found"

1. Create/edit `.env.local` file in project root
2. Add: `SENDGRID_API_KEY=your_sendgrid_key_here`
3. Restart server: Ctrl+C then `npm run dev`

### Error: Connection refused

- Make sure dev server is running: `npm run dev`
- Server should be on http://localhost:3000

## After Successful Test

If the curl command works, then the email system is fine. The issue is with the booking flow.

### Debug the Booking Flow

1. **Open browser console** (F12)
2. **Go through the booking process:**
   - Select service class
   - Fill pick-up info form (MUST include email!)
   - Go to payment page
   - Click "Pay Later (Cash/Card)"

3. **Watch for these messages in console:**

```
📧 About to call createBookingHistory with data: {...}
✅ Booking history created successfully with REAL DATA!
📧 Email should have been sent to: your-email@example.com
```

4. **Check server terminal for:**

```
📧 Attempting to send invoice email...
📧 Full reservation data: {...}
📧 Billing data: {...}
📧 Invoice API response status: 200
✅ Invoice sent successfully: {...}
```

### Common Issues

**Issue: "⚠️ Skipping invoice email - missing data"**

- Email field not filled in pick-up info form
- Check browser console to see what's missing

**Issue: No email logs at all**

- Booking might have failed
- Check for error messages in console/terminal

**Issue: Email logs appear but no email received**

- Check spam/junk folder
- Verify email address is correct
- Check SendGrid dashboard for delivery status

## Still Not Working?

Share these with me:

1. **Browser console output** (copy all messages)
2. **Server terminal output** (copy all messages)
3. **The email address you used**
4. **Which payment method you selected**

This will help me identify the exact issue!

---

**Quick Checklist:**

- [ ] Dev server running
- [ ] `.env.local` has `SENDGRID_API_KEY`
- [ ] Curl test successful
- [ ] Email field filled in form
- [ ] Checked browser console
- [ ] Checked server logs
- [ ] Checked spam folder
