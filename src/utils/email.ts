import sgMail from "@sendgrid/mail";

interface CorporateAccountEmailData {
  corporateReference: string;
  companyEmail: string;
  password: string;
  companyName: string;
  companyAddress: string;
  phoneNumber: string;
}

export async function sendCorporateAccountEmail(
  data: CorporateAccountEmailData
) {
  try {
    // Configure SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

    // Email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Corporate Account Created - Jo Limo</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .content {
              background-color: #ffffff;
              padding: 20px;
            }
            p {
              margin: 15px 0;
            }
            .credentials {
              background-color: #f5f5f5;
              border: 1px solid #dddddd;
              padding: 15px;
              margin: 20px 0;
            }
            .credentials strong {
              display: block;
              margin-bottom: 5px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #dddddd;
              font-size: 12px;
              color: #666666;
            }
          </style>
        </head>
        <body>
          <div class="content">
            <p>Dear ${data.companyName} Team,</p>
            
            <p>We are pleased to inform you that your corporate account has been successfully created with Jo Limo.</p>

            <div class="credentials">
              <strong>Your Account Credentials:</strong>
              <p>Corporate Reference: <strong>${data.corporateReference}</strong></p>
              <p>Account Password: <strong>${data.password}</strong></p>
            </div>

            <p><strong>Important:</strong> Please save these credentials securely. Your corporate reference and password are required for all corporate bookings and account management.</p>

            <p>You can now access our platform to:</p>
            <p>
              - Make corporate bookings<br>
              - Access corporate rates and services<br>
              - Manage transportation preferences<br>
              - View booking history and invoices
            </p>

            <p>If you have any questions or need assistance, please contact our corporate services team.</p>

            <p>Best regards,<br>Jo Limo Corporate Services</p>

            <div class="footer">
              <p><strong>Jordan Limousine Services LLC</strong></p>
              <p>Email: tech@jo-limo.com<br>
              Website: jo-limo.com</p>
              <p>© 2025 Jordan Limousine Services LLC. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain text version
    const textTemplate = `
Dear ${data.companyName} Team,

We are pleased to inform you that your corporate account has been successfully created with Jo Limo.

YOUR ACCOUNT CREDENTIALS:
Corporate Reference: ${data.corporateReference}
Account Password: ${data.password}

IMPORTANT: Please save these credentials securely. Your corporate reference and password are required for all corporate bookings and account management.

You can now access our platform to:
- Make corporate bookings
- Access corporate rates and services
- Manage transportation preferences
- View booking history and invoices

If you have any questions or need assistance, please contact our corporate services team.

Best regards,
Jo Limo Corporate Services

---
Jordan Limousine Services LLC
Email: tech@jo-limo.com
Website: jo-limo.com
© 2025 Jordan Limousine Services LLC. All rights reserved.
    `;

    // SendGrid email message
    const msg = {
      to: data.companyEmail,
      from: {
        name: "Jordan Limousine Services LLC",
        email: "tech@jo-limo.com",
      },
      subject: `Corporate Account Created - ${data.corporateReference}`,
      text: textTemplate,
      html: htmlTemplate,
    };

    // Send email
    const response = await sgMail.send(msg);

    console.log("Corporate account email sent successfully:", {
      messageId: response[0].headers["x-message-id"],
      to: data.companyEmail,
      corporateReference: data.corporateReference,
    });

    return {
      success: true,
      messageId: response[0].headers["x-message-id"],
    };
  } catch (error) {
    console.error("Error sending corporate account email:", error);
    throw new Error(
      `Failed to send email: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
