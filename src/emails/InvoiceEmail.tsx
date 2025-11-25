import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InvoiceEmailProps {
  customerName?: string;
  bookingNumber?: string;
  dateTime?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  distance?: string;
  distanceLabel?: string;
  price?: string;
  currency?: string;
  vehicleType?: string;
  maxPassengers?: string;
  maxLuggage?: string;
  flightNumber?: string;
  pickupSign?: string;
  specialRequirements?: string;
  guestName?: string;
  mobile?: string;
  email?: string;
  bookingType?: string; // "one-way" or "by-hour"
  referenceCode?: string;
  companyName?: string;
  isCorporate?: boolean;
  companyEmail?: string;
  displayDateTime?: string;
  paymentMethod?: "credit/debit" | "cash" | "corporate";
}

export const InvoiceEmail = ({
  customerName = "Zaid",
  bookingNumber = "396808735",
  dateTime = "24 Nov 2024 08:00 (08:00 AM)",
  displayDateTime,
  pickupLocation = "Hotel Park Hyatt, Am Hof 2, Vienna, Austria, 1010, Am Hof 2, 1010 Vienna",
  dropoffLocation = "Vienna International Airport, 1300 Schwechat, Lower Austria",
  distance = "ca. 20 km",
  price = "108.08",
  currency = "EUR",
  vehicleType = "Business Van/SUV",
  maxPassengers = "5",
  maxLuggage = "5",
  flightNumber = "OS 853",
  pickupSign = "Zaid Abu Samra",
  specialRequirements = "Room number 124",
  guestName = "Mr. Zaid Abu Samra",
  mobile = "+962796272727",
  email = "zaidabusamra@gmail.com",
  bookingType = "one-way",
  distanceLabel = "",
  referenceCode = "",
  companyName = "",
  isCorporate = false,
  companyEmail = "",
  paymentMethod = "cash",
}: InvoiceEmailProps) => {
  // Determine if this is a by-hour booking
  const normalizedDistance = distance?.toLowerCase() ?? "";
  const isByHour =
    bookingType === "by-hour" ||
    normalizedDistance.includes("hour") ||
    normalizedDistance.includes("hrs");
  const effectiveLabel = distanceLabel || (isByHour ? "Duration" : "Distance");
  const distanceValue = distance || "N/A";

  // Determine payment text based on payment method
  let paymentText = "";
  if (paymentMethod === "credit/debit") {
    paymentText =
      "Your payment has been successfully processed through our secure payment gateway. The amount has been charged to your credit/debit card. Please find your invoice attached to this email.";
  } else if (paymentMethod === "cash") {
    paymentText =
      "Payment will be collected in cash or by card upon drop-off. No advance payment is required. Please find your invoice attached to this email.";
  } else if (paymentMethod === "corporate") {
    paymentText =
      "This booking will be billed to your corporate account. No payment action is required from you. Please find your invoice attached to this email.";
  }

  return (
    <Html>
      <Head />
      <Preview>Thank you for riding with JoLimo!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td align="center">
                  <Img
                    src="cid:jolimo-email-logo"
                    width="200"
                    alt="JoLimo"
                    style={logo}
                  />
                </td>
              </tr>
            </table>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Text style={paragraph}>Dear {customerName},</Text>

            <Text style={paragraph}>
              Thank you for riding with JoLimo! We hope you enjoyed your ride.
            </Text>

            <Text style={paragraph}>
              Your feedback enables us to improve our service. We appreciate
              your business and look forward to serving you again.
            </Text>

            <Text style={paragraph}>{paymentText}</Text>

            {/* Booking Details Table */}
            <Section style={detailsBox}>
              <table style={detailsTable}>
                <tbody>
                  <tr>
                    <td style={detailLabel}>Booking number:</td>
                    <td style={detailValue}>{bookingNumber}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Date and time:</td>
                    <td style={detailValue}>
                      {displayDateTime || dateTime || "-"}
                    </td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>From:</td>
                    <td style={detailValue}>{pickupLocation}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>To:</td>
                    <td style={detailValue}>{dropoffLocation}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>{effectiveLabel}:</td>
                    <td style={detailValue}>{distanceValue}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Price:</td>
                    <td style={detailValue}>
                      {currency} {price} *
                    </td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Vehicle type:</td>
                    <td style={detailValue}>
                      {vehicleType} &nbsp;&nbsp;
                      <table
                        width="16"
                        cellPadding="0"
                        cellSpacing="0"
                        style={{
                          display: "inline-block",
                          marginRight: "4px",
                          verticalAlign: "middle",
                          width: "16px",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              width="16"
                              style={{ width: "16px", height: "16px" }}
                            >
                              <Img
                                src="cid:passenger-icon"
                                width="16"
                                height="16"
                                alt="Passengers"
                                style={{
                                  display: "block",
                                  width: "16px",
                                  height: "16px",
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      max. {maxPassengers} &nbsp;&nbsp;
                      <table
                        width="16"
                        cellPadding="0"
                        cellSpacing="0"
                        style={{
                          display: "inline-block",
                          marginRight: "4px",
                          verticalAlign: "middle",
                          width: "16px",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              width="16"
                              height="16"
                              style={{ width: "16px", height: "16px" }}
                            >
                              <Img
                                src="cid:luggage-icon"
                                width="16"
                                height="16"
                                alt="Luggage"
                                style={{
                                  display: "block",
                                  width: "16px",
                                  height: "16px",
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      max. {maxLuggage}
                    </td>
                  </tr>
                  {flightNumber ? (
                    <tr>
                      <td style={detailLabel}>Flight number:</td>
                      <td style={detailValue}>{flightNumber}</td>
                    </tr>
                  ) : null}
                  {pickupSign ? (
                    <tr>
                      <td style={detailLabel}>Pickup sign:</td>
                      <td style={detailValue}>{pickupSign}</td>
                    </tr>
                  ) : null}
                  <tr>
                    <td style={detailLabel}>Special requirements:</td>
                    <td style={detailValue}>{specialRequirements || "-"}</td>
                  </tr>
                  {referenceCode ? (
                    <tr>
                      <td style={detailLabel}>Reference code:</td>
                      <td style={detailValue}>{referenceCode}</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>

              <Hr style={divider} />

              <table style={detailsTable}>
                <tbody>
                  <tr>
                    <td style={detailLabel}>Guest:</td>
                    <td style={detailValue}>{guestName}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Mobile:</td>
                    <td style={detailValue}>{mobile}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Email:</td>
                    <td style={detailValue}>
                      <Link href={`mailto:${email}`} style={link}>
                        {email}
                      </Link>
                    </td>
                  </tr>
                  {isCorporate && companyName ? (
                    <>
                      <tr>
                        <td style={detailLabel}>Company:</td>
                        <td style={detailValue}>{companyName}</td>
                      </tr>
                      {companyEmail ? (
                        <tr>
                          <td style={detailLabel}>Company email:</td>
                          <td style={detailValue}>
                            <Link href={`mailto:${companyEmail}`} style={link}>
                              {companyEmail}
                            </Link>
                          </td>
                        </tr>
                      ) : null}
                      <tr>
                        <td style={detailLabel}>Billing:</td>
                        <td style={detailValue}>
                          Corporate billing through {companyName}
                        </td>
                      </tr>
                    </>
                  ) : null}
                </tbody>
              </table>

              <Text style={footnote}>
                * All prices include statutory taxes, if applicable.
              </Text>
            </Section>

            {/* Closing */}
            <Text style={paragraph}>
              Best regards,
              <br />
              Your JoLimo Crew
            </Text>
          </Section>

          {/* App Download Section */}
          <Section style={appSection}>
            <table width="100%">
              <tr>
                <td style={appTextColumn}>
                  <Heading as="h3" style={appHeading}>
                    Download the app
                  </Heading>
                  <Text style={appText}>
                    Easily book, change, or cancel rides on the go.
                  </Text>
                  <table cellPadding="0" cellSpacing="0">
                    <tr>
                      <td style={{ paddingRight: "8px", paddingBottom: "8px" }}>
                        <table
                          width="135"
                          cellPadding="0"
                          cellSpacing="0"
                          style={{ width: "135px" }}
                        >
                          <tbody>
                            <tr>
                              <td
                                width="135"
                                style={{ width: "135px", height: "40px" }}
                              >
                                <Img
                                  src="cid:google-play-badge"
                                  width="135"
                                  height="40"
                                  alt="Get it on Google Play"
                                  style={{
                                    display: "block",
                                    width: "135px",
                                    height: "40px",
                                  }}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td style={{ paddingBottom: "8px" }}>
                        <table
                          width="120"
                          cellPadding="0"
                          cellSpacing="0"
                          style={{ width: "120px" }}
                        >
                          <tbody>
                            <tr>
                              <td
                                width="120"
                                style={{ width: "120px", height: "40px" }}
                              >
                                <Img
                                  src="cid:app-store-badge"
                                  width="120"
                                  height="40"
                                  alt="Download on the App Store"
                                  style={{
                                    display: "block",
                                    width: "120px",
                                    height: "40px",
                                  }}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style={appImageColumn}>
                  <table
                    width="180"
                    cellPadding="0"
                    cellSpacing="0"
                    style={{
                      width: "180px",
                      marginLeft: "auto",
                      marginRight: "0",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          width="180"
                          style={{
                            width: "180px",
                            height: "auto",
                            paddingLeft: "20px",
                            paddingRight: "20px",
                          }}
                        >
                          <Img
                            src="cid:jolimo-app"
                            width="140"
                            height="auto"
                            alt="JoLimo App"
                            style={{
                              display: "block",
                              width: "140px",
                              height: "auto",
                              maxWidth: "140px",
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </table>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions? Contact us at{" "}
              <Link href="mailto:tech@jo-limo.com" style={footerLink}>
                tech@jo-limo.com
              </Link>{" "}
              or call our 24/7 Service Hotlines:
            </Text>

            <Text style={footerText}>
              +962 6 XXX XXXX
              <br />
              +962 6 XXX XXXX
              {/* <br />
              US: +1 415 429 1027
              <br />
              UK: +44 20 3318 0507
              <br />
              DE: +49 30 2016 3020
              <br />
              FR: +33 1 8488 9352 */}
            </Text>

            <table
              cellPadding="0"
              cellSpacing="0"
              style={{ margin: "20px auto" }}
            >
              <tr>
                <td style={{ padding: "0 10px" }}>
                  <Img
                    src="cid:facebook-icon"
                    width="28"
                    height="28"
                    alt="Facebook"
                    style={{
                      display: "block",
                      width: "28px",
                      height: "28px",
                    }}
                  />
                </td>
                <td style={{ padding: "0 10px" }}>
                  <Img
                    src="cid:x-icon"
                    width="28"
                    height="28"
                    alt="X"
                    style={{
                      display: "block",
                      width: "28px",
                      height: "28px",
                    }}
                  />
                </td>
                <td style={{ padding: "0 10px" }}>
                  <Img
                    src="cid:instagram-icon"
                    width="28"
                    height="28"
                    alt="Instagram"
                    style={{
                      display: "block",
                      width: "28px",
                      height: "28px",
                    }}
                  />
                </td>
                <td style={{ padding: "0 10px" }}>
                  <Img
                    src="cid:linkedin-icon"
                    width="28"
                    height="28"
                    alt="LinkedIn"
                    style={{
                      display: "block",
                      width: "28px",
                      height: "28px",
                    }}
                  />
                </td>
              </tr>
            </table>

            <Text style={footerSmall}>
              Jordan Limousine Services LLC
              <br />
              Queen Alia International Airport Road | Amman, Jordan
              <br />
              Managing Directors: Mr Zaid Abu Samra
              <br />
              Register court: Amman | Registration No. XXXXXX
              <br />
              B. VAT No.: XXXXXXXXX
              <br />
              <br />
              This is a transactional email confirming your booking. You
              received this because you made a reservation with JoLimo.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default InvoiceEmail;

// Styles
const main = {
  backgroundColor: "#f6f6f6",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#000000",
  padding: "30px 20px",
  textAlign: "center" as const,
};

const logo = {
  display: "block",
  width: "200px",
  height: "auto",
  maxWidth: "200px",
};

const content = {
  padding: "30px 40px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#333333",
  margin: "16px 0",
};

const link = {
  color: "#e74c3c",
  textDecoration: "none",
};

const detailsBox = {
  backgroundColor: "#f9f9f9",
  border: "1px solid #e0e0e0",
  borderRadius: "4px",
  padding: "20px",
  margin: "24px 0",
};

const detailsTable = {
  width: "100%",
  fontSize: "13px",
  lineHeight: "20px",
};

const detailLabel = {
  color: "#666666",
  paddingRight: "16px",
  paddingBottom: "8px",
  verticalAlign: "top" as const,
  fontWeight: "bold" as const,
  width: "180px",
};

const detailValue = {
  color: "#333333",
  paddingBottom: "8px",
  verticalAlign: "top" as const,
};

const divider = {
  borderColor: "#e0e0e0",
  margin: "16px 0",
};

const footnote = {
  fontSize: "11px",
  color: "#999999",
  marginTop: "16px",
  fontStyle: "italic" as const,
};

const appSection = {
  backgroundColor: "#3a3a3a",
  padding: "40px 30px",
  color: "#ffffff",
};

const appTextColumn = {
  verticalAlign: "middle" as const,
  paddingRight: "20px",
};

const appImageColumn = {
  verticalAlign: "middle" as const,
  textAlign: "right" as const,
  width: "200px",
};

const appHeading = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold" as const,
  margin: "0 0 12px 0",
};

const appText = {
  color: "#ffffff",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 20px 0",
};

const footer = {
  backgroundColor: "#f0f0f0",
  padding: "30px 40px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  lineHeight: "18px",
  color: "#666666",
  margin: "12px 0",
};

const footerLink = {
  color: "#e74c3c",
  textDecoration: "none",
};

const footerSmall = {
  fontSize: "10px",
  lineHeight: "16px",
  color: "#999999",
  margin: "16px 0",
};
