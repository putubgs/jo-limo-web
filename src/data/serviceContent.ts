export interface ServiceContent {
  title: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  sectionTitle: string;
  sectionDescription: string;
  sectionImage: string;
  sectionImageAlt: string;
  hasReserveButton?: boolean;
  luggageCapacity: {
    description: string;
    sizes: Array<{
      size: string;
      dim: string;
    }>;
  };
  passengerCapacity: {
    description: string;
    capacity: string;
  };
}

export const serviceContent: Record<string, ServiceContent> = {
  executive: {
    title: "Executive",
    description:
      "Experience the next generation of executive service with the Mercedes-E-Class. Offering ample luggage space and exceptional comfort, this model is perfect for both urban and intercity business travel, delivering the sophistication modern professionals expect.",
    heroImage: "/images/executive-img.webp",
    heroImageAlt: "Executive Mercedes-E-Class",
    sectionTitle: "UNCOMPROMISED QUALITY, EVERY TIME",
    sectionDescription:
      "Step into refined sophistication with the Mercedes-Benz E-Class, the ideal choice for business professionals and discerning travelers. Driven by a professional Jo Limo chauffeur, this Executive Class service blends sleek design, smooth performance, and tailored comfort to elevate your journey.",
    sectionImage: "/images/services-img-1.webp",
    sectionImageAlt: "Executive service detail",
    hasReserveButton: true,
    luggageCapacity: {
      description:
        "Business Class vehicles can comfortably seat three passengers, and seat a maximum of four passengers when the armrest is raised. The boot has plenty of space for all travel essentials – including up to three cabin bags. Please refer to the table below for further details on Business Class luggage capacity.",
      sizes: [
        { size: "3×Cabin", dim: "55×40×25" },
        { size: "or 2×Medium (M)", dim: "66×44×27" },
        { size: "or 2×Large (L)", dim: "75×52×31" },
        { size: "or 1×Extra Large (XL)", dim: "81×55×36" },
      ],
    },
    passengerCapacity: {
      description:
        "Business Class vehicles can comfortably seat three passengers, and seat a maximum of four passengers when the armrest is raised. The boot has plenty of space for all travel essentials – including up to three cabin bags. Please refer to the table below for further details on Business Class luggage capacity.",
      capacity: "2 - 3 Passengers",
    },
  },
  luxury: {
    title: "Luxury",
    description:
      "Experience unparalleled luxury with the Mercedes S-Class. Designed for the ultimate comfort and elegance, this model offers spacious interiors and advanced features, making it the perfect choice for those seeking a premium, sophisticated travel experience.",
    heroImage: "/images/luxury-img.webp",
    heroImageAlt: "Executive Mercedes-E-Class",
    sectionTitle: "ONLY THE BEST, NOTHING LESS",
    sectionDescription:
      "Indulge in the ultimate luxury with the Mercedes-Benz E-Class, a masterpiece of comfort and style. Expertly driven by a professional Jo Limo chauffeur, this vehicle offers an unparalleled experience for those who demand the best.",
    sectionImage: "/images/img-lp-1.webp",
    sectionImageAlt: "Executive service detail",
    hasReserveButton: false,
    luggageCapacity: {
      description:
        "Business Class vehicles can comfortably seat three passengers, and seat a maximum of four passengers when the armrest is raised. The boot has plenty of space for all travel essentials – including up to three cabin bags. Please refer to the table below for further details on Business Class luggage capacity.",
      sizes: [
        { size: "3×Cabin", dim: "55×40×25" },
        { size: "or 2×Medium (M)", dim: "66×44×27" },
        { size: "or 2×Large (L)", dim: "75×52×31" },
        { size: "or 1×Extra Large (XL)", dim: "81×55×36" },
      ],
    },
    passengerCapacity: {
      description:
        "Business Class vehicles can comfortably seat three passengers, and seat a maximum of four passengers when the armrest is raised. The boot has plenty of space for all travel essentials – including up to three cabin bags. Please refer to the table below for further details on Business Class luggage capacity.",
      capacity: "2 - 3 Passengers",
    },
  },
  mpv: {
    title: "MPV",
    description:
      "Chauffeur-driven Mercedes-Benz V-Class vehicles with enough room for five passengers and a full holiday's worth of luggage. Designed for families — with extended boot space and a child seat available upon request.",
    heroImage: "/images/mpv-img.webp",
    heroImageAlt: "Executive Mercedes-E-Class",
    sectionTitle: "LUXURY WITH VERSATILITY",
    sectionDescription:
      "Travel in style with chauffeur-driven Mercedes-Benz V-Class vehicles, perfect for families. Designed to comfortably seat up to five passengers, these vehicles offer extended boot space, accommodating a full holiday's worth of luggage. Child seats are also available upon request for added convenience.",
    sectionImage: "/images/services-img-1.webp",
    sectionImageAlt: "Executive service detail",
    hasReserveButton: false,
    luggageCapacity: {
      description:
        "Business Class vehicles can comfortably seat three passengers, and seat a maximum of four passengers when the armrest is raised. The boot has plenty of space for all travel essentials – including up to three cabin bags. Please refer to the table below for further details on Business Class luggage capacity.",
      sizes: [
        { size: "6×Cabin", dim: "55×40×25" },
        { size: "or 5×Medium (M)", dim: "66×44×27" },
        { size: "or 4×Large (L)", dim: "75×52×31" },
        { size: "or 3×Extra Large (XL)", dim: "81×55×36" },
      ],
    },
    passengerCapacity: {
      description:
        "Business Class vehicles can comfortably seat three passengers, and seat a maximum of four passengers when the armrest is raised. The boot has plenty of space for all travel essentials – including up to three cabin bags. Please refer to the table below for further details on Business Class luggage capacity.",
      capacity: "2 - 3 Passengers",
    },
  },
  suv: {
    title: "SUV",
    description:
      "Experience JO's most refined class to date, featuring the latest Cadillac Escalade. Enjoy a spacious cabin, generous luggage capacity, and premium amenities. Whether navigating the city or exploring the countryside, SUV Class ensures unmatched comfort for every journey.",
    heroImage: "/images/img-lp-2.webp",
    heroImageAlt: "Executive Mercedes-E-Class",
    sectionTitle: "READY FOR ANY JOURNEY",
    sectionDescription:
      "Experience luxury and space with our chauffeur-driven Cadillac Escalade, accommodating up to five passengers and their luggage. Perfect for family outings, business travel, or airport pickups, the Escalade seamlessly blends elegance and practicality for every trip.",
    sectionImage: "/images/services-img-2.webp",
    sectionImageAlt: "Executive service detail",
    hasReserveButton: false,
    luggageCapacity: {
      description:
        "Business Class vehicles can comfortably seat three passengers, and seat a maximum of four passengers when the armrest is raised. The boot has plenty of space for all travel essentials – including up to three cabin bags. Please refer to the table below for further details on Business Class luggage capacity.",
      sizes: [
        { size: "5×Cabin", dim: "55×40×25" },
        { size: "or 4×Medium (M)", dim: "66×44×27" },
        { size: "or 3×Large (L)", dim: "75×52×31" },
        { size: "or 2×Extra Large (XL)", dim: "81×55×36" },
      ],
    },
    passengerCapacity: {
      description:
        "Business Class vehicles can comfortably seat three passengers, and seat a maximum of four passengers when the armrest is raised. The boot has plenty of space for all travel essentials – including up to three cabin bags. Please refer to the table below for further details on Business Class luggage capacity.",
      capacity: "2 - 3 Passengers",
    },
  },
};
