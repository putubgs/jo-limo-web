# Email Integration with Booking Flow

This document describes how the invoice email system is integrated with both regular and corporate booking flows.

## Overview

The invoice email system automatically sends a professional booking confirmation email with a PDF invoice attachment to customers after they complete a booking.

## Features

✅ **Automatic Email Sending** - Emails sent immediately after booking completion
✅ **Real Booking Data** - All email fields populated with actual booking information
✅ **Professional Design** - Blacklane-inspired email template with JoLimo branding
✅ **PDF Invoice Attachment** - Detailed invoice attached as PDF
✅ **Social Media Integration** - Real social media logos (Facebook, X, Instagram, LinkedIn)
✅ **Multi-Client Support** - Works in Gmail, Outlook, Apple Mail, and all email clients
✅ **Both Booking Types** - Supports regular and corporate bookings

## Email Data Integration

### Data Flow

1. **User completes booking** (regular or corporate)
2. **Booking saved to database**
3. **Invoice API called** with booking details
4. **Email generated** with React Email template
5. **PDF invoice generated** with jsPDF
6. **Email sent** via SendGrid with all attachments

### Data Passed to Email

The following data is extracted from the booking and passed to the email:

| Field                 | Source              | Description                                 |
| --------------------- | ------------------- | ------------------------------------------- |
| `customerName`        | Billing form        | Customer's full name                        |
| `customerEmail`       | Billing form        | Customer's email address                    |
| `pickupLocation`      | Reservation form    | Pickup address                              |
| `dropoffLocation`     | Reservation form    | Drop-off address                            |
| `serviceClass`        | Service selection   | Vehicle class (Executive, Luxury, MPV, SUV) |
| `dateTime`            | Reservation form    | Booking date and time                       |
| `price`               | Pricing calculation | Total price in JOD                          |
| `paymentMethod`       | Payment selection   | credit/debit, cash, or corporate            |
| `mobileNumber`        | Pick-up info form   | Customer's phone number                     |
| `flightNumber`        | Pick-up info form   | Flight number (if applicable)               |
| `pickupSign`          | Pick-up info form   | Pickup sign name (for airports)             |
| `specialRequirements` | Pick-up info form   | Special requests/notes                      |
| `distance`            | Route calculation   | Distance between locations                  |

### Vehicle Capacity Mapping

The email automatically shows correct passenger and luggage capacity based on service class:

| Service Class | Max Passengers | Max Luggage |
| ------------- | -------------- | ----------- |
| Executive     | 3              | 2           |
| Luxury        | 3              | 2           |
| MPV           | 6              | 6           |
| SUV           | 6              | 5           |

## Integration Points

### 1. Regular Booking Flow

**File:** `/src/lib/booking-history.ts`

After successful booking creation:

```typescript
const invoiceResponse = await fetch("/api/send-invoice", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    customerName: `${billingData.customerGivenName} ${billingData.customerSurname}`,
    customerEmail: billingData.customerEmail,
    pickupLocation: reservationData.pickup,
    dropoffLocation: reservationData.dropoff || "Round trip",
    serviceClass: reservationData.selectedClass,
    dateTime: `${reservationData.date}, ${reservationData.time}`,
    price: reservationData.selectedClassPrice,
    paymentMethod,
    mobileNumber: reservationData.mobileNumber,
    flightNumber: reservationData.flightNumber,
    pickupSign: reservationData.pickupSign,
    specialRequirements: reservationData.specialRequirements,
    distance: reservationData.distance,
  }),
});
```

### 2. Corporate Booking Flow

**File:** `/src/app/api/corporate-mobility/booking/create/route.ts`

After successful corporate booking creation:

```typescript
const invoiceResponse = await fetch(
  `${request.nextUrl.origin}/api/send-invoice`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: `${body.first_name} ${body.last_name}`,
      customerEmail: body.email,
      pickupLocation: body.pick_up_location,
      dropoffLocation: body.drop_off_location || "Round trip",
      serviceClass: body.selected_class,
      dateTime: body.date_and_time,
      price: body.price,
      paymentMethod: "corporate",
      mobileNumber: body.mobile_number,
      flightNumber: body.flight_number,
      pickupSign: body.pickup_sign,
      specialRequirements: body.special_requirements,
      distance: body.distance,
    }),
  }
);
```

## Email Template

**File:** `/src/emails/InvoiceEmail.tsx`

The email template includes:

1. **Header** - JoLimo logo on black background
2. **Greeting** - Personalized with customer's first name
3. **Booking Details Box** - All booking information in a styled table:
   - Booking number
   - Date and time
   - From/To locations
   - Distance
   - Price
   - Vehicle type with capacity icons
   - Flight number (if provided)
   - Pickup sign (if provided)
   - Special requirements (if provided)
4. **Guest Information** - Customer name, mobile, email
5. **App Download Section** - Google Play and App Store badges
6. **Footer** - Contact info, social media icons, company details

## API Endpoint

**File:** `/src/app/api/send-invoice/route.ts`

### Request

```typescript
POST /api/send-invoice
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "pickupLocation": "Queen Alia International Airport",
  "dropoffLocation": "Amman City Center",
  "serviceClass": "Executive",
  "dateTime": "2024-11-20, 10:00 AM",
  "price": "50",
  "paymentMethod": "credit/debit",
  "mobileNumber": "+962791234567",
  "flightNumber": "RJ123",
  "pickupSign": "John Doe",
  "specialRequirements": "Child seat required",
  "distance": "35 km"
}
```

### Response

```typescript
{
  "success": true,
  "invoiceNumber": "AT12345678",
  "messageId": "sendgrid-message-id"
}
```

## Email Utility

**File:** `/src/utils/email.ts`

Key functions:

### `sendInvoiceEmail(data: InvoiceEmailData)`

Main function that:

1. Renders React Email template with booking data
2. Generates PDF invoice
3. Loads all image attachments (logo, badges, social icons)
4. Sends email via SendGrid with all attachments

### Helper Functions

- `getMaxPassengers(serviceClass)` - Returns max passenger count
- `getMaxLuggage(serviceClass)` - Returns max luggage count

## Images Embedded

All images are embedded as inline attachments (CID) for guaranteed display:

1. `jolimo-email-logo.png` - Header logo
2. `google-play-badge.png` - Google Play button
3. `app-store-badge.png` - App Store button
4. `jolimo-app.png` - Phone mockup image
5. `facebook-icon.png` - Facebook logo
6. `x-icon.png` - X (Twitter) logo
7. `instagram-icon.png` - Instagram logo
8. `linkedin-icon.png` - LinkedIn logo

## Error Handling

- If email sending fails, the booking still succeeds
- Errors are logged but don't affect the user experience
- Comprehensive logging for debugging

## Testing

### Test Regular Booking Email

```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "pickupLocation": "Queen Alia International Airport",
    "dropoffLocation": "Amman City Center",
    "serviceClass": "Executive",
    "dateTime": "2024-11-24, 10:00 AM",
    "price": "50",
    "paymentMethod": "credit/debit",
    "mobileNumber": "+962791234567",
    "flightNumber": "RJ123",
    "pickupSign": "Test User",
    "specialRequirements": "Window seat",
    "distance": "35 km"
  }'
```

### Test Corporate Booking Email

Same as above but with `"paymentMethod": "corporate"`

## Deliverability

See `EMAIL_DELIVERABILITY.md` for:

- Domain authentication setup
- Spam prevention measures
- Troubleshooting guide
- Microsoft SNDS registration

## Future Enhancements

- [ ] Add email templates for other notifications (booking reminders, cancellations)
- [ ] Support for multiple languages
- [ ] Customer rating/feedback link in email
- [ ] Real-time booking tracking link
- [ ] Automated follow-up emails

---

**Last Updated:** November 2024
