import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";
import { prisma } from "@/lib/prisma";

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

    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if(!token){
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await verifyToken(token);

    if(!payload){
      return new Response("Unauthorized", { status: 401 })
    }

    const existingMember = await prisma.membership.delete({
      where: {
        membership_id: id,
      }
    })

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
