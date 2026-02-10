import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    console.error("Error getting current admin:", error);
    return null;
  }
}
