import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import AppBanner from "@/components/app-banner";

export default function EventChauffeur() {
  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto px-4 text-center pt-20 gap-10 flex flex-col">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-[64px]">Event Chauffeur</h1>
          <p className="mt-4 max-w-[800px] mx-auto text-[20px]">
            A new essential: select patrons may now reserve their chauffeur for
            up to an entire day — bringing unparalleled freedom and convenience
            to a full schedule.
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
            src="/images/event-chaffeur-img.webp"
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
              Whether it’s a wedding, business function, private dinner, or a
              full day of back-to-back events, our Event Chauffeur service is
              designed to make your day effortless and stress-free.
            </p>
            <div>
              <p>FREEDOM OF MOVEMENT</p>
              <p className="mt-4 text-[16px]">
                With a dedicated Jo Limo chauffeur by your side throughout the
                day, you can move between events effortlessly — leaving coats,
                bags, or extra belongings securely in the vehicle between stops.
                Need something from home or the office? Your chauffeur can
                retrieve it, so you’re never without what you need, and never
                burdened by what you don’t.
              </p>
              <p className="mt-10">TRUSTED ASSISTANCE</p>
              <p className="mt-4 text-[16px]">
                While you focus on your event — whether it’s a wedding,
                corporate function, or family celebration — your chauffeur helps
                reclaim your time by taking care of the small but important
                details. From delivering urgent items to picking up a guest on
                your behalf, Jo Limo chauffeurs go beyond driving to support
                your entire schedule with grace and discretion.
              </p>
              <p className="mt-10">TOTAL FLEXIBILITY</p>
              <p className="mt-4 text-[16px]">
                Every moment matters. With Jo Limo’s Event Chauffeur service,
                you’re in control of your day — no rigid pickups, no pressure.
                Simply plan your day your way, and let us handle the rest.
                Instructions can be arranged in advance to ensure your
                experience feels completely personal and stress-free.
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
