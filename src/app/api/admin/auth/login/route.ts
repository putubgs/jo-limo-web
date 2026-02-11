import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/utils/jwt";
import { checkRateLimit } from "@/utils/rate-limiter";

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = checkRateLimit(request);

    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime);
      return NextResponse.json(
        {
          error: "Too many login attempts. Please try again later.",
          resetTime: resetDate.toISOString(),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": resetDate.toISOString(),
            "Retry-After": Math.ceil(
              (rateLimitResult.resetTime - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // SUPABASE VERSION

    // const cookieStore = await cookies();
    // const supabase = createClient(cookieStore);

    // // Check admin only
    // const { data: admin, error: adminError } = await supabase
    //   .from("admin")
    //   .select("*")
    //   .eq("email", email)
    //   .single();

    const admin = await prisma.admin.findUnique({
      where: { email },
    })


    if(!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        {
          status: 401,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          },
        }
      );
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if(!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await generateToken({
      id: admin.admin_id,
      email: admin.email,
      role: "admin",
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.admin_id,
        email: admin.email,
        role: "admin",
      }
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    })

    return response;

    // if (admin && !adminError) {
    //   const isValidPassword = await bcrypt.compare(password, admin.password);

    //   if (isValidPassword) {
    //     const token = await generateToken({
    //       id: admin.admin_id,
    //       email: admin.email,
    //       role: "admin",
    //     });

    //     const response = NextResponse.json(
    //       {
    //         success: true,
    //         user: {
    //           id: admin.admin_id,
    //           email: admin.email,
    //           role: "admin",
    //         },
    //       },
    //       {
    //         headers: {
    //           "X-RateLimit-Limit": "5",
    //           "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
    //         },
    //       }
    //     );

    //     response.cookies.set("auth-token", token, {
    //       httpOnly: true,
    //       secure: process.env.NODE_ENV === "production",
    //       sameSite: "strict",
    //       maxAge: 60 * 60,
    //       path: "/",
    //     });

    //     return response;
    //   }
    // }

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
