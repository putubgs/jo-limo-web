import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/jwt";

interface CorporateAccountData {
  corporate_reference?: string;
  company_name?: string;
  company_website?: string;
  company_address?: string;
  company_email?: string;
  phone_number?: string;
  billing_address?: string;
  password?: string;
}

// GET - Fetch single corporate account
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const account = await prisma.corporateaccount.findUnique({
      where: {
        company_id: id,
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
        created_at: true,
        updated_at: true,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Corporate account not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      account,
    });
  } catch (error) {
    console.error("Get corporate account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update corporate account
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const existingAccount = await prisma.corporateaccount.findUnique({
      where: { company_id: id },
      select: { company_id: true },
    });

    if (!existingAccount) {
      return NextResponse.json(
        { error: "Corporate account not found" },
        { status: 404 },
      );
    }

    if (data.corporate_reference || data.company_email) {
      const duplicateAccount = await prisma.corporateaccount.findFirst({
        where: {
          AND: [
            {
              OR: [
                data.corporate_reference
                  ? { corporate_reference: data.corporate_reference }
                  : undefined,
                data.company_email
                  ? { company_email: data.company_email }
                  : undefined,
              ].filter(Boolean) as any,
            },
            {
              NOT: {
                company_id: id,
              },
            },
          ],
        },
        select: { company_id: true },
      });

      if (duplicateAccount) {
        return NextResponse.json(
          { error: "Corporate reference or email already exists" },
          { status: 409 },
        );
      }
    }

    const updateData: any = { ...data };

    if (
      updateData.company_website !== undefined &&
      (!updateData.company_website || updateData.company_website.trim() === "")
    ) {
      updateData.company_website = "-";
    }

    if (data.password && data.password.trim() !== "") {
      updateData.corporate_password = await bcrypt.hash(data.password, 12);
    }

    delete updateData.password;

    const updatedAccount = await prisma.corporateaccount.update({
      where: { company_id: id },
      data: updateData,
      select: {
        company_id: true,
        corporate_reference: true,
        company_name: true,
        company_website: true,
        company_address: true,
        company_email: true,
        phone_number: true,
        billing_address: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Corporate account updated successfully",
      account: updatedAccount,
    });
  } catch (error: any) {
    console.error("Update corporate account error:", error);

    // 🔥 Handle Prisma unique constraint safely (better than manual duplicate check)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Corporate reference or email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Delete corporate account
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return new Response("Unauthorized", { status: 401 });
    }

    await prisma.corporateaccount.delete({
      where: {
        company_id: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Corporate account deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete corporate account error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Corporate account not found" },
        { status: 404 },
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "Cannot delete corporate account because related records exist",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
