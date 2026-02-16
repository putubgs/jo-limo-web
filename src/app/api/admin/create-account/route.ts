import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { sendCorporateAccountEmail } from "@/utils/email";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/jwt";

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
          { status: 400 },
        );
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 🔎 Check if corporate account already exists
    const existingAccount = await prisma.corporateaccount.findFirst({
      where: {
        OR: [
          { corporate_reference: data.corporate_reference },
          { company_email: data.company_email },
        ],
      },
      select: {
        company_id: true,
      },
    });

    if (existingAccount) {
      return NextResponse.json(
        {
          error:
            "Corporate account with this reference or email already exists",
        },
        { status: 409 },
      );
    }

    // Create new corporate account
    const newAccount = await prisma.corporateaccount.create({
      data: {
        corporate_reference: data.corporate_reference,
        company_name: data.company_name,
        company_website: data.company_website || "-",
        company_address: data.company_address,
        company_email: data.company_email,
        phone_number: data.phone_number,
        billing_address: data.billing_address,
        corporate_password: hashedPassword,
      },
      select: {
        company_id: true,
        corporate_reference: true,
        company_name: true,
        company_website: true,
        company_address: true,
        company_email: true,
        phone_number: true,
        billing_address: true,
        created_at: true, // if you have timestamps
      },
    });

    // Send email notification
    try {
      await sendCorporateAccountEmail({
        corporateReference: newAccount.corporate_reference!,
        companyName: newAccount.company_name!,
        companyEmail: newAccount.company_email!,
        password: data.password,
        companyAddress: newAccount.company_address!,
        phoneNumber: newAccount.phone_number!,
      });

      console.log(
        `Email notification sent to ${newAccount.company_email} for account ${newAccount.corporate_reference}`,
      );
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the account creation if email fails
      // You might want to queue this for retry or log it for manual sending
    }

    return NextResponse.json({
      success: true,
      message: "Corporate account created successfully",
      account: newAccount,
    });
  } catch (error) {
    console.error("Create corporate account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
