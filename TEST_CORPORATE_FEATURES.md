# Test Corporate Features: Reference Code, Company Info & CC

## Changes Made

### 1. Reference Code

- **Always displayed** in email summary
- Shows "-" for general bookings (no reference code)
- Shows actual corporate reference for corporate bookings

### 2. Company Name & Billing Info

- Displays company name in guest information section
- Shows "Corporate billing through {Company Name}"
- Only visible for corporate bookings

### 3. CC Recipients

- **All emails** include `putubaguswidia@outlook.com` in CC
- **Corporate emails** also CC the company email
- Ensures company and admin receive copies

### 4. PDF Invoice

- Shows company name below customer name for corporate bookings
- Format: "Company: {Company Name}"

## Test Commands

### Test 1: General Booking (No Reference Code)

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: "application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "customer@example.com",
    "pickupLocation": "Queen Alia International Airport, Airport Road, Jordan",
    "dropoffLocation": "Amman City Center",
    "serviceClass": "Executive",
    "dateTime": "Mon, Nov 18, 2025, 10:00 AM",
    "price": "50",
    "paymentMethod": "credit/debit",
    "bookingType": "one-way",
    "distance": "ca. 35 km",
    "mobileNumber": "+962 123456789",
    "flightNumber": "OS 853",
    "pickupSign": "Mr. Test",
    "specialRequirements": "Please call on arrival",
    "referenceCode": "",
    "companyName": "",
    "companyEmail": ""
  }'
```

**Expected Email:**

- **To:** customer@example.com
- **CC:** putubaguswidia@outlook.com
- **Reference code:** -
- **No company information shown**

### Test 2: Corporate Booking (With Reference Code)

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Zaid Abu Samra",
    "customerEmail": "zaid@company.com",
    "pickupLocation": "Dead Sea Marriott Resort & Spa",
    "dropoffLocation": "from Dead Sea Marriott Resort & Spa for 4 Hours trip",
    "serviceClass": "Luxury",
    "dateTime": "Mon, Nov 18, 2025, 2:00 PM",
    "price": "120",
    "paymentMethod": "corporate",
    "bookingType": "by-hour",
    "distance": "4 Hours",
    "mobileNumber": "+962 796272727",
    "flightNumber": "",
    "pickupSign": "",
    "specialRequirements": "",
    "referenceCode": "CORP-2025-001",
    "companyName": "Acme Corporation",
    "companyEmail": "billing@acme.com"
  }'
```

**Expected Email:**

- **To:** zaid@company.com
- **CC:** putubaguswidia@outlook.com, billing@acme.com
- **Reference code:** CORP-2025-001
- **Company:** Acme Corporation
- **Billing:** Corporate billing through Acme Corporation

**Expected PDF:**

```
JoLimo Logo

Booking no.                    Invoice no.
00001                          AT12345678

Booking date                   Invoice date
2025-11-18                     2025-11-18

Zaid Abu Samra
Company: Acme Corporation

Invoice
[Table with service details...]
```

### Test 3: Corporate Booking (Empty Optional Fields)

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@business.com",
    "pickupLocation": "Queen Alia International Airport",
    "dropoffLocation": "Petra",
    "serviceClass": "SUV",
    "dateTime": "Mon, Nov 19, 2025, 8:00 AM",
    "price": "150",
    "paymentMethod": "corporate",
    "bookingType": "one-way",
    "distance": "ca. 250 km",
    "mobileNumber": "+962 777123456",
    "flightNumber": "",
    "pickupSign": "",
    "specialRequirements": "",
    "referenceCode": "CORP-ABC-123",
    "companyName": "Tech Solutions Ltd",
    "companyEmail": "accounts@techsolutions.com"
  }'
```

**Expected Email:**

- **To:** john@business.com
- **CC:** putubaguswidia@outlook.com, accounts@techsolutions.com
- **Reference code:** CORP-ABC-123
- **Flight number:** -
- **Pickup sign:** -
- **Special requirements:** -
- **Company:** Tech Solutions Ltd
- **Billing:** Corporate billing through Tech Solutions Ltd

## Full Booking Flow Test

### Test Corporate Booking Through UI

1. **Login to Corporate Portal:**

   ```
   http://localhost:3000/corporate-mobility/login
   ```

   - Use test corporate account credentials

2. **Navigate to Reserve:**
   - Click "Reserve" in navigation

3. **Fill Booking Form:**
   - Select "By The Hour"
   - Pickup: Dead Sea Marriott Resort & Spa
   - Duration: 4 Hours
   - Date: Tomorrow
   - Time: 2:00 PM

4. **Select Service Class:**
   - Choose "Luxury"
   - Click "Continue"

5. **Fill Pick-up Info:**
   - Email: zaid@company.com
   - First Name: Zaid
   - Last Name: Abu Samra
   - Phone: +962 796272727
   - Leave other fields empty
   - Click "Continue"

6. **Corporate Billing Page:**
   - Review details
   - Click "Confirm Booking"

7. **Check Emails:**
   - **Customer email** (zaid@company.com): Should receive invoice
   - **Company email**: Should receive CC
   - **Admin email** (putubaguswidia@outlook.com): Should receive CC

8. **Verify Email Content:**

   ```
   📍 Booking Summary

   Date and time: Mon, Nov 18, 2025, 2:00 PM
   From: Dead Sea Marriott Resort & Spa, Dead Sea Rd., Sweimeh, Jordan
   To: from Dead Sea Marriott Resort & Spa for 4 Hours trip
   Duration: 4 Hours
   Price: JOD 120 *
   Vehicle type: luxury 👤 max. 3 🧳 max. 2
   Flight number: -
   Pickup sign: -
   Special requirements: -
   Reference code: CORP-2025-001

   🚗 Guest Information

   Guest: Mr. Zaid Abu Samra
   Mobile: +962 796272727
   Email: zaid@company.com
   Company: Acme Corporation
   Billing: Corporate billing through Acme Corporation
   ```

9. **Verify PDF Attachment:**
   - Open attached invoice PDF
   - Check it shows:
     ```
     Zaid Abu Samra
     Company: Acme Corporation
     ```

### Test General Booking Through UI

1. **Navigate to Homepage:**

   ```
   http://localhost:3000
   ```

2. **Fill Booking Form:**
   - Select "One Way"
   - Pickup: Queen Alia International Airport
   - Dropoff: Amman City Center
   - Date: Tomorrow
   - Time: 10:00 AM

3. **Complete Booking:**
   - Select service class
   - Fill pick-up info with flight number, pickup sign, etc.
   - Complete payment

4. **Check Emails:**
   - **Customer email**: Receives invoice
   - **Admin email** (putubaguswidia@outlook.com): Receives CC
   - **No company email** in CC

5. **Verify Email Content:**
   ```
   Reference code: -
   (No company information shown)
   ```

## Email Summary Format

### General Booking Email

```
📍 Booking Summary

Date and time: Mon, Nov 18, 2025, 10:00 AM
From: Queen Alia International Airport, Airport Road, Jordan
To: Amman City Center
Distance: ca. 35 km
Price: JOD 50 *
Vehicle type: executive 👤 max. 3 🧳 max. 2
Flight number: OS 853
Pickup sign: Mr. Test User
Special requirements: Please call on arrival
Reference code: -

🚗 Guest Information

Guest: Mr. Test User
Mobile: +962 123456789
Email: test@example.com
```

### Corporate Booking Email

```
📍 Booking Summary

Date and time: Mon, Nov 18, 2025, 2:00 PM
From: Dead Sea Marriott Resort & Spa, Dead Sea Rd., Sweimeh, Jordan
To: from Dead Sea Marriott Resort & Spa for 4 Hours trip
Duration: 4 Hours
Price: JOD 120 *
Vehicle type: luxury 👤 max. 3 🧳 max. 2
Flight number: -
Pickup sign: -
Special requirements: -
Reference code: CORP-2025-001

🚗 Guest Information

Guest: Mr. Zaid Abu Samra
Mobile: +962 796272727
Email: zaid@company.com
Company: Acme Corporation
Billing: Corporate billing through Acme Corporation
```

## Files Modified

### Email Template

1. **`/src/emails/InvoiceEmail.tsx`**
   - Added `referenceCode`, `companyName`, `isCorporate` props
   - Reference code always shown (with "-" fallback)
   - Company and billing info conditionally shown

### Email Utility

2. **`/src/utils/email.ts`**
   - Added `referenceCode`, `companyName`, `companyEmail` to interface
   - Build CC list with admin and company email
   - Pass new fields to InvoiceEmail component

### PDF Generator

3. **`/src/utils/pdf-generator.ts`**
   - Added `companyName` to interface
   - Display company name below customer name in PDF

### API Routes

4. **`/src/app/api/send-invoice/route.ts`**
   - Accept `referenceCode`, `companyName`, `companyEmail` params
   - Pass to email utility

5. **`/src/app/api/corporate-mobility/booking/create/route.ts`**
   - Pass `referenceCode` from JWT payload
   - Pass `companyName` and `companyEmail` from JWT payload
   - Format dropoff for by-hour bookings

## Verification Checklist

✅ General bookings show "-" for reference code
✅ Corporate bookings show actual reference code
✅ Company name appears in corporate emails
✅ Corporate billing message shows company name
✅ All emails CC putubaguswidia@outlook.com
✅ Corporate emails also CC company email
✅ PDF shows company name for corporate bookings
✅ Empty fields show "-" instead of disappearing
✅ Reference code displayed after special requirements
✅ Company info displayed after guest email
✅ No linting errors

## Debugging

### Check CC Recipients

Look for this in the logs:

```
📧 Sending email with CC: ['putubaguswidia@outlook.com', 'billing@company.com']
```

### Check Corporate Data

Look for this in corporate booking API:

```
Reference code: CORP-2025-001
Company name: Acme Corporation
Company email: billing@acme.com
```

### Check Email Content

Inspect the HTML email to verify:

1. Reference code row is present
2. Company row is conditionally rendered
3. Billing row is conditionally rendered

## Success Criteria

✅ All emails include admin in CC
✅ Corporate emails include company in CC
✅ Reference code always visible (- or actual value)
✅ Company info only shown for corporate bookings
✅ PDF includes company name for corporate bookings
✅ General bookings work without corporate fields
✅ Email deliverability not affected
✅ All fields properly formatted

## Next Steps

1. Test with real corporate accounts
2. Verify CC delivery in all email clients
3. Confirm PDF renders correctly with company name
4. Test edge cases (very long company names, special characters)
5. Monitor email deliverability metrics
