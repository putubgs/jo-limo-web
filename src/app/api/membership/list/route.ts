import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = createClient(cookies());

    // Get all memberships
    const { data: memberships, error } = await supabase
      .from("membership")
      .select("*");

    if (error) {
      console.error("Supabase error fetching memberships:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch memberships",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    console.log("Successfully fetched memberships:", memberships?.length || 0);
    // Transform the data to match the expected interface
    const transformedMemberships =
      memberships?.map((member) => ({
        id: member.membership_id,
        firstname: member.first_name,
        lastname: member.last_name,
        email: member.email,
        phone: member.phone_number,
        created_at: member.created_at || new Date().toISOString(),
      })) || [];

    return NextResponse.json({
      success: true,
      count: transformedMemberships.length,
      memberships: transformedMemberships,
    });
  } catch (error) {
    console.error("List memberships error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
