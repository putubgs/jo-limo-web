import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { firstname, lastname, email, phone } = await request.json();

    if (!firstname || !lastname || !email || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());

    // Check if email already exists
    const { data: existingMember, error: checkError } = await supabase
      .from("membership")
      .select("id")
      .eq("email", email)
      .single();

    if (existingMember && !checkError) {
      return NextResponse.json(
        { error: "Member with this email already exists" },
        { status: 409 }
      );
    }

    // Create new membership
    const { data: newMember, error: createError } = await supabase
      .from("membership")
      .insert({
        first_name: firstname,
        last_name: lastname,
        email: email,
        phone_number: phone,
      })
      .select("*")
      .single();

    if (createError) {
      console.error("Supabase error creating membership:", createError);
      return NextResponse.json(
        {
          error: "Failed to create membership",
          details: createError.message,
          code: createError.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Membership created successfully",
      member: {
        id: newMember.id,
        firstname: newMember.first_name,
        lastname: newMember.last_name,
        email: newMember.email,
        phone: newMember.phone_number,
      },
    });
  } catch (error) {
    console.error("Create membership error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
