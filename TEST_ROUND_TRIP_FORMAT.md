# Test Round Trip Format & Field Display

## Changes Made

### 1. Round Trip Format

**Before:** `To: Round trip`
**After:** `To: from Dead Sea Marriott Resort & Spa for 4 Hours trip`

Format: `from {pickup_location} for {duration} trip`

### 2. Always Show All Fields

All pick-up info fields now always display in the email with "-" if empty:

- Flight number
- Pickup sign
- Special requirements

## Test Commands

### Test 1: By-Hour Booking (Round Trip Format)

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "putubaguswidia@gmail.com",
    "pickupLocation": "Dead Sea Marriott Resort & Spa, Dead Sea Rd., Sweimeh, Jordan",
    "dropoffLocation": "from Dead Sea Marriott Resort & Spa, Dead Sea Rd., Sweimeh, Jordan for 4 Hours trip",
    "serviceClass": "Executive",
    "dateTime": "Mon, Nov 17, 2025, 7:45 PM",
    "price": "120",
    "paymentMethod": "cash",
    "bookingType": "by-hour",
    "distance": "4 Hours",
    "mobileNumber": "+962 796272727",
    "flightNumber": "",
    "pickupSign": "",
    "specialRequirements": ""
  }'
```

**Expected Email Output:**

```
Date and time: Mon, Nov 17, 2025, 7:45 PM
From: Dead Sea Marriott Resort & Spa, Dead Sea Rd., Sweimeh, Jordan
To: from Dead Sea Marriott Resort & Spa, Dead Sea Rd., Sweimeh, Jordan for 4 Hours trip
Duration: 4 Hours
Price: JOD 120 *
Vehicle type: executive 👤 max. 3 🧳 max. 2
Flight number: -
Pickup sign: -
Special requirements: -
```

### Test 2: By-Hour with All Fields Filled

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Zaid Abu Samra",
    "customerEmail": "putubaguswidia@gmail.com",
    "pickupLocation": "Queen Alia International Airport, Airport Road, Jordan",
    "dropoffLocation": "from Queen Alia International Airport, Airport Road, Jordan for 6 Hours trip",
    "serviceClass": "Luxury",
    "dateTime": "Mon, Nov 18, 2025, 10:00 AM",
    "price": "180",
    "paymentMethod": "credit/debit",
    "bookingType": "by-hour",
    "distance": "6 Hours",
    "mobileNumber": "+962 796272727",
    "flightNumber": "OS 853",
    "pickupSign": "Mr. Zaid",
    "specialRequirements": "Please wait at terminal 1"
  }'
```

**Expected Email Output:**

```
Date and time: Mon, Nov 18, 2025, 10:00 AM
From: Queen Alia International Airport, Airport Road, Jordan
To: from Queen Alia International Airport, Airport Road, Jordan for 6 Hours trip
Duration: 6 Hours
Price: JOD 180 *
Vehicle type: luxury 👤 max. 3 🧳 max. 2
Flight number: OS 853
Pickup sign: Mr. Zaid
Special requirements: Please wait at terminal 1
```

### Test 3: One-Way Booking (No Change)

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
    "distance": "ca. 35 km",
    "mobileNumber": "+962 123456789",
    "flightNumber": "",
    "pickupSign": "",
    "specialRequirements": ""
  }'
```

**Expected Email Output:**

```
Date and time: 2024-11-24, 10:00 AM
From: Queen Alia International Airport, Airport Road, Jordan
To: Amman City Center
Distance: ca. 35 km
Price: JOD 50 *
Vehicle type: executive 👤 max. 3 🧳 max. 2
Flight number: -
Pickup sign: -
Special requirements: -
```

## Full Booking Flow Test

### Test By-Hour Booking Through UI

1. **Navigate to Reserve Page:**

   ```
   http://localhost:3000
   ```

2. **Fill Booking Form:**
   - Select "By The Hour"
   - Pickup: Dead Sea Marriott Resort & Spa, Dead Sea Rd., Sweimeh, Jordan
   - Duration: 4 Hours
   - Date: Tomorrow
   - Time: 7:45 PM (or at least 1 hour from now in Jordan time)

3. **Select Service Class:**
   - Choose "Executive"
   - Click "Continue"

4. **Fill Pick-up Info:**
   - Email: putubaguswidia@gmail.com
   - First Name: Test
   - Last Name: User
   - Phone: +962 123456789
   - **Leave all other fields empty** (to test "-" display)
   - Click "Continue"

5. **Complete Payment:**
   - Select "Pay Later"
   - Complete booking

6. **Check Email:**
   - Should show:
     ```
     To: from Dead Sea Marriott Resort & Spa, Dead Sea Rd., Sweimeh, Jordan for 4 Hours trip
     Duration: 4 Hours
     Flight number: -
     Pickup sign: -
     Special requirements: -
     ```

### Test With Fields Filled

Repeat the above but in Pick-up Info:

- Flight Number: OS 853
- Pickup Sign: Mr. Test User
- Notes for Chauffeur: Please call when you arrive

Check email should show actual values instead of "-".

## What Was Changed

### Files Modified:

1. **`/src/lib/booking-history.ts`**
   - Added logic to format dropoff location for by-hour bookings
   - Format: `from {pickup} for {duration} trip`

2. **`/src/app/api/corporate-mobility/booking/create/route.ts`**
   - Same formatting logic for corporate bookings

3. **`/src/emails/InvoiceEmail.tsx`**
   - Removed conditional rendering (`{flightNumber && ...}`)
   - Always show fields with `{flightNumber || "-"}` fallback

### Code Changes:

```typescript
// Before (booking-history.ts)
dropoffLocation: reservationData.dropoff || "Round trip";

// After
let dropoffLocation = reservationData.dropoff || "";
if (reservationData.type === "by-hour") {
  dropoffLocation = `from ${reservationData.pickup} for ${reservationData.duration || reservationData.distance} trip`;
}
```

```tsx
// Before (InvoiceEmail.tsx)
{
  flightNumber && (
    <tr>
      <td>Flight number:</td>
      <td>{flightNumber}</td>
    </tr>
  );
}

// After
<tr>
  <td>Flight number:</td>
  <td>{flightNumber || "-"}</td>
</tr>;
```

## Verification Checklist

✅ By-hour bookings show: "from [location] for [duration] trip"
✅ One-way bookings still show normal dropoff location
✅ Flight number shows "-" when empty
✅ Pickup sign shows "-" when empty
✅ Special requirements shows "-" when empty
✅ All fields visible even when empty
✅ Works for both general and corporate bookings
✅ No linting errors

## Example Email Screenshots

### By-Hour Booking (Empty Fields)

```
📍 Booking Summary

Date and time: Mon, Nov 17, 2025, 7:45 PM
From: Dead Sea Marriott Resort & Spa, Dead Sea Rd., Sweimeh, Jordan
To: from Dead Sea Marriott Resort & Spa, Dead Sea Rd., Sweimeh, Jordan for 4 Hours trip
Duration: 4 Hours
Price: JOD 120 *
Vehicle type: executive 👤 max. 3 🧳 max. 2
Flight number: -
Pickup sign: -
Special requirements: -

🚗 Guest Information

Guest: Mr. Test User
Mobile: +962 123456789
E-mail: test@example.com
```

### One-Way Booking (With Fields)

```
📍 Booking Summary

Date and time: Mon, Nov 18, 2025, 10:00 AM
From: Queen Alia International Airport, Airport Road, Jordan
To: Amman City Center
Distance: ca. 35 km
Price: JOD 50 *
Vehicle type: executive 👤 max. 3 🧳 max. 2
Flight number: OS 853
Pickup sign: Mr. Zaid
Special requirements: Please wait at terminal 1

🚗 Guest Information

Guest: Mr. Zaid Abu Samra
Mobile: +962 796272727
E-mail: zaid@example.com
```
