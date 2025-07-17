# Reservation Flow Testing Guide

## Overview

The reservation flow has been implemented with 3 pages under the `/reserve` folder:

1. **Pick Up Info** (`/reserve/pick-up-info`)
2. **Service Class** (`/reserve/service-class`)
3. **Payment & Checkout** (`/reserve/payment-and-checkout`)

## Features Implemented

### ✅ Step Navigator

- Visual progress indicator with bullet points
- Shows current step (black dot) and future steps (gray circles)
- Matches the design from the provided image

### ✅ Data Passing

- Data flows from reservation popup → through all pages
- URL parameters preserve booking information
- Supports both "ONE WAY" and "BY THE HOUR" booking types

### ✅ Navigation

- Continue buttons between pages
- Back buttons to previous steps
- Temporary navigation for testing

### ✅ Responsive Design

- Clean, centered layout
- Matches the visual style from the image
- Form fields and buttons styled consistently

## How to Test

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test the Reservation Flow

1. **Open the website** (usually http://localhost:3000)

2. **Click "RESERVE NOW"** in the header

   - Button should become bold when dropdown is open
   - Dropdown should appear

3. **Fill out the reservation form**:

   - Choose "ONE WAY" tab
   - Enter pickup location (e.g., "Queen Alia International Airport")
   - Enter dropoff location (e.g., "DAMAC Tower, Amman")
   - Select date and time
   - Click "Continue"

4. **Navigate through the booking flow**:

   - **Page 1**: Pick Up Info

     - See booking details in header
     - Fill out passenger information
     - Click "Continue to Service Class"

   - **Page 2**: Service Class

     - Choose a service (Executive, Luxury, or SUV)
     - Notice the step indicator shows step 2 as active
     - Click "Continue to Payment"

   - **Page 3**: Payment & Checkout
     - See order summary with all details
     - Fill out payment form
     - Click "Complete Booking" (shows demo alert)

### 3. Test Navigation Features

- **Step indicator**: Should show current step in black, others in gray
- **Back buttons**: Should work between all pages
- **Data persistence**: All booking data should carry through pages
- **URL sharing**: Copy/paste URLs should maintain booking data

### 4. Test Different Booking Types

- **ONE WAY**: Pickup → Dropoff flow
- **BY THE HOUR**: From location + duration flow

## URLs for Direct Testing

- Pick Up Info: `/reserve/pick-up-info?pickup=Airport&dropoff=DAMAC&date=Wed,%20AUG%207,%202024&time=10:45%20AM&type=one-way`
- Service Class: `/reserve/service-class?pickup=Airport&dropoff=DAMAC&date=Wed,%20AUG%207,%202024&time=10:45%20AM&type=one-way`
- Payment: `/reserve/payment-and-checkout?pickup=Airport&dropoff=DAMAC&date=Wed,%20AUG%207,%202024&time=10:45%20AM&type=one-way&service=executive`

## Expected Behavior

1. **Step indicator**: Always shows correct current step
2. **Header info**: Displays booking date/time and route
3. **Data flow**: Information persists across all pages
4. **Navigation**: Back/Continue buttons work smoothly
5. **Validation**: Basic form validation on Continue button

## Temporary Features (For Testing)

- Demo alert on final "Complete Booking" button
- Placeholder form fields
- Mock service prices and descriptions
- Basic form validation messages
