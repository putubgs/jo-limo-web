import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AboutUs() {
  return (
    <>
      <Header />
      <section className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full max-w-[1000px] mx-auto gap-[80px] py-[100px]">
          <h1 className="text-[64px]">About Jo Limo</h1>
          <div className="flex gap-8 text-[16px]">
            <div className="flex flex-col gap-2">
              <p className="text-[20px] font-bold">35+ Year Excellence</p>
              <p>
                Jo Limo has provided exceptional <br /> chauffeur services in
                Jordan since 1990.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[20px] font-bold">120+ Corporates</p>
              <p>
                We serve 120+ national and international <br /> corporates with
                a fleet over 2,000 vehicles.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[20px] font-bold">Unmatched Service</p>
              <p>
                We prioritize innovation and exceeding <br /> customer
                expectations with every ride.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full border-t border-gray-300 my-8"></div>
        <div className="flex flex-col items-center justify-center w-full max-w-[925px] mx-auto gap-[80px] pt-[50px] pb-[170px] text-[20px]">
          <div className="flex flex-col gap-4">
            <h2 className="text-[28px]">DRIVEN BY EXCELLENCE</h2>
            <p className="pt-2">
              With over 35 years of excellence in the ground transportation
              industry, Jordan Limousine Services LLC has become a trusted name
              in delivering premium travel experiences. Guided by the belief
              that “journeys matter,” we are committed to transforming the way
              people travel through innovation, reliability, and service
              excellence.
            </p>
            <p>
              Our fleet consists exclusively of privately owned vehicles, all
              under two years old, ensuring our clients enjoy modern, safe, and
              comfortable rides. From standard sedans to MPVs and premium
              vehicles, we offer a wide range of options at highly competitive
              rates. We also hold exclusive permits to operate at airports and
              provide cross-border transportation by delivering unmatched
              convenience and flexibility.
            </p>
            <p>
              At the heart of Jo Limo is a team of professional drivers and
              dedicated staff, all driven by a shared passion for outstanding
              customer service. We are more than just a transportation company
              we are your trusted partner in creating seamless, memorable
              journeys.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-[28px]">OUR MISSION</h2>
            <p className="pt-2">
              To redefine ground transportation in Jordan and beyond by offering
              exceptional, customer focused services powered by innovation, high
              standards, and a commitment to excellence. We aim to make every
              journey smooth, reliable, and unforgettable.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
