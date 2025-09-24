import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function PUT(request: NextRequest) {
  try {
    const { id, firstname, lastname, email, phone } = await request.json();

    if (!id || !firstname || !lastname || !email || !phone) {
      return NextResponse.json(
        { error: "All fields including ID are required" },
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

    // Check if email is being changed and if new email already exists
    if (existingMember.email !== email) {
      const { data: emailExists, error: emailCheckError } = await supabase
        .from("membership")
        .select("id")
        .eq("email", email)
        .neq("id", id)
        .single();

      if (emailExists && !emailCheckError) {
        return NextResponse.json(
          { error: "Email already exists for another member" },
          { status: 409 }
        );
      }
    }

    // Update the membership
    const { data: updatedMember, error: updateError } = await supabase
      .from("membership")
      .update({
        first_name: firstname,
        last_name: lastname,
        email: email,
        phone_number: phone,
      })
      .eq("membership_id", id)
      .select("*")
      .single();

    if (updateError) {
      console.error("Error updating membership:", updateError);
      return NextResponse.json(
        { error: "Failed to update membership" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Membership updated successfully",
      member: {
        id: updatedMember.membership_id,
        firstname: updatedMember.first_name,
        lastname: updatedMember.last_name,
        email: updatedMember.email,
        phone: updatedMember.phone_number,
      },
    });
  } catch (error) {
    console.error("Update membership error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
