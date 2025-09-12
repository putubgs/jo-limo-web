import Link from "next/link";
import Image from "next/image";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

export default function Footer() {
  const servicesLinks = [
    { label: "AIRPORT TRANSFER", href: "/services/airport-transfer" },
    { label: "CITY-TO-CITY TRANSFER", href: "/services/city-to-city-transfer" },
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
    {
      label: "FLAT RATE CITY TRANSFER",
      href: "/services/flat-rate-city-transfer",
    },
    { label: "EXCURSION", href: "/services/excursion" },
  ];

  const aboutLinks = [
    { label: "ABOUT JO LIMO", href: "/about-us" },
    { label: "MEMBERSHIP", href: "/membership" },
    { label: "B2B", href: "/b2b" },
    { label: "CONTACT", href: "/contact" },
  ];

  const legalLinks = [
    { label: "PRIVACY POLICY", href: "/privacy-policy" },
    { label: "LEGAL TERMS", href: "/legal-terms" },
  ];

  return (
    <div
      className="relative bg-[#FCFAF9]
        flex flex-col items-start px-4 md:px-[100px] justify-center
        pt-8 md:pt-[100px] pb-10
        bg-[url('/images/black-line-footer.png')] bg-contain bg-no-repeat
        w-full min-h-[500px] md:h-[620px] border-t gap-8 md:gap-20"
    >
      <div className="flex flex-col md:flex-row items-start md:justify-center gap-8 md:gap-[200px] relative z-20 mx-auto">
        <div className="flex flex-col gap-2 items-start w-full md:w-[350px]">
          <div className="flex gap-4 items-center">
            <p className="text-base md:text-[18px]">DOWNLOAD THE APP</p>
            <Image
              alt="Jo Limo Logo"
              src="/images/jolimo-app-logo.png"
              width={31}
              height={31}
              className="rounded-md"
            />
          </div>
          <p className="text-sm md:text-[14px]">
            Experience refined travel. <br />
            Available for iOS and Android.
          </p>
        </div>

        <div className="flex flex-col md:flex-row text-base md:text-[18px] gap-8 md:gap-20 w-full">
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

      <div className="flex flex-col gap-2 items-center w-full text-center font-plus-jakarta-sans">
        <p>© 2025 Jordan Limousine Services LLC.</p>
        <p>
          JORDAN LIMOUSINE SERVICES LLC. REGISTERED IN JORDAN WITH COMPANY
          NUMBER 200155494. <br />
          REGISTERED OFFICE: SHAREEF JAMIL BIN NASSER STREET. KING ABDULLAH
          GARDENS PO BOX 961003 AMMAN 11196 JORDAN.
        </p>
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
