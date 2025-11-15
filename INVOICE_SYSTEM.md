# Invoice System Documentation

## Overview

The Jo Limo application automatically generates and sends professional invoices to customers upon successful booking completion. The invoice design matches industry standards (similar to Blacklane) with the Jo Limo branding.

## Features

### 1. Automatic Invoice Generation

- **Trigger**: Automatically sent after successful booking creation
- **Recipients**: Customer email provided during booking
- **Delivery**: Email with HTML and plain text versions + **PDF attachment**
- **Invoice Number Format**: `AT{timestamp}{random}` (e.g., AT1234567890123)
- **PDF Format**: Professional PDF invoice matching Blacklane design

### 2. Payment Method Support

The invoice displays different payment information based on the booking type:

#### Credit/Debit Card Payment

```
The amount has been charged to your credit card: ************1234
```

#### Cash Payment (Pay Later)

```
Payment will be collected in cash or by card upon drop-off.
```

#### Corporate Billing

```
This booking will be billed to your corporate account.
```

### 3. Invoice Information

Each invoice includes:

- **Header Information**:

  - Customer Number
  - Booking Number
  - Booking Date
  - Invoice Number
  - Invoice Date

- **Service Details**:

  - Service description with pickup/dropoff locations
  - Service class (Executive, Luxury, MPV, SUV)
  - Date and time of service
  - Vehicle class

- **Pricing**:
  - Net price
  - Sales Tax (10%)
  - Total price (in JOD)

## File Structure

```
src/
├── utils/
│   ├── email.ts                 # Email sending utilities
│   └── pdf-generator.ts         # PDF invoice generation
├── app/api/
│   └── send-invoice/
│       └── route.ts             # Invoice API endpoint
└── lib/
    └── booking-history.ts       # Booking creation with invoice integration
```

## Implementation Details

### 1. Email Template (`src/utils/email.ts`)

The `sendInvoiceEmail` function:

- Accepts invoice data including customer info, booking details, and payment method
- Generates an HTML email matching the Blacklane invoice design
- **Generates PDF invoice using PDFKit**
- **Attaches PDF to email as `Invoice-{invoiceNumber}.pdf`**
- Includes the Jo Limo logo and branding
- Provides plain text fallback
- Uses SendGrid for email delivery

```typescript
interface InvoiceEmailData {
  customerName: string;
  customerEmail: string;
  invoiceNumber: string;
  bookingNumber: string;
  bookingDate: string;
  invoiceDate: string;
  customerNumber: string;
  serviceDescription: string;
  netPrice: string;
  taxAmount: string;
  totalPrice: string;
  currency: string;
  paymentMethod: "credit/debit" | "cash" | "corporate";
}
```

### 2. PDF Generator (`src/utils/pdf-generator.ts`)

The `generateInvoicePDF` function:

- Creates professional PDF invoice matching Blacklane design
- Uses PDFKit for PDF generation
- Includes JOLIMO logo and branding
- Proper table formatting with headers
- Dynamic payment method text based on booking type
- Professional footer with company information
- Returns PDF as Buffer for email attachment

### 3. Invoice API (`src/app/api/send-invoice/route.ts`)

API endpoint that:

- Accepts booking details
- Generates invoice number
- Calculates pricing with 10% tax
- Formats service description
- Calls the email utility
- Returns invoice number and email status

### 4. Integration Points

#### Standard Bookings (`src/lib/booking-history.ts`)

- After successful booking creation
- Extracts customer email from billing data
- Sends invoice with payment method details
- Includes card last 4 digits for card payments
- Doesn't fail booking if invoice sending fails

#### Corporate Bookings (`src/app/api/corporate-mobility/booking/create/route.ts`)

- After successful corporate booking creation
- Uses corporate account email
- Marks payment method as "corporate"
- Independent of booking success

## Configuration

### Environment Variables

Required in `.env.local`:

```env
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Email Settings

- **From Email**: tech@jo-limo.com
- **From Name**: Jordan Limousine Services LLC
- **Subject Format**: Invoice {invoiceNumber} - Jo Limo

## Invoice Design

The invoice design features:

1. **Header**:

   - Bold "JOLIMO" logo on the left
   - Invoice details on the right (customer no., booking no., dates)

2. **Customer Name**:

   - Large spacing below header
   - Customer name display

3. **Invoice Table**:

   - Gray header row (#cccccc)
   - Columns: #, Quantity, Description, Price
   - Net price total row
   - Sales tax row (10%)
   - Bold total row with gray background

4. **Payment Information**:

   - Dynamic text based on payment method
   - Clear spacing from table

5. **Closing**:

   - Thank you message
   - "Best regards, Your JoLimo team"

6. **Footer**:
   - Company information
   - Contact details
   - Legal information

## Testing

### Manual Testing

1. **Credit Card Payment**:

   - Complete a booking with credit card payment
   - Check customer email for invoice
   - Verify card last 4 digits are displayed

2. **Cash Payment**:

   - Complete a booking with cash payment
   - Check customer email for invoice
   - Verify "pay upon drop-off" message

3. **Corporate Booking**:
   - Complete a corporate booking
   - Check corporate account email for invoice
   - Verify "billed to corporate account" message

### API Testing

```bash
# Test invoice sending
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "customer@example.com",
    "bookingId": 12345,
    "pickupLocation": "Queen Alia International Airport",
    "dropoffLocation": "Amman City Center",
    "serviceClass": "Executive",
    "dateTime": "2024-11-24, 10:00 AM",
    "price": "50",
    "paymentMethod": "credit/debit",
    "cardLastFour": "1234"
  }'
```

## Error Handling

1. **Invoice Sending Failure**:

   - Logged to console
   - Does NOT fail the booking
   - Customer still receives booking confirmation
   - Admin can manually resend invoice if needed

2. **Missing Email**:

   - Invoice sending is skipped
   - Booking still completes successfully
   - Logged for admin review

3. **SendGrid Errors**:
   - Caught and logged
   - Booking remains successful
   - Error details logged for debugging

## Future Enhancements

### Potential Improvements:

1. **PDF Attachments**: Generate PDF invoices and attach to emails
2. **Invoice History**: Store invoices in database for retrieval
3. **Manual Resend**: Admin interface to resend invoices
4. **Multiple Languages**: Invoice templates in Arabic and other languages
5. **Custom Branding**: Corporate clients get branded invoices
6. **Invoice Portal**: Customer portal to view/download past invoices
7. **Tax Customization**: Support for different tax rates or tax-exempt bookings

## Troubleshooting

### Invoice Not Received

1. Check spam/junk folder
2. Verify email address in booking
3. Check server logs for sending errors
4. Verify SendGrid API key is configured
5. Check SendGrid dashboard for delivery status

### Incorrect Information

1. Verify booking data is correct in database
2. Check price calculation logic
3. Verify payment method detection
4. Review service description formatting

### Payment Method Text

Ensure the payment method is correctly set:

- `"credit/debit"` for card payments
- `"cash"` for pay later
- `"corporate"` for corporate billing

## Support

For issues or questions:

- Email: tech@jo-limo.com
- Check SendGrid dashboard for email delivery logs
- Review server logs for API errors
- Contact development team for code-related issues
