import Header from "@/components/header";
import Footer from "@/components/footer";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Link from "next/link";

export default function CitiesAndClasses() {
  return (
    <>
      <Header />
      <div className="flex flex-col px-40 py-12">
        <div className="flex flex-col items-center gap-12">
          <h1 className="text-[64px]">Cities & Classes</h1>
          <p className="text-center text-[20px]">
            Experience the perfect blend of tailored luxury and exceptional
            comfort across all <br /> our service classes, providing discreet
            and seamless travel to suit your needs, no <br /> matter where your
            journey leads.
          </p>
        </div>
      </div>
      <div className="flex justify-between border-t border-gray-200 flex pt-20 pb-40 px-40">
        <div className="w-3/4 items-center justify-center">
          <p className="text-[24px] text-center mr-12">CITIES</p>
        </div>
        <div className="w-3/4 items-start flex flex-col space-y-6">
          <div className="w-3/4 border-b border-gray-200">
            <p className="text-[16px]">AMMAN</p>
          </div>
          <div className="w-3/4 border-b border-gray-200">
            <p className="text-[16px]">AQABA</p>
          </div>
          <div className="w-3/4 border-b border-gray-200">
            <p className="text-[16px]">PETRA</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between border-t border-gray-200 flex pt-20 pb-40 px-40">
        <div className="w-3/4 items-center justify-center">
          <p className="text-[24px] text-center mr-12">CLASSES</p>
        </div>
        <div className="w-3/4 items-start flex flex-col space-y-4">
          <div className="w-3/4">
            <p className="text-[16px]">
              We offer flexibility for more comfort, peace of mind, and time,
              with services tailored to your needs
            </p>
          </div>
          <Link
            href="/services/executive"
            className="w-3/4 border-t border-gray-200"
          >
            <div className="pt-2 flex justify-between">
              <div className="flex flex-col">
                <p className="text-[16px]">EXECUTIVE</p>
                <div className="flex gap-4 items-center">
                  <div className="flex text-[16px] text-black gap-1">
                    <PersonRoundedIcon />
                    <p>3</p>
                  </div>
                  <div className="flex text-[16px] text-black gap-1">
                    <WorkRoundedIcon />
                    <p>2-3</p>
                  </div>
                </div>
                <p className="text-[14px] text-[#8F8F8F] mt-2">
                  Mercedes E-Class or similar
                </p>
              </div>
              <div className="">
                <ArrowBackIosNewRoundedIcon className="rotate-180" />
              </div>
            </div>
          </Link>
          <Link
            href="/services/luxury"
            className="w-3/4 border-t border-gray-200"
          >
            <div className="pt-2 flex justify-between">
              <div className="flex flex-col">
                <p className="text-[16px]">LUXURY</p>
                <div className="flex gap-4 items-center">
                  <div className="flex text-[16px] text-black gap-1">
                    <PersonRoundedIcon />
                    <p>3</p>
                  </div>
                  <div className="flex text-[16px] text-black gap-1">
                    <WorkRoundedIcon />
                    <p>2-3</p>
                  </div>
                </div>
                <p className="text-[14px] text-[#8F8F8F] mt-2">
                  Mercedes S-Class or similar
                </p>
              </div>
              <div className="">
                <ArrowBackIosNewRoundedIcon className="rotate-180" />
              </div>
            </div>
          </Link>
          <Link href="/services/mpv" className="w-3/4 border-t border-gray-200">
            <div className="pt-2 flex justify-between">
              <div className="flex flex-col">
                <p className="text-[16px]">MPV</p>
                <div className="flex gap-4 items-center">
                  <div className="flex text-[16px] text-black gap-1">
                    <PersonRoundedIcon />
                    <p>6</p>
                  </div>
                  <div className="flex text-[16px] text-black gap-1">
                    <WorkRoundedIcon />
                    <p>5-6</p>
                  </div>
                </div>
                <p className="text-[14px] text-[#8F8F8F] mt-2">
                  Mercedes V-Class or similar
                </p>
              </div>
              <div className="">
                <ArrowBackIosNewRoundedIcon className="rotate-180" />
              </div>
            </div>
          </Link>
          <Link href="/services/suv" className="w-3/4 border-t border-gray-200">
            <div className="pt-2 flex justify-between">
              <div className="flex flex-col">
                <p className="text-[16px]">SUV</p>
                <div className="flex gap-4 items-center">
                  <div className="flex text-[16px] text-black gap-1">
                    <PersonRoundedIcon />
                    <p>5</p>
                  </div>
                  <div className="flex text-[16px] text-black gap-1">
                    <WorkRoundedIcon />
                    <p>4-5</p>
                  </div>
                </div>
                <p className="text-[14px] text-[#8F8F8F] mt-2">
                  Cadillac Escalade or similar
                </p>
              </div>
              <div className="">
                <ArrowBackIosNewRoundedIcon className="rotate-180" />
              </div>
            </div>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
