import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { sendCorporateAccountEmail } from "@/utils/email";

interface CorporateAccountData {
  corporate_reference: string;
  company_name: string;
  company_website: string;
  company_address: string;
  company_email: string;
  phone_number: string;
  billing_address: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: CorporateAccountData = await request.json();

    // Validate required fields
    const requiredFields = [
      "corporate_reference",
      "company_name",
      "company_email",
      "company_address",
      "phone_number",
      "billing_address",
      "password",
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof CorporateAccountData]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Check if corporate account already exists
    const { data: existingAccount, error: checkError } = await supabase
      .from("corporateaccount")
      .select("company_id")
      .or(
        `corporate_reference.eq.${data.corporate_reference},company_email.eq.${data.company_email}`
      )
      .single();

    if (existingAccount && !checkError) {
      return NextResponse.json(
        {
          error:
            "Corporate account with this reference or email already exists",
        },
        { status: 409 }
      );
    }

    // Create new corporate account
    const { data: newAccount, error: createError } = await supabase
      .from("corporateaccount")
      .insert({
        corporate_reference: data.corporate_reference,
        company_name: data.company_name,
        company_website: data.company_website || "-",
        company_address: data.company_address,
        company_email: data.company_email,
        phone_number: data.phone_number,
        billing_address: data.billing_address,
        corporate_password: hashedPassword,
      })
      .select("*")
      .single();

    if (createError) {
      console.error("Error creating corporate account:", createError);
      return NextResponse.json(
        {
          error: "Failed to create corporate account",
          details: createError.message,
          code: createError.code,
          hint: createError.hint,
        },
        { status: 500 }
      );
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { corporate_password: _, ...accountWithoutPassword } = newAccount;

    // Send email notification
    try {
      await sendCorporateAccountEmail({
        corporateReference: newAccount.corporate_reference,
        companyName: newAccount.company_name,
        companyEmail: newAccount.company_email,
        password: data.password, // Use the original password before hashing
        companyAddress: newAccount.company_address,
        phoneNumber: newAccount.phone_number,
      });

      console.log(
        `Email notification sent to ${newAccount.company_email} for account ${newAccount.corporate_reference}`
      );
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the account creation if email fails
      // You might want to queue this for retry or log it for manual sending
    }

    return NextResponse.json({
      success: true,
      message: "Corporate account created successfully",
      account: accountWithoutPassword,
    });
  } catch (error) {
    console.error("Create corporate account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
