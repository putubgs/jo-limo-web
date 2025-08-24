import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";

export default function AboutUs() {
  return (
    <>
      <Header />
      <section className="flex flex-col items-center justify-center text-center mt-[50px] mb-[100px] max-w-[1000px] mx-auto gap-[50px]">
        <h1 className="text-[42px]">International Chauffeur Charter with AirportConnect</h1>
        <Image
          src="/images/global_limo.png"
          alt="The Global Limo Image"
          width={350}
          height={238}
        />
        <div className="flex flex-col text-center gap-6 text-[16px]">
          <p>
            Seamless inbound and outbound airports transfers with
            AirportConnect, we coordinate your journey from departure to
            arrival, home to hotel, and back.
          </p>
          <p>
            250+ trusted affiliates across 25 countries in the Middle East and
            North Africa, our network delivers consistency, professinalism, and
            comfort worldwide.
          </p>
        </div>
        <p className="text-[16px] font-bold">ARRIVE PREPARED. DEPART IN COMFORT. TRAVEL CONNECTED</p>
      </section>
      <Footer />
    </>
  );
}
