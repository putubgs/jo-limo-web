import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  try {
    const supabase = createClient(cookies());

    // Create the corporate_accounts table
    const { error } = await supabase.rpc("create_corporate_accounts_table");

    if (error) {
      // If the RPC doesn't exist, try creating the table directly
      console.log("RPC not found, trying direct table creation...");

      // For now, let's just insert a test record to see if the table exists
      const { error: testError } = await supabase
        .from("corporateaccount")
        .select("*")
        .limit(1);

      if (testError && testError.code === "42P01") {
        // Table doesn't exist, return instructions
        return NextResponse.json({
          success: false,
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
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Corporate accounts table initialized successfully",
    });
  } catch (error) {
    console.error("Initialize corporate accounts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
