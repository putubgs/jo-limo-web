import { jsPDF } from "jspdf";
import * as fs from "fs";
import * as path from "path";

export interface InvoicePDFData {
  customerName: string;
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
  companyName?: string;
}

export async function generateInvoicePDF(
  data: InvoicePDFData
): Promise<Buffer> {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Load JoLimo logo
    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "jolimo-logo.png"
    );
    let logoData: string | null = null;

    try {
      const logoBuffer = fs.readFileSync(logoPath);
      logoData = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    } catch (error) {
      console.error("Could not load logo, using text fallback:", error);
    }

    // Determine payment method text
    let paymentText = "";
    if (data.paymentMethod === "credit/debit") {
      paymentText =
        "The amount has been successfully charged to your credit/debit card.";
    } else if (data.paymentMethod === "cash") {
      paymentText =
        "Payment will be collected in cash or by card upon drop-off.";
    } else if (data.paymentMethod === "corporate") {
      paymentText = "This booking will be billed to your corporate account.";
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 15;
    const rightMargin = 15;
    const contentWidth = pageWidth - leftMargin - rightMargin;

    // Header - JoLimo logo
    if (logoData) {
      // Add logo image (smaller size)
      // Using width of 30mm, height will be auto-calculated to maintain aspect ratio
      doc.addImage(logoData, "PNG", leftMargin, 15, 30, 0);
    } else {
      // Fallback to text if logo can't be loaded
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("JOLIMO", leftMargin, 20);
    }

    // Invoice details (right side) - removed customer no.
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const rightX = 140;
    let currentY = 15;

    doc.setFont("helvetica", "bold");
    doc.text("Booking no.", rightX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(data.bookingNumber, rightX + 35, currentY);

    currentY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Booking date", rightX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(data.bookingDate, rightX + 35, currentY);

    currentY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Invoice no.", rightX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(data.invoiceNumber, rightX + 35, currentY);

    currentY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Invoice date", rightX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(data.invoiceDate, rightX + 35, currentY);

    // Customer name (with more top padding)
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(data.customerName, leftMargin, 70);

    // Company name for corporate bookings
    if (data.companyName) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Company: ${data.companyName}`, leftMargin, 78);
    }

    // Invoice title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", leftMargin, 90);

    // Table - matching the exact design from the image with column lines
    const tableTop = 100;
    const tableWidth = contentWidth;

    // Define column positions
    const col1Width = 20; // # column
    const col2Width = 40; // Quantity column
    const col3Width = tableWidth - col1Width - col2Width - 45; // Description (flexible)

    const col1X = leftMargin;
    const col2X = col1X + col1Width;
    const col3X = col2X + col2Width;
    const col4X = col3X + col3Width;

    // Set grey color for all lines
    doc.setDrawColor(180, 180, 180);

    // Table header (full width gray background)
    doc.setFillColor(204, 204, 204);
    doc.rect(col1X, tableTop, tableWidth, 10, "FD");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("#", col1X + 3, tableTop + 7);
    doc.text("Quantity", col2X + 3, tableTop + 7);
    doc.text("Description", col3X + 3, tableTop + 7);
    doc.text("Price", col4X + 3, tableTop + 7);

    // Draw vertical lines for header
    doc.line(col2X, tableTop, col2X, tableTop + 10);
    doc.line(col3X, tableTop, col3X, tableTop + 10);
    doc.line(col4X, tableTop, col4X, tableTop + 10);

    // Service row (white background with borders)
    let rowY = tableTop + 10;
    const descLines = doc.splitTextToSize(
      data.serviceDescription,
      col3Width - 6
    );
    const descHeight = descLines.length * 5 + 14;

    // Draw borders for service row
    doc.rect(col1X, rowY, tableWidth, descHeight, "S");

    // Vertical lines for service row
    doc.line(col2X, rowY, col2X, rowY + descHeight);
    doc.line(col3X, rowY, col3X, rowY + descHeight);
    doc.line(col4X, rowY, col4X, rowY + descHeight);

    doc.setFont("helvetica", "normal");
    doc.text("1", col1X + 3, rowY + 7);
    doc.text("1", col2X + 3, rowY + 7);
    doc.text(descLines, col3X + 3, rowY + 7);
    doc.text(`${data.netPrice} ${data.currency}`, col4X + 3, rowY + 7);

    // Net price total row (white background, no # and Quantity columns)
    rowY += descHeight;

    // Draw borders for net price row
    doc.rect(col1X, rowY, tableWidth, 12, "S");
    doc.line(col3X, rowY, col3X, rowY + 12);
    doc.line(col4X, rowY, col4X, rowY + 12);

    doc.setFont("helvetica", "bold");
    doc.text("Net price total (incl. tax)", col1X + 3, rowY + 8);
    doc.text(`${data.netPrice} ${data.currency}`, col4X + 3, rowY + 8);

    // Price total row (full width gray background, no # and Quantity columns)
    rowY += 12;
    doc.setFillColor(204, 204, 204);
    doc.rect(col1X, rowY, tableWidth, 10, "FD");

    // Vertical lines for price total row
    doc.line(col3X, rowY, col3X, rowY + 10);
    doc.line(col4X, rowY, col4X, rowY + 10);

    doc.setFont("helvetica", "bold");
    doc.text("Price total", col1X + 3, rowY + 7);
    doc.text(`${data.totalPrice} ${data.currency}`, col4X + 3, rowY + 7);

    // Payment info
    rowY += 20;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const paymentLines = doc.splitTextToSize(paymentText, contentWidth);
    doc.text(paymentLines, leftMargin, rowY);

    // Closing
    rowY += paymentLines.length * 5 + 10;
    const closingText =
      "Thank you very much for using our services. We are looking forward to welcoming you again soon.";
    const closingLines = doc.splitTextToSize(closingText, contentWidth);
    doc.text(closingLines, leftMargin, rowY);

    rowY += closingLines.length * 5 + 8;
    doc.text("Best regards,", leftMargin, rowY);
    doc.text("Your JoLimo team", leftMargin, rowY + 5);

    // Footer
    const footerY = 260;
    doc.setDrawColor(204, 204, 204);
    doc.line(leftMargin, footerY, pageWidth - rightMargin, footerY);

    doc.setFontSize(7);
    doc.setTextColor(102, 102, 102);

    doc.setFont("helvetica", "bold");
    doc.text("Jordan Limousine Services LLC", leftMargin, footerY + 4);
    doc.setFont("helvetica", "normal");
    doc.text(
      " | Queen Alia International Airport Road | Amman, Jordan",
      leftMargin + 38,
      footerY + 4
    );

    doc.setFont("helvetica", "bold");
    doc.text("Contact Details", leftMargin, footerY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(
      " | Email: tech@jo-limo.com | Phone: +962 6 XXX XXXX | Website: jo-limo.com",
      leftMargin + 18,
      footerY + 8
    );

    doc.setFont("helvetica", "bold");
    doc.text("Managing Directors", leftMargin, footerY + 12);
    doc.setFont("helvetica", "normal");
    doc.text(
      " | Mr Zaid Abu Samra",
      leftMargin + 23,
      footerY + 12
    );

    doc.setFont("helvetica", "normal");
    doc.text(
      "Register Court Amman | VAT No.: XXXXXXXXX",
      leftMargin,
      footerY + 16
    );

    // Convert to buffer
    const pdfArrayBuffer = doc.output("arraybuffer");
    return Buffer.from(pdfArrayBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
