import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

// GET - Fetch all corporate accounts
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    let query = supabase
      .from("corporateaccount")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Apply search filter if provided
    if (search) {
      query = query.or(
        `company_name.ilike.%${search}%,company_email.ilike.%${search}%,corporate_reference.ilike.%${search}%`
      );
    }

    // Apply pagination if provided
    if (limit) {
      const limitNum = parseInt(limit);
      query = query.limit(limitNum);

      if (offset) {
        const offsetNum = parseInt(offset);
        query = query.range(offsetNum, offsetNum + limitNum - 1);
      }
    }

    const { data: accounts, error, count } = await query;

    if (error) {
      console.error("Error fetching corporate accounts:", error);

      // Check if table doesn't exist
      if (error.code === "42P01") {
        return NextResponse.json(
          {
            error: "Table 'corporateaccount' does not exist",
            message:
              "Please create the corporateaccount table in your Supabase dashboard",
            sql: `
-- Run this SQL in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS corporateaccount (
  company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_reference VARCHAR(50) UNIQUE NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  company_website VARCHAR(500),
  company_address TEXT NOT NULL,
  company_email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  billing_address TEXT NOT NULL,
  corporate_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_corporateaccount_email ON corporateaccount(company_email);
CREATE INDEX IF NOT EXISTS idx_corporateaccount_reference ON corporateaccount(corporate_reference);
CREATE INDEX IF NOT EXISTS idx_corporateaccount_company_name ON corporateaccount(company_name);

-- Enable Row Level Security (RLS)
ALTER TABLE corporateaccount ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Allow admin full access to corporateaccount" ON corporateaccount
    FOR ALL USING (true);
          `,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch corporate accounts", details: error.message },
        { status: 500 }
      );
    }

    // Remove passwords from response
    const accountsWithoutPasswords = accounts?.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ corporate_password: _, ...account }) => account
    );

    return NextResponse.json({
      success: true,
      accounts: accountsWithoutPasswords,
      count,
    });
  } catch (error) {
    console.error("Get corporate accounts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
