import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if(!token){
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return new Response("Unauthorized", { status: 401 });
    }

    const memberships = await prisma.membership.findMany();

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
