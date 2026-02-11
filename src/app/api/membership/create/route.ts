import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { firstname, lastname, email, phone } = await request.json();

    if (!firstname || !lastname || !email || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const newMember = await prisma.membership.create({
      data: {
        first_name: firstname,
        last_name: lastname,
        email,
        phone_number: phone,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Membership created successfully",
      member: {
        firstname: newMember.first_name,
        lastname: newMember.last_name,
        email: newMember.email,
        phone: newMember.phone_number,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Member with this email already exists" },
        { status: 409 },
      );
    }

    console.error("Create membership error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
