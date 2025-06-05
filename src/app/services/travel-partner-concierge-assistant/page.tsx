import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import AppBanner from "@/components/app-banner";

export default function TravelPartner() {
  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto px-4 text-center pt-20 gap-10 flex flex-col">
        <div className="flex flex-col gap-10 items-center">
          <div>
            <h1 className="text-[64px]">Travel Partner (Concierge Assistant)</h1>
            <p className="text-[20px] text-[#A7A7A7]">For membership Only</p>
          </div>
          <p className="mt-4 max-w-[800px] mx-auto text-[20px]">
            Our exclusive concierge service is always just a phone call or email
            away. Whether you need help with local information, discounts, lost
            items, or translation, our multilingual team is available around the
            clock to assist you.
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
            src="/images/TPCA-img.webp"
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
              Save your time and energy for what truly matters. With Jo Limo, a
              trusted chauffeur can take care of your tasks with the utmost care
              and professionalism. This premium service is available both
              on-demand and for pre-scheduled bookings.
            </p>
            <div>
              <p>PREMIUM PERSONAL SERVICE</p>
              <p className="mt-4 text-[16px]">
                This service is crafted for tasks requiring trust, attention to
                detail, and care—whether it’s delivering confidential documents,
                or personally presenting a thoughtful gift or invitation cards.
                Your chauffeur can even stand in line for exclusive events.
              </p>
              <p className="mt-10">SEAMLESS, PRIVATE COMMUNICATION</p>
              <p className="mt-4 text-[16px]">
                Share detailed instructions, make personalized requests, and
                communicate directly with your chauffeur through the app. Your
                phone number remains secure, and the chat stays active until the
                task is completed to your satisfaction.
              </p>
              <p className="mt-10">ADAPTABLE AND PROFESSIONAL SUPPORT</p>
              <p className="mt-4 text-[16px]">
                Should unexpected situations arise, such as store closures,
                unavailable items, or delivery challenges, your chauffeur will
                handle the matter with professionalism and resourcefulness,
                ensuring the task is completed smoothly and efficiently.
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
