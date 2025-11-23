import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import ConditionalLayout from "@/app/ConditionalLayout";
import StoreHydration from "@/components/StoreHydration";
import Script from "next/script";
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
      <head>
        {/* Global site tag (gtag.js) - Google Ads */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17646839146"
        />

        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17646839146');
          `}
        </Script>
      </head>
      <body className="w-full">
        <StoreHydration />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
