"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

const SERVICES = [
  {
    key: "executive",
    label: "Executive",
    url: "/services/executive",
    subtitle: "Mercedes S-Class",
    imageSrc: "/images/executive-img.webp",
  },
  {
    key: "luxury",
    label: "Luxury",
    url: "/services/luxury",
    subtitle: "Mercedes S-Class",
    imageSrc: "/images/luxury-img.webp",
  },
  {
    key: "mpv",
    label: "MPV",
    url: "/services/mpv",
    subtitle: "Mercedes V-Class",
    imageSrc: "/images/mpv-img.webp",
  },
  {
    key: "suv",
    label: "SUV",
    url: "/services/suv",
    subtitle: "Cadillac Escalade",
    imageSrc: "/images/img-lp-2.webp",
  },
];

export default function OtherVehicleClasses() {
  const pathname = usePathname() || "";
  const current = pathname.split("/").pop() || "";
  const others = SERVICES.filter((svc) => svc.key !== current);

  return (
    <section className="py-16 px-40 border-t border-gray-200">
      <h2 className="text-start text-[16px] mb-12">
        OTHER AVAILABLE VEHICLE CLASSES
      </h2>

      <div className="flex gap-16">
        {others.map((svc) => (
          <Link
            key={svc.key}
            href={svc.url}
            className="group flex flex-col items-start"
          >
            <div className="w-[241px] h-[176px] relative overflow-hidden">
              <Image
                src={svc.imageSrc}
                alt={svc.label}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="mt-4 text-[24px] flex items-center gap-2">
              <span>{svc.label.toUpperCase()}</span>
              <ArrowBackIosNewRoundedIcon
                className="w-4 h-4 rotate-180 text-gray-600
                            transition-colors"
              />
            </h3>

            <p className="text-gray-500">{svc.subtitle}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
