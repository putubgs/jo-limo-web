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
  const { resetForCorporateMobility, setHasHydrated } = useReservationStore();
  const basePath = "/corporate-mobility/account";
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const pageTitle = checkPageTitle();

  // Reset all booking state when user enters corporate mobility account
  useEffect(() => {
    // Rehydrate the store from localStorage
    useReservationStore.persist.rehydrate();
    setHasHydrated(true);
    resetForCorporateMobility();
  }, [resetForCorporateMobility, setHasHydrated]);

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

  const handleSignOut = async () => {
    setSigningOut(true);
    console.log("🚪 Starting sign out process...");

    try {
      const response = await fetch("/api/corporate-mobility/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        console.log("✅ Logout successful");
        // Clear any local state
        setUser(null);
        resetForCorporateMobility();
        console.log("🔄 Redirecting to login page...");
        // Redirect to login
        router.push("/corporate-mobility/login");
      } else {
        console.error("❌ Logout failed - response not ok");
        setSigningOut(false);
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
      setSigningOut(false);
    }
  };

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
        <section className="flex flex-col mx-auto w-full max-w-[1350px] md:py-[70px] py-[0px]">
          <div className="md:flex hidden justify-between items-center">
            <p>CORPORATE MOBILITY ACCOUNT</p>
            <div className="flex items-center gap-4">
              <p>{pageTitle}</p>
            </div>
          </div>
          <hr className="h-px my-4 md:block hidden bg-[#B2B2B2] border-0"></hr>
          <div className="flex md:flex-row flex-col w-full md:gap-[100px] gap-12 md:pt-8 pt-4 items-center md:items-start">
            <div className="flex flex-col gap-2 w-full md:w-1/4 px-[50px] md:px-0 text-center md:text-start">
              <div className="flex flex-col">
                <p className="md:text-[36px] text-[24px]">Welcome back,</p>
                <p className="md:text-[36px] text-[24px] -mt-3">
                  {user.company_name}!
                </p>
              </div>
              <p className="md:text-[20px] text-[16px] text-[#3D3D3D]">
                How can we assist you today?
              </p>

              {pathname !== `${basePath}/reserve` ? (
                <Link
                  href={`${basePath}/reserve`}
                  className="text-white w-full md:text-[16px] text-[12px] bg-black py-4 rounded-lg font-bold my-4 text-center"
                >
                  RESERVE NOW
                </Link>
              ) : (
                <div className="mb-1"></div>
              )}

              <Link
                href={`${basePath}/booking-history`}
                className="flex mx-auto md:mx-0 items-center gap-2 md:text-[16px] text-[14px]"
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
                className="flex mx-auto md:mx-0 items-center gap-2 md:text-[16px] text-[14px] pt-2"
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

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex mx-auto md:mx-0 items-center gap-2 md:text-[16px] text-[14px] pt-2"
              >
                {signingOut ? "SIGNING OUT..." : "SIGN OUT"}
                <ArrowBackIosNewRoundedIcon
                  className="transform rotate-180 text-[20px]"
                  fontSize="inherit"
                />
              </button>
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
