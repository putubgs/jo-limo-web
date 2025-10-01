import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import sgMail from "@sendgrid/mail";

export async function POST(request: NextRequest) {
  try {
    const {
      company_name,
      company_website,
      company_email,
      phone_number,
      company_address,
      billing_address,
    } = await request.json();

    // Validate required fields
    if (
      !company_name ||
      !company_website ||
      !company_email ||
      !phone_number ||
      !company_address ||
      !billing_address
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(company_email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());

    // Check if company email already exists
    const { data: existingAccount } = await supabase
      .from("corporateaccount")
      .select("company_email")
      .eq("company_email", company_email)
      .single();

    if (existingAccount) {
      return NextResponse.json(
        { error: "A corporate account with this email already exists" },
        { status: 409 }
      );
    }

    // Configure SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

    // Send simple text email with application details
    try {
      const emailContent = `
New Corporate Account Registration

Company Name: ${company_name}
Company Website: ${company_website}
Company Email: ${company_email}
Phone Number: ${phone_number}
Company Address: ${company_address}
Billing Address: ${billing_address}
`.trim();

      const msg = {
        to: "b2b@jo-limo.com",
        from: {
          name: "Jordan Limousine Services LLC",
          email: "tech@jo-limo.com",
        },
        subject: `New Corporate Registration - ${company_name}`,
        text: emailContent,
      };

      await sgMail.send(msg);
      console.log("Registration email sent successfully to admin");
    } catch (emailError) {
      console.error("Error sending registration email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Corporate registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
