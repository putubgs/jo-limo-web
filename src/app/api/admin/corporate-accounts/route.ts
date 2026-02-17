export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { verifyToken } from "@/utils/jwt";

// GET - Fetch all corporate accounts
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const take = limit ? parseInt(limit) : undefined;
    const skip = offset ? parseInt(offset) : undefined;

    // 🔎 Build where condition
    const where: Prisma.corporateaccountWhereInput | undefined = search
      ? {
          OR: [
            {
              company_name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              company_email: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              corporate_reference: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : undefined;

    // 🚀 Fetch data + total count in parallel
    const [accounts, count] = await Promise.all([
      prisma.corporateaccount.findMany({
        where,
        orderBy: {
          created_at: "desc",
        },
        skip,
        take,
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
      }),
      prisma.corporateaccount.count({
        where,
      }),
    ]);

    return NextResponse.json({
      success: true,
      accounts,
      count,
    });
  } catch (error) {
    console.error("Get corporate accounts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// BULK DELETE API
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Array of account IDs is required" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return new Response("Unauthorized", { status: 401 });
    }

    const result = await prisma.corporateaccount.deleteMany({
      where: {
        company_id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Bulk delete corporate accounts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
