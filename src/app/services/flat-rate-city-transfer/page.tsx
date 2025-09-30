import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import AppBanner from "@/components/app-banner";

export default function FlatRateCityTransfer() {
  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto md:px-4 px-0 text-center pt-10 md:pt-20 gap-6 md:gap-10 flex flex-col">
        <div className="flex flex-col gap-6 md:gap-10 items-center">
          <h1 className="text-[32px] md:text-[64px] leading-tight px-2">
            Flat Rate City Transfer
          </h1>
          <p className="mt-2 md:mt-4 max-w-[350px] md:max-w-[850px] mx-auto text-[16px] md:text-[20px] px-2">
            Flat rate drop-offs. Anytime, anywhere within the city. No
            surprises.
          </p>
          <Link
            href="/"
            className="md:rounded-none rounded-lg mt-4 md:mt-6 px-6 md:px-10 py-3 md:py-5 bg-black text-white uppercase text-sm hover:bg-gray-800 w-fit text-[16px] md:text-[20px] font-bold"
          >
            Reserve Your Journey
          </Link>
        </div>

        <div className="md:mt-8 mt-4 md:w-full w-screen md:px-20">
          <Image
            src="/images/rate-flat-city-transfer.webp"
            alt="Executive Mercedes-E-Class"
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto md:px-4 px-0 md:pt-12 pt-0 pb-20 md:pb-24 w-full flex flex-col mt-6 md:mt-10 items-center justify-center max-w-[350px] md:max-w-[770px] gap-10 md:gap-[100px]">
        <div className="flex flex-col gap-3 md:gap-4">
          <h1 className="text-[20px] md:text-[40px] leading-tight">
            YOUR RIDE, YOUR CITY
          </h1>
          <p className="text-[14px] md:text-[16px]">
            Enjoy stress-free travel with Jo Limo&apos;s flat-rate city
            transfers. Whether you&apos;re heading across town in Amman or
            exploring the beauty of Aqaba, our transparent pricing and
            professional chauffeurs ensure a smooth ride. No hidden fees, no
            surprises.
          </p>
        </div>

        {/* Mobile: Single Table */}
        <div className="md:hidden w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-[14px] font-normal text-black uppercase">
                  FLAT RATE WITHIN
                </th>
                <th className="text-center py-3 text-[14px] font-normal text-black uppercase">
                  AMMAN
                </th>
                <th className="text-center py-3 text-[14px] font-normal text-black uppercase">
                  AQABA
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-[12px] text-gray-600 uppercase">
                  EXECUTIVE MERCEDES E-CLASS
                </td>
                <td className="py-3 text-center text-[14px] font-bold text-black">
                  12 JOD
                </td>
                <td className="py-3 text-center text-[14px] font-bold text-black">
                  8 JOD
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-[12px] text-gray-600 uppercase">
                  LUXURY MERCEDES S-CLASS
                </td>
                <td className="py-3 text-center text-[14px] font-bold text-black">
                  28 JOD
                </td>
                <td className="py-3 text-center text-[14px] font-bold text-black">
                  27 JOD
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-[12px] text-gray-600 uppercase">
                  SUV CADILLAC ESCALADE
                </td>
                <td className="py-3 text-center text-[14px] font-bold text-black">
                  26 JOD
                </td>
                <td className="py-3 text-center text-[14px] font-bold text-black">
                  25 JOD
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-[12px] text-gray-600 uppercase">
                  MPV MERCEDES V-CLASS
                </td>
                <td className="py-3 text-center text-[14px] font-bold text-black">
                  36 JOD
                </td>
                <td className="py-3 text-center text-[14px] font-bold text-black">
                  34 JOD
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Desktop: Two Columns */}
        <div className="hidden md:grid grid-cols-2 gap-[100px] w-full">
          {/* Amman Column */}
          <div className="flex flex-col">
            <h2 className="text-[24px] mb-8 text-center border-b border-gray-200 pb-2">
              FLAT RATE WITHIN AMMAN
            </h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-[16px] font-medium">
                  EXECUTIVE <br />
                  MERCEDES E-CLASS
                </span>
                <span className="text-[20px] font-bold">12 JOD</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-[16px] font-medium">
                  LUXURY <br />
                  MERCEDES S-CLASS
                </span>
                <span className="text-[20px] font-bold">28 JOD</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-[16px] font-medium">
                  SUV <br /> CADILLAC ESCALADE
                </span>
                <span className="text-[20px] font-bold">26 JOD</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-[16px] font-medium">
                  MPV <br />
                  MERCEDES V-CLASS
                </span>
                <span className="text-[20px] font-bold">36 JOD</span>
              </div>
            </div>
          </div>

          {/* Aqaba Column */}
          <div className="flex flex-col">
            <h2 className="text-[24px] mb-8 text-center border-b border-gray-200 pb-2">
              FLAT RATE WITHIN AQABA
            </h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-[16px] font-medium">
                  EXECUTIVE <br /> MERCEDES E-CLASS
                </span>
                <span className="text-[20px] font-bold">8 JOD</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-[16px] font-medium">
                  LUXURY <br /> MERCEDES S-CLASS
                </span>
                <span className="text-[20px] font-bold">27 JOD</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-[16px] font-medium">
                  SUV <br /> CADILLAC ESCALADE
                </span>
                <span className="text-[20px] font-bold">25 JOD</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-[16px] font-medium">
                  MPV <br /> MERCEDES V-CLASS
                </span>
                <span className="text-[20px] font-bold">34 JOD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="md:block hidden">
        <AppBanner />
      </div>

      <Footer />
    </>
  );
}
