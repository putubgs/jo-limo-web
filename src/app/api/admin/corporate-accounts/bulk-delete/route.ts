import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Array of account IDs is required" },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());

    // Delete multiple accounts
    const { error: deleteError } = await supabase
      .from("corporateaccount")
      .delete()
      .in("company_id", ids);

    if (deleteError) {
      console.error("Error deleting corporate accounts:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete corporate accounts" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${ids.length} corporate account(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Bulk delete corporate accounts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
