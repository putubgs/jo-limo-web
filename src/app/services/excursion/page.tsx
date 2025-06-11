import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import AppBanner from "@/components/app-banner";

export default function Excursion() {
  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto px-4 text-center pt-20 gap-10 flex flex-col">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-[64px]">Excursion</h1>
          <p className="mt-4 max-w-[800px] mx-auto text-[20px]">
            Explore Jordan in comfort with Jo Limo’s tailored excursion service.
            Whether visiting historic sites or scenic landscapes, our fleet
            ensures a seamless, comfortable journey with your chauffeur handling
            the details.
          </p>
          <button className="flex gap-4 items-center font-regular">
            <p>AVAILABLE IN THE APP</p>
            <Image
              src="/images/jolimo-app-logo.png"
              alt="Jo Limo App Logo"
              width={29}
              height={29}
            />
          </button>
        </div>

        <div className="mt-8 w-full px-20">
          <Image
            src="/images/excursion-img.webp"
            alt="Executive Mercedes-E-Class"
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto px-4 pt-12 pb-20 w-full flex flex-col mt-10 items-center justify-center">
        <div className="flex flex-col w-full items-center justify-center">
          <div className="flex flex-col w-full justify-center max-w-[850px] gap-[65px]">
            <p className="text-[24px]">
              From Petra’s ancient wonders to the Dead Sea’s calm shores, every
              Jo Limo trip is tailored to your pace. Explore freely while your
              chauffeur handles the details — turning every journey into a
              smooth, memorable experience.
            </p>
            <div>
              <p>CUSTOMIZED ITINERARIES</p>
              <p className="mt-4 text-[16px]">
                Whether you want a full-day adventure or a relaxed half-day
                outing, we tailor every trip to your interests, timing, and pace
                — with no fixed schedules holding you back.
              </p>
              <p className="mt-10">SEAMLESS COMFORT</p>
              <p className="mt-4 text-[16px]">
                Travel in a well-maintained, air-conditioned vehicle with a
                professional chauffeur who handles the driving, parking, and
                logistics — so you can focus on the experience.
              </p>
              <p className="mt-10">LOCAL INSIGHT & ASSISTANCE</p>
              <p className="mt-4 text-[16px]">
                Our chauffeurs offer more than just transportation. With local
                knowledge and courteous service, they’re ready to assist,
                recommend hidden gems, and adapt as your day unfolds.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AppBanner />

      <Footer />
    </>
  );
}
