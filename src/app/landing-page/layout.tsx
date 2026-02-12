import type { Metadata } from "next";
import "./landing-page.css";

export const metadata: Metadata = {
  title: "Jo Limo - Stress-Free Airport Transfers (Amman)",
  description:
    "Experience the same 5-star fleet as top hotels. Book direct with Amman's local experts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="landing-theme w-full">{children}</div>;
}
