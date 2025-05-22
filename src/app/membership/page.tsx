import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import AppBanner from "@/components/app-banner";

export default function Membership() {
  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto px-4 text-center pt-20 gap-10 flex flex-col">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-[64px]">Jo Limo Membership</h1>
          <p className="mt-4 max-w-[850px] mx-auto text-[20px]">
            Upgrade your travel experience with Jo Limo Membership. Unlock
            exclusive perks such as special discounts, tailored services, and
            hassle-free monthly billing. Joining is simple—apply today and enjoy
            the benefits instantly!
          </p>
          <button className="mt-6 px-10 py-5 bg-black text-white uppercase text-sm hover:bg-gray-800 w-fit text-[20px] font-bold">
            Become a jo limo member
          </button>
        </div>

        {/* <div className="mt-8 w-full px-20">
          <Image
            src="/images/executive-img.webp"
            alt="Executive Mercedes-E-Class"
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div> */}
      </section>

      {/* Details */}
      <section className="mx-auto px-4 py-12 w-full flex flex-col mt-10 items-center justify-center">
        {/* <div className="flex flex-col w-full items-center justify-center">
          <div className="flex flex-col w-full justify-center max-w-[850px]">
            <h2 className="text-[40px]">ONLY THE BEST, NOTHING LESS</h2>
            <p className="mt-4 text-[16px]">
              Indulge in the ultimate luxury with the Mercedes-Benz E-Class, a
              masterpiece of comfort and style. Expertly driven by a
              professional Jo Limo chauffeur, this vehicle offers an
              unparalleled experience for those who demand the best.
            </p>
            <p className="pt-4">
              Your chauffeur will customize the temperature and music to your
              exact preferences, creating the perfect atmosphere for your
              journey. Relax and enjoy exclusive amenities, including access to
              Wi-Fi features in the armrest, a complementary bottle of water,
              and convenient charging options. Every detail is designed to
              ensure your complete comfort and satisfaction from start to
              finish.
            </p>
          </div>
        </div> */}
        <div className="relative items-center">
          <Image
            src="/images/membership-img.webp"
            alt="Executive service detail"
            width={900}
            height={0}
            className="h-auto object-cover relative"
          />
          <p className="absolute bottom-5 left-5 text-white">
            Exquisite personal service
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
