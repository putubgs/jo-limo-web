import sgMail from "@sendgrid/mail";
import { generateInvoicePDF } from "./pdf-generator";
import { render } from "@react-email/components";
import InvoiceEmail from "@/emails/InvoiceEmail";
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
  pickupLocation?: string;
  dropoffLocation?: string;
  dateTime?: string;
  mobileNumber?: string;
  flightNumber?: string;
  pickupSign?: string;
  specialRequirements?: string;
  distance?: string;
  distanceLabel?: string;
  serviceClass?: string;
  bookingType?: string;
  referenceCode?: string;
  companyName?: string;
  companyEmail?: string;
  displayDateTime?: string;
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

// Helper functions to get vehicle capacity
function getMaxPassengers(serviceClass?: string): string {
  switch (serviceClass?.toLowerCase()) {
    case "luxury":
      return "3";
    case "mpv":
      return "6";
    case "suv":
      return "6";
    case "executive":
    default:
      return "3";
  }
}

function getMaxLuggage(serviceClass?: string): string {
  switch (serviceClass?.toLowerCase()) {
    case "luxury":
      return "2";
    case "mpv":
      return "6";
    case "suv":
      return "5";
    case "executive":
    default:
      return "2";
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

    const imagesPath = path.join(process.cwd(), "public", "images");
    const passengerIconBuffer = fs.readFileSync(
      path.join(imagesPath, "person-icon.png")
    );
    const luggageIconBuffer = fs.readFileSync(
      path.join(imagesPath, "suitcase-icon.png")
    );

    // Render React Email template with actual booking data
    const isCorporate = data.paymentMethod === "corporate";

    console.log("📧 Email data for rendering:", {
      bookingType: data.bookingType,
      distance: data.distance,
      paymentMethod: data.paymentMethod,
    });

    const htmlTemplate = await render(
      InvoiceEmail({
        customerName: data.customerName.split(" ")[0], // First name only
        bookingNumber: data.bookingNumber,
        dateTime:
          data.dateTime ||
          `${data.bookingDate}, ${data.serviceDescription.match(/starting at (.+?) from/)?.[1] || ""}`,
        pickupLocation:
          data.pickupLocation ||
          data.serviceDescription.match(/from (.+?) to/)?.[1] ||
          "",
        dropoffLocation:
          data.dropoffLocation ||
          data.serviceDescription.match(/to (.+?) \(/)?.[1] ||
          "",
        distance: data.distance || "N/A",
        distanceLabel: data.distanceLabel,
        price: data.totalPrice,
        currency: data.currency,
        vehicleType:
          data.serviceClass ||
          data.serviceDescription.match(/\((.+?)\)/)?.[1] ||
          "Executive",
        maxPassengers: getMaxPassengers(data.serviceClass),
        maxLuggage: getMaxLuggage(data.serviceClass),
        flightNumber: data.flightNumber || "",
        pickupSign: data.pickupSign || "",
        specialRequirements: data.specialRequirements || "",
        guestName: data.customerName,
        mobile: data.mobileNumber || "",
        email: data.customerEmail,
        bookingType: data.bookingType || "one-way",
        referenceCode: data.referenceCode || "",
        companyName: data.companyName || "",
        isCorporate: isCorporate,
        companyEmail: data.companyEmail || "",
        displayDateTime: data.displayDateTime || "",
      })
    );

    // Plain text version
    const textTemplate = `
Dear ${data.customerName.split(" ")[0]},

Thank you for riding with JoLimo! We hope you enjoyed your ride.

Booking number: ${data.bookingNumber}
Date: ${data.bookingDate}
Service: ${data.serviceDescription}
Price: ${data.currency} ${data.totalPrice}

Thank you very much for using our services. We are looking forward to welcoming you again soon.

Best regards,
Your JoLimo Crew

---
Jordan Limousine Services LLC | Queen Alia International Airport Road | Amman, Jordan
Email: tech@jo-limo.com | Phone: +962 6 XXX XXXX | Website: jo-limo.com
    `;

    // Build CC list: always include putubaguswidia@outlook.com, and company email if corporate
    const ccList = ["putubaguswidia@outlook.com"];
    if (isCorporate && data.companyEmail) {
      ccList.push(data.companyEmail);
      console.log("📧 Adding company email to CC:", data.companyEmail);
    }

    console.log("📧 Final CC list:", ccList);
    console.log("📧 Is corporate booking:", isCorporate);
    console.log("📧 Company email:", data.companyEmail);

    // SendGrid email message
    const msg = {
      to: data.customerEmail,
      cc: ccList,
      from: {
        name: "JoLimo - Jordan Limousine Services",
        email: "tech@jo-limo.com",
      },
      replyTo: {
        name: "JoLimo Customer Service",
        email: "tech@jo-limo.com",
      },
      subject: `Your JoLimo Booking Confirmation - Invoice ${data.invoiceNumber}`,
      text: textTemplate,
      html: htmlTemplate,
      categories: ["booking-confirmation", "invoice"],
      customArgs: {
        booking_number: data.bookingNumber,
        invoice_number: data.invoiceNumber,
      },
      headers: {
        "X-Entity-Ref-ID": data.bookingNumber,
        "X-Priority": "1",
        Importance: "high",
        "X-MSMail-Priority": "High",
      },
      trackingSettings: {
        clickTracking: {
          enable: false, // Disable click tracking to avoid link rewriting
        },
        openTracking: {
          enable: true,
        },
      },
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
      companyName: data.companyName,
    });

    console.log("✅ PDF generated, size:", pdfBuffer.length, "bytes");

    // Load images for email
    const logoBuffer = fs.readFileSync(
      path.join(imagesPath, "jolimo-email-logo.png")
    );
    const googlePlayBadgeBuffer = fs.readFileSync(
      path.join(imagesPath, "google-play-badge.png")
    );
    const appStoreBadgeBuffer = fs.readFileSync(
      path.join(imagesPath, "app-store-badge.png")
    );
    const jolimoAppBuffer = fs.readFileSync(
      path.join(imagesPath, "jolimo-app.png")
    );
    const facebookIconBuffer = fs.readFileSync(
      path.join(imagesPath, "facebook-icon.png")
    );
    const xIconBuffer = fs.readFileSync(path.join(imagesPath, "x-icon.png"));
    const instagramIconBuffer = fs.readFileSync(
      path.join(imagesPath, "instagram-icon.png")
    );
    const linkedinIconBuffer = fs.readFileSync(
      path.join(imagesPath, "linkedin-icon.png")
    );

    // Attach PDF and images to email
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
          filename: "jolimo-email-logo.png",
          type: "image/png",
          disposition: "inline",
          content_id: "jolimo-email-logo",
        },
        {
          content: googlePlayBadgeBuffer.toString("base64"),
          filename: "google-play-badge.png",
          type: "image/png",
          disposition: "inline",
          content_id: "google-play-badge",
        },
        {
          content: appStoreBadgeBuffer.toString("base64"),
          filename: "app-store-badge.png",
          type: "image/png",
          disposition: "inline",
          content_id: "app-store-badge",
        },
        {
          content: jolimoAppBuffer.toString("base64"),
          filename: "jolimo-app.png",
          type: "image/png",
          disposition: "inline",
          content_id: "jolimo-app",
        },
        {
          content: facebookIconBuffer.toString("base64"),
          filename: "facebook-icon.png",
          type: "image/png",
          disposition: "inline",
          content_id: "facebook-icon",
        },
        {
          content: xIconBuffer.toString("base64"),
          filename: "x-icon.png",
          type: "image/png",
          disposition: "inline",
          content_id: "x-icon",
        },
        {
          content: instagramIconBuffer.toString("base64"),
          filename: "instagram-icon.png",
          type: "image/png",
          disposition: "inline",
          content_id: "instagram-icon",
        },
        {
          content: linkedinIconBuffer.toString("base64"),
          filename: "linkedin-icon.png",
          type: "image/png",
          disposition: "inline",
          content_id: "linkedin-icon",
        },
        {
          content: passengerIconBuffer.toString("base64"),
          filename: "person-icon.png",
          type: "image/png",
          disposition: "inline",
          content_id: "passenger-icon",
        },
        {
          content: luggageIconBuffer.toString("base64"),
          filename: "suitcase-icon.png",
          type: "image/png",
          disposition: "inline",
          content_id: "luggage-icon",
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
