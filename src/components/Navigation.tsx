import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-[#111111] text-white py-4 fixed w-full z-50 shadow-md">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <Image
            src="/images/jolimo-email-logo.png"
            alt="JO LIMO"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </a>
        <div className="hidden md:flex space-x-8 text-sm font-medium">
          <a href="#value-prop" className="hover:text-[#c5a059] transition">
            About
          </a>
          <a href="#fleet" className="hover:text-[#c5a059] transition">
            Fleet
          </a>
          <a href="#services" className="hover:text-[#c5a059] transition">
            Services
          </a>
        </div>
        <Link
          href="#bookingForm"
          className="bg-[#c5a059] text-black px-5 py-2 rounded text-sm font-bold hover:bg-white transition"
        >
          Check Rates
        </Link>
      </div>
    </nav>
  );
}
