# HyperPay Integration Setup

## 🚨 CRITICAL: Fix Your Environment Configuration

**You are currently getting `200.300.404` errors because you're using the WRONG base URL!**

❌ **Your current:** `https://eu-test.oppwa.com`  
✅ **Must be:** `https://test.oppwa.com`

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```env
# HyperPay API Configuration
PAYMENT_ENTITY_ID=your_entity_id_here
PAYMENT_ACCESS_TOKEN=your_access_token_here
NEXT_PUBLIC_PAYMENT_BASE_URL=https://test.oppwa.com
NEXT_PUBLIC_SHOPPER_RESULT_URL=http://localhost:3000/payment-status
# Optional - if not set, will default to localhost:3000 for development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## For Production:

```env
NEXT_PUBLIC_PAYMENT_BASE_URL=https://eu-prod.oppwa.com
NEXT_PUBLIC_SHOPPER_RESULT_URL=https://yourdomain.com/payment-status
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Features Implemented

1. **Billing Information Collection**: Added to pick-up info pages
2. **HyperPay Checkout API**: Integrated with proper field mapping
3. **Payment Form**: Custom styled HyperPay widget
4. **Payment Status**: Success/failure handling with popups
5. **Zustand Store**: Billing data persistence

## Payment Flow

1. User fills billing information in pick-up info page
2. Data stored in Zustand store
3. Payment page loads HyperPay form with billing data
4. User enters card details
5. Payment processed and status returned
6. Success/failure popup shown with appropriate actions

## Required Fields for Payment

```typescript
interface BillingData {
  customerEmail: string;
  customerGivenName: string;
  customerSurname: string;
  billingStreet1: string;
  billingCity: string;
  billingState: string;
  billingCountry: string;
  billingPostcode: string;
}
```

## API Endpoints

- `POST /api/checkout` - Initialize payment
- `GET /api/checkout-status` - Check payment status
- `GET /payment-status` - Handle payment result redirect and display UI
- `GET /api/env-check` - Check environment variables (development only)

## Troubleshooting

### Common Error Codes

#### 200.300.404 - Payment Session Not Found

This error means:

- Payment session expired (30 minutes timeout)
- Wrong environment (test vs live)
- Incorrect entity ID
- Session ID mismatch

**Solutions:**

1. Check environment variables are set correctly
2. Ensure you're using test credentials with test URL
3. Try creating a new payment session
4. Verify entity ID matches your HyperPay configuration

#### Environment Check

Visit `http://localhost:3000/api/env-check` to verify your environment variables are set correctly.

### Debug Steps

1. Check console logs in browser developer tools
2. Check server logs for API responses
3. Verify environment variables with `/api/env-check`
4. Ensure CORS and domain settings in HyperPay dashboard
5. Check that webhook URLs are correctly configured

### Test vs Live Environment

- **Test**: `https://test.oppwa.com`
- **Live**: `https://oppwa.com` (or your production endpoint)

**Important**: Use `https://test.oppwa.com` for the test environment, not `https://eu-test.oppwa.com`

### Demo Environment Setup

For the test environment at [https://test.oppwa.com](https://test.oppwa.com/connectors/demo/submit?), make sure:

1. **Use correct test endpoint**: `https://test.oppwa.com`
2. **Entity ID**: Use your test entity ID from HyperPay dashboard
3. **Access Token**: Use your test access token
4. **Form Action**: Should automatically redirect to `https://test.oppwa.com/connectors/demo/submit`

### Common Setup Issues

1. **Wrong Base URL**: Use `https://test.oppwa.com` not `https://eu-test.oppwa.com`
2. **Missing Test Credentials**: Ensure you have test entity ID and access token
3. **CORS Issues**: Verify domain whitelist in HyperPay dashboard
4. **Session Expiry**: Payment sessions expire after 30 minutes
5. **PCI Iframe Errors**: Check browser console for iframe submission issues

### Updated Implementation

The HyperPay form now uses the proven configuration that matches successful implementations:

- **Comprehensive widget options** with full styling control
- **Aggressive input text color override** to ensure visibility
- **Continuous monitoring** of input fields for consistent styling
- **Enhanced error handling** for iframe submission issues
- **Proper form styling** with centered layout and responsive design

### Error Code Reference

#### PciIframeSubmitError

This error occurs when the payment form iframe has submission issues:

**Common Causes:**

- Form validation errors
- Network connectivity issues
- Browser security restrictions
- Missing or invalid checkout session

**Solutions:**

1. Check browser console for detailed error messages
2. Ensure billing information is complete and valid
3. Verify network connection is stable
4. Try refreshing the page and creating a new payment session
5. Check HyperPay dashboard for transaction logs

Make sure your entity ID, access token, and base URL all match the same environment.
