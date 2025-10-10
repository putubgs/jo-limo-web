"use client";

import { usePathname } from "next/navigation";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    // For admin routes, return children without max-width constraint
    return <>{children}</>;
  }

  // For non-admin routes, apply max-width constraint
  return <div className="max-w-[1725px] w-full mx-auto">{children}</div>;
}
