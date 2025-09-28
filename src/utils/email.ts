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
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #000000;
              padding-bottom: 20px;
              margin-bottom: 30px;
              background-color: #000000;
              color: #ffffff;
              padding: 30px 20px;
              border-radius: 10px 10px 0 0;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #ffffff;
              margin-bottom: 15px;
            }
            .logo-img {
              max-width: 150px;
              height: auto;
              margin-bottom: 15px;
            }
            .subtitle {
              color: #ffffff;
              font-size: 16px;
              opacity: 0.9;
            }
            .content {
              margin-bottom: 30px;
            }
            .credentials-box {
              background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
              border: 2px solid #000000;
              border-radius: 12px;
              padding: 40px;
              margin: 40px auto;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
              text-align: center;
              max-width: 500px;
            }
            .credentials-title {
              color: #ffffff;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 30px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .credential-item {
              display: block;
              text-align: center;
              padding: 20px 0;
              border-bottom: 1px solid #333333;
            }
            .credential-item:last-child {
              border-bottom: none;
            }
            .credential-label {
              font-weight: 600;
              color: #ffffff;
              font-size: 18px;
              display: block;
              margin-bottom: 10px;
            }
            .credential-value {
              font-family: 'Courier New', monospace;
              background-color: #ffffff;
              padding: 15px 20px;
              border-radius: 8px;
              border: 2px solid #000000;
              font-weight: bold;
              color: #000000;
              font-size: 18px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              display: inline-block;
              min-width: 200px;
            }
            .company-info {
              background-color: #eff6ff;
              border-left: 4px solid #2563eb;
              padding: 20px;
              margin: 20px 0;
              border-radius: 0 8px 8px 0;
            }
            .info-item {
              margin: 8px 0;
            }
            .info-label {
              font-weight: 600;
              color: #1e40af;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding: 30px 20px;
              background-color: #000000;
              color: #ffffff;
              font-size: 14px;
              border-radius: 0 0 10px 10px;
            }
            .footer p {
              margin: 8px 0;
              color: #ffffff;
            }
            .footer a {
              color: #ffffff;
              text-decoration: underline;
            }
            .warning {
              background-color: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              color: #92400e;
            }
            .warning-icon {
              font-weight: bold;
              margin-right: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://jo-limo.com/images/jolimo-app-logo.png" alt="Jo Limo" class="logo-img" />
              <div class="logo">Jo Limo</div>
              <div class="subtitle">Corporate Account Created Successfully</div>
            </div>

            <div class="content">
              <p>Dear ${data.companyName} Team,</p>
              
              <p>We are pleased to inform you that your corporate account has been successfully created with Jo Limo. You can now access our premium corporate transportation services.</p>

              <div class="credentials-box">
                <div class="credentials-title">Your Account Credentials</div>
                <div class="credential-item">
                  <span class="credential-label">Corporate Reference:</span>
                  <span class="credential-value">${data.corporateReference}</span>
                </div>
                <div class="credential-item">
                  <span class="credential-label">Account Password:</span>
                  <span class="credential-value">${data.password}</span>
                </div>
              </div>

              <div class="warning">
                <span class="warning-icon">⚠️</span>
                <strong>Important:</strong> Please save these credentials securely. Your corporate reference and password are required for all corporate bookings and account management.
              </div>

              <p>You can now:</p>
              <ul>
                <li>Make corporate bookings through our platform</li>
                <li>Access corporate rates and special services</li>
                <li>Manage your transportation preferences</li>
                <li>View booking history and invoices</li>
              </ul>

              <p>Visit our website at <a href="https://jo-limo.com" style="color: #000000; font-weight: bold;">jo-limo.com</a> to explore our full range of premium transportation services.</p>

              <p>If you have any questions or need assistance, please don't hesitate to contact our corporate services team.</p>

              <p>Welcome to Jo Limo!</p>
            </div>

            <div class="footer">
              <p><strong>Jo Limo Corporate Services</strong></p>
              <p>Website: <a href="https://jo-limo.com" style="color: #ffffff; text-decoration: underline;">jo-limo.com</a></p>
              <p>Email: tech@jo-limo.com | Phone: +962 6 XXX XXXX</p>
              <p>© 2025 Jordan Limousine Services LLC. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain text version
    const textTemplate = `
Jo Limo - Corporate Account Created Successfully

Dear ${data.companyName} Team,

Your corporate account has been successfully created with Jo Limo.

ACCOUNT CREDENTIALS:
Corporate Reference: ${data.corporateReference}
Account Password: ${data.password}

IMPORTANT: Please save these credentials securely. Your corporate reference and password are required for all corporate bookings and account management.

You can now:
- Make corporate bookings through our platform
- Access corporate rates and special services
- Manage your transportation preferences
- View booking history and invoices

Visit our website at jo-limo.com to explore our full range of premium transportation services.

If you have any questions or need assistance, please contact our corporate services team.

Welcome to Jo Limo!

---
Jo Limo Corporate Services
Website: jo-limo.com
Email: tech@jo-limo.com
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
