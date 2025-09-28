# Email Setup for Corporate Account Notifications

## Overview

The corporate accounts system now sends automatic email notifications when new accounts are created. The email includes the corporate reference and password for the new account.

## SendGrid Configuration

### SendGrid Setup

The system uses SendGrid to send emails from `tech@jo-limo.com`.

### Required Environment Variables

Add these to your `.env.local` file:

```env
# SendGrid Configuration for Email Notifications
SENDGRID_API_KEY=your_sendgrid_api_key
```

### SendGrid API Key Setup

To get your SendGrid API key:

1. **Sign up for SendGrid** at [sendgrid.com](https://sendgrid.com)
2. **Create API Key**:
   - Go to [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)
   - Click "Create API Key"
   - Give it a name like "Jo Limo Corporate Emails"
   - Select "Restricted Access" and give it "Mail Send" permissions
   - Copy the generated API key
   - Use this API key as `SENDGRID_API_KEY` in your environment variables

### Verify Sender Identity

In SendGrid, you need to verify the sender email:

1. **Go to Sender Authentication** in SendGrid dashboard
2. **Verify Single Sender** or **Domain Authentication**
3. **For Single Sender**: Verify `tech@jo-limo.com`
4. **For Domain**: Verify your domain for better deliverability

### SendGrid Benefits

- **High Deliverability**: Better email delivery rates
- **Analytics**: Track email opens, clicks, and bounces
- **Reliability**: Professional email infrastructure
- **Easy Integration**: Simple API-based sending
- **Free Tier**: 100 emails/day for free

## Email Template

The email includes:

- **Corporate Reference**: Unique identifier for the account
- **Account Password**: Secure password for login
- **Company Information**: Name, email, phone, address
- **Professional Styling**: HTML email with Jo Limo branding
- **Security Warning**: Reminder to save credentials securely

## Testing

To test the email functionality:

1. Ensure environment variables are set
2. Create a new corporate account through the admin panel
3. Check the corporate email for the notification
4. Check server logs for email sending status

## Troubleshooting

### Common Issues

1. **Authentication Failed**

   - Verify SENDGRID_API_KEY is correct
   - Ensure API key has "Mail Send" permissions
   - Check if API key is not expired

2. **Sender Not Verified**

   - Verify sender email in SendGrid dashboard
   - Complete domain authentication if using custom domain
   - Check sender reputation

3. **Email Not Received**
   - Check spam/junk folder
   - Verify recipient email address
   - Check SendGrid activity feed for delivery status
   - Review bounce/complaint reports

### Logs

The system logs email sending attempts:

- Success: `Email notification sent to [email] for account [reference]`
- Error: `Failed to send email notification: [error details]`

## Security Notes

- API keys are more secure than SMTP passwords
- Email contains sensitive information (password)
- Consider using encrypted email for production
- Store SendGrid API key securely in environment variables
- Never commit API keys to version control
- Use restricted API keys with minimal required permissions
