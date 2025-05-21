"use client"

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const showBorder = pathname !== "/";
  return (
    <div
      className={[
        "relative flex flex-col items-center justify-center",
        "bg-[url('/images/black-line-header.png')] bg-cover bg-top",
        "w-full h-52",
        showBorder ? "border-b" : "",
      ].join(" ")}
    >
      <div className="flex flex-col relative z-20 flex items-center gap-10">
        <Image
          alt="Jo Limo Logo"
          src="/images/jolimo-logo.png"
          width={82}
          height={82}
        />
        <div className="flex items-center gap-20">
          <div>SERVICES</div>
          <div>MEMBERSHIP</div>
          <div>CITIES & CLASSES</div>
          <div>CORPORATE MOBILITY</div>
          <div>RESERVE NOW</div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-[180px]
      bg-gradient-to-t from-white to-transparent
      pointer-events-none
      z-10"
      />
    </div>
  );
}
