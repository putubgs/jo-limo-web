import Header from "@/components/header";
import Footer from "@/components/footer";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

export default function CMAccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <section className="flex flex-col mx-auto w-full max-w-[1350px] py-[70px]">
        <div className="flex justify-between">
          <p>CORPORATE MOBILITY ACCOUNT</p>
          <p>BOOKING HISTORY</p>
        </div>
        <hr className="h-px my-4 bg-[#B2B2B2] border-0"></hr>
        <div className="flex w-full gap-[100px]">
          <div className="flex flex-col gap-2 w-1/4">
            <div className="flex flex-col ">
              <p className="text-[36px]">Welcome back,</p>
              <p className="text-[36px] -mt-3">Client name!</p>
            </div>
            <p className="text-[20px] text-[#3D3D3D]">
              How can we assist you today?
            </p>
            <button className="text-white bg-black py-4 rounded-lg font-bold my-4">
              RESERVE NOW
            </button>
            <div className="flex items-center gap-2 text-[16px]">
              <p>VIEW BOOKING HISTORY</p>
              <ArrowBackIosNewRoundedIcon
                className="transform rotate-180 text-[20px]"
                fontSize="inherit"
              />
            </div>
            <div className="flex items-center gap-2 text-[16px] pt-2">
              <p>CORPORATE ACCOUNT PROFILE</p>
              <ArrowBackIosNewRoundedIcon
                className="transform rotate-180 text-[20px]"
                fontSize="inherit"
              />
            </div>
          </div>
          {children}
        </div>
      </section>
      <Footer />
    </>
  );
}
