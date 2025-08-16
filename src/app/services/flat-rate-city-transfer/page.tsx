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
      <section className="mx-auto px-4 text-center pt-20 gap-10 flex flex-col">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-[64px]">Flat Rate City Transfer</h1>
          <p className="mt-4 max-w-[850px] mx-auto text-[20px]">
            Flat rate drop-offs. Anytime, anywhere within the city. No
            surprises.
          </p>
          <Link
            href="/"
            className="mt-6 px-10 py-5 bg-black text-white uppercase text-sm hover:bg-gray-800 w-fit text-[20px] font-bold"
          >
            Reserve Your Journey
          </Link>
        </div>

        <div className="mt-8 w-full px-20">
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
      <section className="mx-auto px-4 pt-12 pb-24 w-full flex flex-col mt-10 items-center justify-center max-w-[770px] gap-[100px]">
        <div className="flex flex-col gap-4">
          <h1 className="text-[40px]">YOUR RIDE, YOUR CITY</h1>
          <p className="text-[16px]">
            Enjoy stress-free travel with Jo Limo&apos;s flat-rate city
            transfers. Whether you&apos;re heading across town in Amman or
            exploring the beauty of Aqaba, our transparent pricing and
            professional chauffeurs ensure a smooth ride. No hidden fees, no
            surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[100px] w-full">
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

      <AppBanner />

      <Footer />
    </>
  );
}
