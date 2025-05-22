import Header from "@/components/header";
import Footer from "@/components/footer";

export default function MembershipApplication() {
  return (
    <>
      <Header />
      <section className="flex items-center justify-center py-[150px]">
        <div className="flex flex-col items-center max-w-[587px] w-full gap-8">
          <p className="text-[36px]">Apply For Membership</p>
          <form
            action="/membership"
            className="w-full gap-1 flex flex-col"
          >
            <input
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none "
              placeholder="First Name"
            />
            <input
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none "
              placeholder="Last Name"
            />
            <input
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none "
              placeholder="E-mail"
            />
            <input
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none "
              placeholder="Phone Number"
            />
            <button
              type="submit"
              className="rounded-sm uppercase bg-black p-3 text-center text-white mt-3"
            >
              send
            </button>
          </form>
          <p className="text-center px-10 text-[#656565]">
            Thank you for applying for Jo Limo membership. We will review your
            application and respond to you via email shortly.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
