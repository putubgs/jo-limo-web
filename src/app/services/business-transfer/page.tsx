import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import AppBanner from "@/components/app-banner";

export default function BusinessTransfer() {
  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto px-4 text-center pt-20 gap-10 flex flex-col">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-[64px]">Business Transfer</h1>
          <p className="mt-4 max-w-[800px] mx-auto text-[20px]">
            An elevated, professional service for all of your business needs.
            Our smooth and reliable business class promises impeccably
            maintained vehicles, a smartly dressed chauffeur and a personalised
            journey. Arrive at or depart your next meeting, dinner or flight
            in optimal time — and comfort.
          </p>
          <button className="flex gap-4 items-center font-regular mt-12">
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
            src="/images/business-transfer-img.webp"
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
              At Jo Limo, we know business doesn’t stop between destinations.
              That’s why our service offers more than transport — it’s a space
              to focus, relax, or stay connected. Your chauffeur remains
              discreet and flexible, adapting to your schedule so your day runs
              smoothly and professionally.
            </p>
            <div>
              <p>EFFORTLESS ARRIVAL</p>
              <p className="mt-4 text-[16px]">
                Having the same trusted chauffeur throughout the day allows you
                to leave extra belongings with them between stops — from bags
                to umbrellas to coats. They can also fetch items from your home
                or office, ensuring you always have what you need — and only
                what you need — at every appointment.
              </p>
              <p className="mt-10">BUSINESS-CLASS SUPPORT</p>
              <p className="mt-4 text-[16px]">
                More than just a ride, our chauffeurs provide reliable support
                throughout your itinerary. Need to drop off contracts, swing by
                multiple locations, or coordinate a discreet airport pickup for
                a VIP? Consider it done — all with the professionalism that
                reflects your brand and expectations.
              </p>
              <p className="mt-10">TAILORED TO YOUR SCHEDULE</p>
              <p className="mt-4 text-[16px]">
                Meetings change, schedules shift — and Jo Limo adapts with you.
                Your chauffeur remains ready and available for any adjustments,
                offering the flexibility today’s fast-paced business world
                demands. Leave instructions in advance, or communicate
                throughout the journey — your comfort and efficiency remain our
                top priority.
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
