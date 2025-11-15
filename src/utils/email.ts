import sgMail from "@sendgrid/mail";
import { generateInvoicePDF } from "./pdf-generator";
import * as fs from "fs";
import * as path from "path";

interface CorporateAccountEmailData {
  corporateReference: string;
  companyEmail: string;
  password: string;
  companyName: string;
  companyAddress: string;
  phoneNumber: string;
}

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

export async function sendInvoiceEmail(data: InvoiceEmailData) {
  try {
    console.log("📧 sendInvoiceEmail called with data:", {
      customerEmail: data.customerEmail,
      invoiceNumber: data.invoiceNumber,
      paymentMethod: data.paymentMethod,
    });

    // Configure SendGrid
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error("❌ SENDGRID_API_KEY not found in environment variables");
      throw new Error("SendGrid API key not configured");
    }
    console.log("✅ SendGrid API key found");
    sgMail.setApiKey(apiKey);

    // Determine payment method text
    let paymentText = "";
    if (data.paymentMethod === "credit/debit") {
      paymentText = `The amount has been successfully charged to your credit/debit card.`;
    } else if (data.paymentMethod === "cash") {
      paymentText = `Payment will be collected in cash or by card upon drop-off.`;
    } else if (data.paymentMethod === "corporate") {
      paymentText = `This booking will be billed to your corporate account.`;
    }
    console.log("📧 Payment text:", paymentText);

    // Email HTML template matching Blacklane design
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice - Jo Limo</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #000000;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              background-color: #ffffff;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 60px;
            }
            .logo img {
              max-height: 40px;
              width: auto;
              max-width: 150px;
            }
            .invoice-info {
              text-align: right;
              font-size: 14px;
              line-height: 1.8;
            }
            .invoice-info div {
              margin-bottom: 4px;
            }
            .customer-name {
              margin-bottom: 80px;
              font-size: 16px;
            }
            .invoice-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 40px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            th {
              background-color: #cccccc;
              padding: 12px;
              text-align: left;
              font-weight: bold;
              font-size: 14px;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #eeeeee;
              font-size: 14px;
            }
            .description-cell {
              max-width: 400px;
            }
            .total-row {
              background-color: #cccccc;
              font-weight: bold;
            }
            .payment-info {
              margin: 30px 0;
              font-size: 14px;
            }
            .closing {
              margin: 40px 0;
              font-size: 14px;
            }
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #cccccc;
              font-size: 11px;
              line-height: 1.6;
              color: #666666;
            }
            .footer-line {
              margin-bottom: 4px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <img src="cid:jolimo-logo" alt="JoLimo" />
            </div>
            <div class="invoice-info">
              <div><strong>Booking no.</strong> ${data.bookingNumber}</div>
              <div><strong>Booking date</strong> ${data.bookingDate}</div>
              <div><strong>Invoice no.</strong> ${data.invoiceNumber}</div>
              <div><strong>Invoice date</strong> ${data.invoiceDate}</div>
            </div>
          </div>

          <div class="customer-name">
            ${data.customerName}
          </div>

          <div class="invoice-title">Invoice</div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Quantity</th>
                <th>Description</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>1</td>
                <td class="description-cell">${data.serviceDescription}</td>
                <td style="text-align: right;">${data.netPrice} ${data.currency}</td>
              </tr>
              <tr>
                <td colspan="2"></td>
                <td style="padding: 12px;"><strong>Net price total (incl. tax)</strong></td>
                <td style="text-align: right; padding: 12px;"><strong>${data.netPrice} ${data.currency}</strong></td>
              </tr>
              <tr class="total-row">
                <td colspan="2"></td>
                <td style="padding: 12px;"><strong>Price total</strong></td>
                <td style="text-align: right; padding: 12px;"><strong>${data.totalPrice} ${data.currency}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="payment-info">
            ${paymentText}
          </div>

          <div class="closing">
            Thank you very much for using our services. We are looking forward to welcoming you again soon.
            <br><br>
            Best regards,<br>
            Your JoLimo team
          </div>

          <div class="footer">
            <div class="footer-line"><strong>Jordan Limousine Services LLC</strong> | Queen Alia International Airport Road | Amman, Jordan</div>
            <div class="footer-line"><strong>Contact Details</strong> | Email: tech@jo-limo.com | Phone: +962 6 XXX XXXX | Website: jo-limo.com</div>
            <div class="footer-line"><strong>Managing Directors</strong> | Jordan Limousine Services Management</div>
            <div class="footer-line">Register Court Amman | VAT No.: XXXXXXXXX</div>
          </div>
        </body>
      </html>
    `;

    // Plain text version
    const textTemplate = `
JOLIMO - INVOICE

Customer no.: ${data.customerNumber}
Booking no.: ${data.bookingNumber}
Booking date: ${data.bookingDate}
Invoice no.: ${data.invoiceNumber}
Invoice date: ${data.invoiceDate}

${data.customerName}

INVOICE

# | Quantity | Description | Price
1 | 1 | ${data.serviceDescription} | ${data.netPrice} ${data.currency}

Net price total: ${data.netPrice} ${data.currency}
Sales Tax 10%: ${data.taxAmount} ${data.currency}
Price total: ${data.totalPrice} ${data.currency}

${paymentText}

Thank you very much for using our services. We are looking forward to welcoming you again soon.

Best regards,
Your JoLimo team

---
Jordan Limousine Services LLC | Queen Alia International Airport Road | Amman, Jordan
Email: tech@jo-limo.com | Phone: +962 6 XXX XXXX | Website: jo-limo.com
    `;

    // SendGrid email message
    const msg = {
      to: data.customerEmail,
      from: {
        name: "Jordan Limousine Services LLC",
        email: "tech@jo-limo.com",
      },
      subject: `Invoice ${data.invoiceNumber} - Jo Limo`,
      text: textTemplate,
      html: htmlTemplate,
    };

    console.log("📧 Generating PDF invoice...");

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF({
      customerName: data.customerName,
      invoiceNumber: data.invoiceNumber,
      bookingNumber: data.bookingNumber,
      bookingDate: data.bookingDate,
      invoiceDate: data.invoiceDate,
      customerNumber: data.customerNumber,
      serviceDescription: data.serviceDescription,
      netPrice: data.netPrice,
      taxAmount: data.taxAmount,
      totalPrice: data.totalPrice,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
    });

    console.log("✅ PDF generated, size:", pdfBuffer.length, "bytes");

    // Load logo image for email
    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "jolimo-logo.png"
    );
    const logoBuffer = fs.readFileSync(logoPath);

    // Attach PDF and logo to email
    const msgWithAttachment = {
      ...msg,
      attachments: [
        {
          content: pdfBuffer.toString("base64"),
          filename: `Invoice-${data.invoiceNumber}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
        {
          content: logoBuffer.toString("base64"),
          filename: "jolimo-logo.png",
          type: "image/png",
          disposition: "inline",
          content_id: "jolimo-logo",
        },
      ],
    };

    console.log(
      "📧 Attempting to send email via SendGrid to:",
      data.customerEmail
    );
    console.log("📧 From:", msg.from.email);
    console.log("📧 Subject:", msg.subject);
    console.log("📧 PDF attached:", `Invoice-${data.invoiceNumber}.pdf`);

    // Send email
    const response = await sgMail.send(msgWithAttachment);

    console.log("✅ Invoice email sent successfully via SendGrid:", {
      messageId: response[0].headers["x-message-id"],
      to: data.customerEmail,
      invoiceNumber: data.invoiceNumber,
      statusCode: response[0].statusCode,
    });

    return {
      success: true,
      messageId: response[0].headers["x-message-id"],
    };
  } catch (error) {
    console.error("❌ Error sending invoice email:", error);
    if (error instanceof Error) {
      console.error("❌ Error details:", error.message);
      console.error("❌ Error stack:", error.stack);
    }
    throw new Error(
      `Failed to send invoice email: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
