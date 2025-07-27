import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Contact() {
  return (
    <>
      <Header />
      <section className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center px-12 w-full max-w-[1000px] mx-auto gap-[90px] pt-[100px] pb-[170px] text-[20px]">
          <h1 className="text-[64px]">Contact Information</h1>
          <div className="flex flex-col gap-6 w-full">
            <p className="text-[28px]">JO LIMO HEADQUARTER</p>
            <p>
              Shareef Jamil Bin Nasser Street, King Abdullah Gardens, PO Box
              961003, Amman 11196, Jordan.
            </p>
          </div>
          <div className="flex flex-col gap-6 w-full">
            <p className="text-[28px]">CONTACT US</p>
            <div className="flex gap-8 justify-between">
              <div className="flex flex-col text-[20px]">
                <p>Customer Service</p>
                <a href="mailto:support@jo-limo.com" className="underline">support@jo-limo.com</a>
              </div>
              <div className="flex flex-col text-[20px]">
                <p>Corporate B2B</p>
                <a href="mailto:b2b@jo-limo.com" className="underline">b2b@jo-limo.com</a>
              </div>
              <div className="flex flex-col text-[20px]">
                <p>Bookings</p>
                <a href="mailto:booking@jo-limo.com" className="underline">booking@jo-limo.com</a>
              </div>
              <div className="flex flex-col text-[20px]">
                <p>Mobile</p>
                <p className="underline">+962 79 169 8125</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
