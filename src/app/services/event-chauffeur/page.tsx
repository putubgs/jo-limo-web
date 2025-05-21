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
          <button className="flex gap-4 items-center font-light">
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
              We have created an exclusive new service for our most discerning
              passengers: the ability to make bookings for up to a full day
              at a flat hourly rate, directly through the Wheely app.
            </p>
            <div>
              <p>FREEDOM OF MOVEMENT</p>
              <p className="mt-4 text-[16px]">
                Having the same trusted chauffeur throughout the day allows you
                to leave extra belongings with them between stops — from bags
                to umbrellas to coats. They can also fetch items from your home
                or office, ensuring you always have what you need — and only
                what you need — at every appointment.
              </p>
              <p className="mt-10">TRUSTED ASSISTANCE</p>
              <p className="mt-4 text-[16px]">
                While you tend to your affairs, your chauffeur can recoup your
                time by assisting with errands and other logistics — whether
                that’s handling your dry-cleaning, delivering sensitive
                documents, or picking up a loved one to join you for dinner
                in ultimate comfort.
              </p>
              <p className="mt-10">FULL FLEXIBILITY</p>
              <p className="mt-4 text-[16px]">
                Book your extended journey directly and instantly in the Wheely
                app, where you can also leave any instructions for your
                chauffeur to let them personalise your experience.
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
