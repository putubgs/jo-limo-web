"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useReservationStore } from "@/lib/reservation-store";

interface User {
  id: string;
  email: string;
  role: string;
  corporate_reference: string;
  company_name: string;
}

export default function CMAccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { resetForCorporateMobility } = useReservationStore();
  const basePath = "/corporate-mobility/account";
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pageTitle = checkPageTitle();

  // Reset all booking state when user enters corporate mobility account
  useEffect(() => {
    resetForCorporateMobility();
  }, [resetForCorporateMobility]);

  // Verify authentication and get user data
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/corporate-mobility/auth/verify");
        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          // Not authenticated, redirect to login
          router.push("/corporate-mobility/login");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        router.push("/corporate-mobility/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  // Paths where the section should be hidden
  const excludedPaths = [
    `${basePath}/reserve/service-class`,
    `${basePath}/reserve/pick-up-info`,
    `${basePath}/reserve/corporate-billing`,
  ];

  const shouldShowSection = !excludedPaths.includes(pathname);

  function checkPageTitle() {
    if (pathname == basePath) {
      return "CORPORATE ACCOUNT";
    }
    if (pathname == `${basePath}/booking-history`) {
      return "BOOKING HISTORY";
    }
    if (pathname == `${basePath}/reserve`) {
      return "RESERVATION";
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <Header />
      {shouldShowSection ? (
        <section className="flex flex-col mx-auto w-full max-w-[1350px] py-[70px]">
          <div className="flex justify-between items-center">
            <p>CORPORATE MOBILITY ACCOUNT</p>
            <div className="flex items-center gap-4">
              <p>{pageTitle}</p>
            </div>
          </div>
          <hr className="h-px my-4 bg-[#B2B2B2] border-0"></hr>
          <div className="flex w-full gap-[100px] pt-8">
            <div className="flex flex-col gap-2 w-1/4">
              <div className="flex flex-col ">
                <p className="text-[36px]">Welcome back,</p>
                <p className="text-[36px] -mt-3">{user.company_name}!</p>
              </div>
              <p className="text-[20px] text-[#3D3D3D]">
                How can we assist you today?
              </p>

              {pathname !== `${basePath}/reserve` ? (
                <Link
                  href={`${basePath}/reserve`}
                  className="text-white bg-black py-4 rounded-lg font-bold my-4 text-center"
                >
                  RESERVE NOW
                </Link>
              ) : (
                <div className="mb-1"></div>
              )}

              <Link
                href={`${basePath}/booking-history`}
                className="flex items-center gap-2 text-[16px]"
              >
                {pathname == `${basePath}/booking-history` ? (
                  <p className="font-bold">VIEW BOOKING HISTORY</p>
                ) : (
                  <p>VIEW BOOKING HISTORY</p>
                )}
                <ArrowBackIosNewRoundedIcon
                  className="transform rotate-180 text-[20px]"
                  fontSize="inherit"
                />
              </Link>
              <Link
                href={basePath}
                className="flex items-center gap-2 text-[16px] pt-2"
              >
                {pathname == basePath ? (
                  <p className="font-bold">CORPORATE ACCOUNT PROFILE</p>
                ) : (
                  <p>CORPORATE ACCOUNT PROFILE</p>
                )}
                <ArrowBackIosNewRoundedIcon
                  className="transform rotate-180 text-[20px]"
                  fontSize="inherit"
                />
              </Link>
            </div>
            {children}
          </div>
        </section>
      ) : (
        children
      )}
      <Footer />
    </>
  );
}
