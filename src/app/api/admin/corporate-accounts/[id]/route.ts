import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: account, error } = await supabase
      .from("corporateaccount")
      .select("*")
      .eq("company_id", id)
      .single();

    if (error) {
      console.error("Error fetching corporate account:", error);
      return NextResponse.json(
        { error: "Corporate account not found" },
        { status: 404 }
      );
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { corporate_password: _, ...accountWithoutPassword } = account;

    return NextResponse.json({
      success: true,
      account: accountWithoutPassword,
    });
  } catch (error) {
    console.error("Get corporate account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update corporate account
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data: CorporateAccountData = await request.json();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Check if account exists
    const { data: existingAccount, error: checkError } = await supabase
      .from("corporateaccount")
      .select("company_id")
      .eq("company_id", id)
      .single();

    if (checkError || !existingAccount) {
      return NextResponse.json(
        { error: "Corporate account not found" },
        { status: 404 }
      );
    }

    // Check for duplicate reference or email if they're being updated
    if (data.corporate_reference || data.company_email) {
      const orConditions = [];
      if (data.corporate_reference) {
        orConditions.push(`corporate_reference.eq.${data.corporate_reference}`);
      }
      if (data.company_email) {
        orConditions.push(`company_email.eq.${data.company_email}`);
      }

      const { data: duplicateAccount, error: duplicateError } = await supabase
        .from("corporateaccount")
        .select("company_id")
        .or(orConditions.join(","))
        .neq("company_id", id)
        .single();

      if (duplicateAccount && !duplicateError) {
        return NextResponse.json(
          { error: "Corporate reference or email already exists" },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: Partial<
      CorporateAccountData & { corporate_password?: string }
    > = { ...data };

    // Handle company_website: use dash if empty
    if (
      !updateData.company_website ||
      updateData.company_website.trim() === ""
    ) {
      updateData.company_website = "-";
    }

    // Hash password if provided and not empty
    if (data.password && data.password.trim() !== "") {
      updateData.corporate_password = await bcrypt.hash(data.password, 12);
      // Remove the original password field from updateData since we've hashed it
      delete updateData.password;
    }

    // Update the account
    const { data: updatedAccount, error: updateError } = await supabase
      .from("corporateaccount")
      .update(updateData)
      .eq("company_id", id)
      .select("*")
      .single();

    if (updateError) {
      console.error("Error updating corporate account:", updateError);
      return NextResponse.json(
        { error: "Failed to update corporate account" },
        { status: 500 }
      );
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { corporate_password: __, ...accountWithoutPassword } =
      updatedAccount;

    return NextResponse.json({
      success: true,
      message: "Corporate account updated successfully",
      account: accountWithoutPassword,
    });
  } catch (error) {
    console.error("Update corporate account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete corporate account
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Check if account exists
    const { data: existingAccount, error: checkError } = await supabase
      .from("corporateaccount")
      .select("company_id")
      .eq("company_id", id)
      .single();

    if (checkError || !existingAccount) {
      return NextResponse.json(
        { error: "Corporate account not found" },
        { status: 404 }
      );
    }

    // Delete the account
    const { error: deleteError } = await supabase
      .from("corporateaccount")
      .delete()
      .eq("company_id", id);

    if (deleteError) {
      console.error("Error deleting corporate account:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete corporate account" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Corporate account deleted successfully",
    });
  } catch (error) {
    console.error("Delete corporate account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
