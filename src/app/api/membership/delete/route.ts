import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());

    // Check if member exists
    const { data: existingMember, error: checkError } = await supabase
      .from("membership")
      .select("*")
      .eq("membership_id", id)
      .single();

    if (checkError || !existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Delete the membership
    const { error: deleteError } = await supabase
      .from("membership")
      .delete()
      .eq("membership_id", id);

    if (deleteError) {
      console.error("Error deleting membership:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete membership" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Membership deleted successfully",
      deletedMember: {
        id: existingMember.membership_id,
        firstname: existingMember.first_name,
        lastname: existingMember.last_name,
        email: existingMember.email,
        phone: existingMember.phone_number,
      },
    });
  } catch (error) {
    console.error("Delete membership error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
