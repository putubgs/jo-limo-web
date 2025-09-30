import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Contact() {
  return (
    <>
      <Header />
      <section className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center px-4 md:px-12 w-full max-w-[350px] md:max-w-[1000px] mx-auto gap-[45px] md:gap-[90px] pt-[50px] md:pt-[100px] pb-[80px] md:pb-[170px] text-[16px] md:text-[20px]">
          <h1 className="text-[32px] md:text-[64px] text-center leading-tight">
            Contact Information
          </h1>

          <div className="flex flex-col gap-4 md:gap-6 w-full text-left">
            <p className="text-[20px] md:text-[28px] font-medium">
              JO LIMO HEAD OFFICE
            </p>
            <p className="leading-relaxed">
              Shareef Jamil Bin Nasser Street, King Abdullah Gardens, PO Box
              961003, Amman 11196, Jordan.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:gap-6 w-full">
            <p className="text-[20px] md:text-[28px] font-medium text-left">
              CONTACT US
            </p>

            {/* Mobile layout - stacked */}
            <div className="flex flex-col md:hidden gap-6">
              <div className="flex flex-col md:text-center text-left gap-1">
                <p className="font-medium">Customer Service</p>
                <a
                  href="mailto:support@jo-limo.com"
                  className="underline"
                >
                  support@jo-limo.com
                </a>
              </div>
              <div className="flex flex-col md:text-center text-left gap-1">
                <p className="font-medium">Corporate B2B</p>
                <a
                  href="mailto:b2b@jo-limo.com"
                  className="underline"
                >
                  b2b@jo-limo.com
                </a>
              </div>
              <div className="flex flex-col md:text-center text-left gap-1">
                <p className="font-medium">Bookings</p>
                <a
                  href="mailto:booking@jo-limo.com"
                  className="underline"
                >
                  booking@jo-limo.com
                </a>
              </div>
              <div className="flex flex-col md:text-center text-left gap-1">
                <p className="font-medium">Mobile</p>
                <a
                  href="tel:+96279169-8125"
                  className="underline"
                >
                  +962 79 169 8125
                </a>
              </div>
            </div>

            {/* Desktop layout - horizontal */}
            <div className="hidden md:flex gap-8 justify-between">
              <div className="flex flex-col text-[20px] gap-1">
                <p className="font-medium">Customer Service</p>
                <a
                  href="mailto:support@jo-limo.com"
                  className="underline hover:text-blue-600 transition-colors"
                >
                  support@jo-limo.com
                </a>
              </div>
              <div className="flex flex-col text-[20px] gap-1">
                <p className="font-medium">Corporate B2B</p>
                <a
                  href="mailto:b2b@jo-limo.com"
                  className="underline hover:text-blue-600 transition-colors"
                >
                  b2b@jo-limo.com
                </a>
              </div>
              <div className="flex flex-col text-[20px] gap-1">
                <p className="font-medium">Bookings</p>
                <a
                  href="mailto:booking@jo-limo.com"
                  className="underline hover:text-blue-600 transition-colors"
                >
                  booking@jo-limo.com
                </a>
              </div>
              <div className="flex flex-col text-[20px] gap-1">
                <p className="font-medium">Mobile</p>
                <a
                  href="tel:+962791698125"
                  className="underline hover:text-blue-600 transition-colors"
                >
                  +962 79 169 8125
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
