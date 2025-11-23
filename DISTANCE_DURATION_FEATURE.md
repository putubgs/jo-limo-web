# Distance/Duration Feature for Invoice Emails

## Overview

This feature dynamically displays either **Distance** or **Duration** in the invoice email based on the booking type:

- **One-way bookings**: Display "Distance" with the calculated distance (e.g., "ca. 20 km")
- **By-hour bookings**: Display "Duration" with the selected duration (e.g., "4 Hours")

## Implementation Details

### 1. Data Flow

#### General Booking Flow

1. **Service Class Page** (`/src/app/reserve/service-class/page.tsx`):
   - Calculates distance using Google Distance Matrix API for one-way bookings
   - Stores distance info in local state (`distanceInfo`)
   - When user selects a service and clicks Continue:
     - For **one-way**: saves `distanceInfo.distance` to `reservationData.distance`
     - For **by-hour**: saves `bookingData.duration` to `reservationData.distance`

2. **Booking Creation** (`/src/lib/booking-history.ts`):
   - Passes `reservationData.distance` to the invoice API
   - Also passes `reservationData.type` as `bookingType`

#### Corporate Booking Flow

1. **Corporate Service Class Page** (`/src/app/corporate-mobility/account/reserve/service-class/page.tsx`):
   - Same logic as general booking flow
   - Saves distance/duration to store when user clicks Continue

2. **Corporate Billing Page** (`/src/app/corporate-mobility/account/reserve/corporate-billing/page.tsx`):
   - Includes `distance: reservationData.distance` in the booking payload

3. **Corporate Booking API** (`/src/app/api/corporate-mobility/booking/create/route.ts`):
   - Passes `body.distance` and `body.booking_type` to the invoice API

### 2. Email Rendering

#### Invoice Email Template (`/src/emails/InvoiceEmail.tsx`)

```typescript
interface InvoiceEmailProps {
  // ... other props
  distance?: string;
  bookingType?: string; // "one-way" or "by-hour"
}

export const InvoiceEmail = ({ ..., bookingType = "one-way" }) => {
  // Determine label and value based on booking type
  const isByHour = bookingType === "by-hour";
  const distanceLabel = isByHour ? "Duration" : "Distance";
  const distanceValue = distance || "N/A";

  return (
    // ...
    <tr>
      <td style={detailLabel}>{distanceLabel}:</td>
      <td style={detailValue}>{distanceValue}</td>
    </tr>
    // ...
  );
};
```

#### Email Utility (`/src/utils/email.ts`)

- Added `bookingType?: string` to `InvoiceEmailData` interface
- Passes `bookingType` to the `InvoiceEmail` React component

### 3. API Endpoint

#### Send Invoice API (`/src/app/api/send-invoice/route.ts`)

- Accepts `bookingType` in the request body
- Forwards it to `sendInvoiceEmail` function

## Testing

### Test One-Way Booking

1. Go to Reserve page
2. Select "One Way" transfer
3. Enter pickup: Queen Alia International Airport
4. Enter dropoff: Amman City Center
5. Select date/time
6. Choose a service class
7. Complete pick-up info and payment
8. Check email - should show:
   ```
   Distance: ca. 35 km
   ```

### Test By-Hour Booking

1. Go to Reserve page
2. Select "By The Hour" transfer
3. Enter pickup location
4. Select duration (e.g., "4 Hours")
5. Select date/time
6. Choose a service class
7. Complete pick-up info and payment
8. Check email - should show:
   ```
   Duration: 4 Hours
   ```

### Test Corporate Booking

Same as above but through corporate mobility portal (`/corporate-mobility/account/reserve`)

## Files Modified

### Core Logic

- `/src/app/reserve/service-class/page.tsx`
- `/src/app/corporate-mobility/account/reserve/service-class/page.tsx`
- `/src/app/corporate-mobility/account/reserve/corporate-billing/page.tsx`

### Email System

- `/src/emails/InvoiceEmail.tsx`
- `/src/utils/email.ts`

### API

- `/src/lib/booking-history.ts`
- `/src/app/api/corporate-mobility/booking/create/route.ts`

## Debug Logging

Look for these console logs to trace the feature:

```
📏 Saving distance/duration: { type: 'one-way', value: 'ca. 35 km', distanceInfo: {...} }
📏 Corporate - Saving distance/duration: { type: 'by-hour', value: '4 Hours', distanceInfo: {...} }
```

## Edge Cases Handled

1. **Missing Distance Data**: Falls back to "N/A" if distance calculation fails
2. **Null Safety**: Uses optional chaining (`distanceInfo?.distance`) to prevent errors
3. **Type Fallback**: Defaults to "one-way" if `bookingType` is not provided
4. **Corporate Flow**: Ensures distance is passed through all API layers

## Future Enhancements

- Store distance value in the database for historical tracking
- Add distance/duration validation before allowing booking
- Display estimated travel time alongside distance for one-way trips
