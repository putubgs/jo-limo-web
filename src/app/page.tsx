import Header from "@/components/header";
import Footer from "@/components/footer";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <div className="px-20 flex flex-col gap-10">
        <div
          className="
    relative
    flex 
    flex-col items-center
    justify-end
    text-bottom
    w-full
    min-h-[980px]
    bg-[url('/images/img-lp-1.webp')]
    bg-no-repeat bg-center
    bg-[length:100%_auto]
    text-white
    gap-10
    pb-10
  "
        >
          <div className="relative text-center w-[500px] z-20 flex flex-col gap-3">
            <p className="font-bold text-[20px]">SEAMLESS EXPERIENCE</p>
            <p>
              Dedicated to seamless, executive travel with professionalism and
              comfort tailored to your business needs.
            </p>
          </div>
          <Link href="/services/business-transfer" className="relative flex gap-1 items-center text-[16px] z-20 hover:text-gray-400">
            <p>LEARN MORE</p>
            <ArrowBackIosNewRoundedIcon
              className="transform rotate-180"
              fontSize="inherit"
            />
          </Link>

          <div
            className="absolute bottom-0 left-0 w-full h-[300px]
      bg-gradient-to-t from-black to-transparent
      pointer-events-none
      z-10"
          />
        </div>

        <div
          className="
    relative
    flex 
    flex-col items-center
    justify-end
    text-bottom
    w-full
    min-h-[980px]
    bg-[url('/images/img-lp-2.webp')]
    bg-no-repeat bg-center
    bg-[length:100%_auto]
    text-white
    gap-10
    pb-10
    mb-20
  "
        >
          <div className="relative text-center w-[500px] z-20 flex flex-col gap-3">
            <p className="font-bold text-[20px]">JO SUV</p>
            <p>JO’s SUV most refined class</p>
          </div>
          <Link href="/services/suv" className="relative flex gap-1 items-center text-[16px] z-20 hover:text-gray-400">
            <p>LEARN MORE</p>
            <ArrowBackIosNewRoundedIcon
              className="transform rotate-180"
              fontSize="inherit"
            />
          </Link>

          <div
            className="absolute bottom-0 left-0 w-full h-[300px]
      bg-gradient-to-t from-black to-transparent
      pointer-events-none
      z-10"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
