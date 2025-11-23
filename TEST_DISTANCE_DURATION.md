# Test Distance/Duration Feature

## Quick Test with cURL

### Test 1: One-Way Booking (should show "Distance")

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "putubaguswidia@gmail.com",
    "pickupLocation": "Queen Alia International Airport, Airport Road, Jordan",
    "dropoffLocation": "Amman City Center",
    "serviceClass": "Executive",
    "dateTime": "2024-11-24, 10:00 AM",
    "price": "50",
    "paymentMethod": "credit/debit",
    "bookingType": "one-way",
    "distance": "ca. 35 km"
  }'
```

**Expected Email:**

```
Distance: ca. 35 km
```

### Test 2: By-Hour Booking (should show "Duration")

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "putubaguswidia@gmail.com",
    "pickupLocation": "Dead Sea Marriott Resort & Spa",
    "dropoffLocation": "Round trip",
    "serviceClass": "Luxury",
    "dateTime": "2024-11-24, 14:00 PM",
    "price": "120",
    "paymentMethod": "cash",
    "bookingType": "by-hour",
    "distance": "4 Hours"
  }'
```

**Expected Email:**

```
Duration: 4 Hours
```

### Test 3: Missing Distance (should show "N/A")

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "putubaguswidia@gmail.com",
    "pickupLocation": "Aqaba International Airport",
    "dropoffLocation": "Petra",
    "serviceClass": "SUV",
    "dateTime": "2024-11-25, 09:00 AM",
    "price": "80",
    "paymentMethod": "corporate",
    "bookingType": "one-way"
  }'
```

**Expected Email:**

```
Distance: N/A
```

### Test 4: Default Fallback (no bookingType)

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "putubaguswidia@gmail.com",
    "pickupLocation": "Amman Downtown",
    "dropoffLocation": "Dead Sea",
    "serviceClass": "MPV",
    "dateTime": "2024-11-26, 11:00 AM",
    "price": "65",
    "paymentMethod": "credit/debit",
    "distance": "ca. 60 km"
  }'
```

**Expected Email:**

```
Distance: ca. 60 km
(defaults to "one-way" when bookingType is missing)
```

## Full End-to-End Testing

### Test One-Way Booking Flow

1. **Start Development Server:**

   ```bash
   npm run dev
   ```

2. **Navigate to Reserve Page:**
   - Go to http://localhost:3000
   - Click "Reserve Now"

3. **Fill Booking Form:**
   - Select "One Way"
   - Pickup: Queen Alia International Airport
   - Dropoff: Amman City Center
   - Select tomorrow's date
   - Select time (at least 1 hour from now in Jordan time)

4. **Select Service Class:**
   - Choose any service (Executive, Luxury, MPV, or SUV)
   - Click "Continue"

5. **Fill Pick-up Info:**
   - Enter your details:
     - Email: putubaguswidia@gmail.com (or your test email)
     - First Name: Test
     - Last Name: User
     - Phone: +962 123456789
   - Click "Continue"

6. **Payment & Checkout:**
   - Select "Pay Later" (easier for testing)
   - Complete the booking

7. **Check Email:**
   - Open your email
   - Find the invoice
   - Verify it shows: `Distance: ca. XX km`

8. **Check Console Logs:**
   Look for:
   ```
   📏 Saving distance/duration: {
     type: 'one-way',
     value: 'ca. 35 km',
     distanceInfo: { distance: 'ca. 35 km', duration: '...' }
   }
   ```

### Test By-Hour Booking Flow

1. **Navigate to Reserve Page**

2. **Fill Booking Form:**
   - Select "By The Hour"
   - Pickup: Dead Sea Marriott Resort & Spa
   - Duration: 4 Hours
   - Select tomorrow's date
   - Select time (at least 1 hour from now)

3. **Select Service Class:**
   - Choose any service
   - Click "Continue"

4. **Fill Pick-up Info & Complete Booking**

5. **Check Email:**
   - Verify it shows: `Duration: 4 Hours`

6. **Check Console Logs:**
   Look for:
   ```
   📏 Saving distance/duration: {
     type: 'by-hour',
     value: '4 Hours',
     distanceInfo: { ... }
   }
   ```

### Test Corporate Booking Flow

1. **Login to Corporate Portal:**
   - Navigate to http://localhost:3000/corporate-mobility/login
   - Login with test corporate account

2. **Go to Reserve:**
   - Click "Reserve" in the navigation

3. **Follow Same Steps as General Booking:**
   - Test both one-way and by-hour bookings
   - Verify emails show correct Distance/Duration

4. **Check Console Logs:**
   Look for:
   ```
   📏 Corporate - Saving distance/duration: { ... }
   ```

## Troubleshooting

### Issue: Email shows "N/A" for distance

**Cause:** Distance calculation failed or wasn't saved
**Check:**

1. Console logs for distance calculation errors
2. Check if `distanceInfo` is populated before clicking Continue
3. Verify Google Maps API key is configured

### Issue: Email shows wrong label (Distance instead of Duration)

**Cause:** `bookingType` not being passed correctly
**Check:**

1. Console logs in `booking-history.ts` - look for `bookingType` value
2. Verify `reservationData.type` matches expected value ("one-way" or "by-hour")
3. Check API logs to see if `bookingType` is in the request body

### Issue: Email not sent at all

**Cause:** Separate issue with email system
**See:** `EMAIL_DEBUG_GUIDE.md` and `EMAIL_TROUBLESHOOTING.md`

## Success Criteria

✅ One-way bookings show "Distance: ca. XX km"
✅ By-hour bookings show "Duration: X Hours"
✅ Missing distance shows "N/A"
✅ Console logs show correct distance/duration being saved
✅ Corporate bookings work the same way
✅ No linting errors
✅ Email is delivered successfully

## Next Steps After Testing

1. Test with real bookings from the UI
2. Verify distance calculations are accurate
3. Check email rendering across different email clients (Gmail, Outlook, Apple Mail)
4. Confirm the feature works in production environment
