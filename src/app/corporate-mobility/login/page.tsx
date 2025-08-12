import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

export default function LoginCorporateMobility() {
  return (
    <>
      <Header />
      <section className="flex items-center justify-center py-[150px]">
        <div className="flex flex-col items-center max-w-[700px] w-full gap-2 text-center">
          <p className="text-[36px] w-full">
            Login to Your Corporate Mobility Account
          </p>
          <div className="flex flex-col items-center max-w-[587px] w-full gap-8 text-center">
            <p className="text-[16px]">
              View and track your bookings and billing information with ease.
            </p>
            <form action="/membership" className="w-full gap-1 flex flex-col">
              <input
                className="border rounded-lg border-[#CACACA] w-full p-3 outline-none "
                placeholder="Corporate Reference"
              />
              <input
                className="border rounded-lg border-[#CACACA] w-full p-3 outline-none "
                placeholder="Password"
              />
              <button
                type="submit"
                className="rounded-lg font-bold uppercase bg-black p-3 text-center text-white mt-3"
              >
                Continue
              </button>
            </form>
            <p className="text-center text-black px-10 text-[#656565]">
              Not a Jo Limo partner yet? Partner with us and elevate your
              business mobility.{" "}
              <Link href={"#"} className="underline text-blue-500">
                Apply Now
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
