import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import ConditionalLayout from "@/app/ConditionalLayout";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

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
    <html
      lang="en"
      className={`flex items-center justify-center ${plusJakartaSans.variable}`}
    >
      <body className="w-full">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
