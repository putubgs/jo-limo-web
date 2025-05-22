import Link from "next/link";
import Image from "next/image";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

export default function Footer() {
  const servicesLinks = [
    { label: "AIRPORT TRANSFER", href: "/services/airport-transfer" },
    { label: "INTERCITY TRANSFER", href: "/services/intercity-transfer" },
    { label: "BUSINESS TRANSFER", href: "/services/business-transfer" },
    {
      label: "HOURLY AND FULL DAY HIRE",
      href: "/services/hourly-and-full-day-hire",
    },
    { label: "EVENT CHAUFFEUR", href: "/services/event-chauffeur" },
    {
      label: "TRAVEL PARTNER CONCIERGE ASSISTANT",
      href: "/services/travel-partner-concierge-assistant",
    },
    { label: "EXCURSION", href: "/services/excursion" },
  ];

  const aboutLinks = [
    { label: "ABOUT JO LIMO", href: "/about" },
    { label: "MEMBERSHIP", href: "/membership" },
    { label: "CORPORATE MOBILITY", href: "/corporate-mobility" },
    { label: "CONTACT", href: "/contact" },
  ];

  const legalLinks = [
    { label: "PRIVACY POLICY", href: "/privacy-policy" },
    { label: "LEGAL TERMS", href: "/legal-terms" },
  ];

  return (
    <div
      className="relative bg-[#FCFAF9]
        flex flex-col items-start px-[100px] justify-center
        pt-[100px] pb-10
        bg-[url('/images/black-line-footer.png')] bg-contain bg-no-repeat
        w-full h-[620px] border-t gap-20"
    >
      <div className="flex items-start justify-center gap-[200px] relative z-20 mx-auto">
        <Image
          alt="Jo Limo Logo"
          src="/images/jolimo-logo.png"
          width={106}
          height={106}
        />

        <div className="flex text-[18px] gap-20 w-full">
          {/* Services Column */}
          <div className="flex flex-col gap-4">
            {servicesLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex gap-3 items-center hover:text-gray-600"
              >
                <span>{label}</span>
                <ArrowBackIosNewRoundedIcon
                  className="transform rotate-180 text-[20px]"
                  fontSize="inherit"
                />
              </Link>
            ))}
          </div>

          {/* About Column */}
          <div className="flex flex-col gap-4">
            {aboutLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex gap-3 items-center hover:text-gray-700"
              >
                <span>{label}</span>
                <ArrowBackIosNewRoundedIcon
                  className="transform rotate-180 text-[20px]"
                  fontSize="inherit"
                />
              </Link>
            ))}
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-4">
            {legalLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex gap-3 items-center hover:text-gray-700"
              >
                <span>{label}</span>
                <ArrowBackIosNewRoundedIcon
                  className="transform rotate-180 text-[20px]"
                  fontSize="inherit"
                />
              </Link>
            ))}
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
