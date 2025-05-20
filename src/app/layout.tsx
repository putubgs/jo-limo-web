import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jo Limo",
  description: "Rent to best limousines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
