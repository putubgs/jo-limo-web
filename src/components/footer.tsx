import Image from "next/image";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

export default function Footer() {
  return (
    <div
      className="relative bg-[#FCFAF9]
    flex flex-col items-start px-[200px] justify-center pt-[100px] pb-10
    bg-[url('/images/black-line-footer.png')] bg-contain bg-no-repeat
    w-full h-[620px] border-t gap-20"
    >
      <div className="flex items-start justify-center gap-[200px] relative z-20">
        <Image
          alt="Jo Limo Logo"
          src="/images/jolimo-logo.png"
          width={106}
          height={106}
        />

        <div className="flex text-[18px] gap-20">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <p>AIRPORT TRANSFER</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
            <div className="flex gap-3 items-center">
              <p>INTERCITY TRANSFER</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
            <div className="flex gap-3 items-center">
              <p>BUSINESS TRANSFER</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
            <div className="flex gap-3 items-center">
              <p>HOURLY AND FULL DAY HIRE</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
            <div className="flex gap-3 items-center">
              <p>EVENT CHAUFFEUR</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
            <div className="flex gap-3 items-center">
              <p>TRAVEL PARTNER CONCIERGE</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
            <div className="flex gap-3 items-center">
              <p>EXCURSION</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <p>ABOUT JO LIMO</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
            <div className="flex gap-3 items-center">
              <p>MEMBERSHIP</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
            <div className="flex gap-3 items-center">
              <p>CORPORATE MOBILITY</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
            <div className="flex gap-3 items-center">
              <p>CONTACT</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <p>PRIVACY POLICY</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
            <div className="flex gap-3 items-center">
              <p>LEGAL TERMS</p>
              <ArrowBackIosNewRoundedIcon className="transform rotate-180 text-[20px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full text-center">
        © 2025 Jordan Limousine Services LLC.
      </div>
      <div
        className="absolute top-0 left-0 w-full h-[180px]
      bg-gradient-to-b from-white to-transparent
      pointer-events-none
      z-10"
      />
    </div>
  );
}
