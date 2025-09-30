export interface ServiceInfoContent {
  title: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  sectionTitle: string;
  sectionDescription: string;
  tableData: Array<{
    category: string;
    routes: string[];
  }>;
  hasViewRatesButton: boolean;
  modalComponent?: string; // Component name for the modal
}

export const serviceInfoContent: Record<string, ServiceInfoContent> = {
  "airport-transfer": {
    title: "Airport Transfer",
    description:
      "Arrive stress-free with Jo Limo's premium airport transfer service from Queen Alia Airport to Aqaba. Our professional drivers track your flight, manage delays, and ensure a smooth, comfortable ride straight to your destination. Relax and enjoy the journey with Jo Limo.",
    heroImage: "/images/airport-transfer-img.webp",
    heroImageAlt: "Executive Mercedes-E-Class",
    sectionTitle: "SEAMLESS AIRPORT TRAVEL",
    sectionDescription:
      "Enjoy a seamless airport transfer with our premium service. Our professional chauffeurs ensure timely, comfortable, and stress-free rides in well-maintained vehicles. We prioritize your convenience, making your airport journey effortless and enjoyable.",
    tableData: [
      {
        category: "Queen Alia International Airport (QAIA)",
        routes: ["QAIA - Amman City", "Amman City - QAIA"],
      },
      {
        category: "King Hussein International Airport (AQJ)",
        routes: ["AQJ - Aqaba City", "AQJ - Tala Bay"],
      },
      {
        category: "Border Crossing",
        routes: [
          "KHB to Amman City",
          "B1R to Amman City",
          "Wadi Araba to Aqaba City",
        ],
      },
    ],
    hasViewRatesButton: true,
    modalComponent: "AirportModal",
  },
  "city-to-city-transfer": {
    title: "City-to-City Transfer",
    description:
      "Travel effortlessly between cities with Jo Limo. Enjoy a smooth, comfortable ride with professional chauffeurs ensuring you arrive relaxed and on time.",
    heroImage: "/images/intercity-transfer-img.webp",
    heroImageAlt: "Executive Mercedes-E-Class",
    sectionTitle: "YOUR LINK BETWEEN DESTINATION",
    sectionDescription:
      "Travel between cities with ease and comfort using our premium intercity service. Whether for business or leisure, our professional chauffeurs ensure a smooth and seamless journey tailored to your needs. With spacious, well-maintained vehicles, we offer a stress-free experience so you can focus on what matters most. Our door-to-door service provides personalized attention, guaranteeing reliable and efficient travel. We prioritize your comfort and convenience, ensuring that every trip is an enjoyable and effortless journey, no matter the distance.",
    tableData: [
      {
        category: "AIRPORT TRANSFER",
        routes: ["QAIA to Amman City (40km)", "AQJ to Aqaba City (10km)"],
      },
      {
        category: "BORDER CROSSING",
        routes: ["KHB to Amman City (57km)", "B1R to Amman City (90km)"],
      },
      {
        category: "NORTHERN CITY-TO-CITY TRANSFER",
        routes: [
          "Amman to Jerash (52km)",
          "Amman to Ajloun (76km)",
          "Amman to Al Ramtha (76km)",
          "Amman to Um Qais (120km)",
          "Amman to Anjara (77km)",
        ],
      },
      {
        category: "SOUTHERN CITY-TO-CITY TRANSFER",
        routes: [
          "Wadi Araba to Aqaba City (9km)",
          "Amman to Dead Sea (60km)",
          "Amman to Petra (235km)",
          "Amman to Wadi Rum (310km)",
          "Amman to Aqaba (330km)",
          "Amman to Baptism site (53km)",
          "Amman to Wadi Mujib (83km)",
          "Amman to Madaba (32km)",
          "Amman to Dessert Castle (85km)",
          "Amman to Dana Nature Reserve (205km)",
          "Amman to Ma'in Hot Springs (75km)",
        ],
      },
    ],
    hasViewRatesButton: true,
    modalComponent: "IntercityModal",
  },
  "hourly-and-full-day-hire": {
    title: "Hourly and Full Day Hire",
    description:
      "Choose from our flexible hourly chauffeur service or a full-day driver for your personal or business needs. Enjoy comfort, convenience, and professional service tailored to your schedule.",
    heroImage: "/images/services-img-2.webp",
    heroImageAlt: "Executive Mercedes-E-Class",
    sectionTitle: "YOUR JOURNEY, YOUR SCHEDULE",
    sectionDescription:
      "Whether for a few hours or a full day, our flexible chauffeur service meets your needs. From business meetings to city exploration, our professional drivers ensure a seamless, comfortable journey. With luxury vehicles and personalized attention, you can enjoy a hassle-free, convenient travel experience. Let us elevate your journey with exceptional service.",
    tableData: [
      {
        category: "EXECUTIVE - MERCEDES E-CLASS",
        routes: [
          "25 JOD/hour (3hour*)",
          "120 JOD (Half-Day)",
          "180 JOD (Full-Day)",
        ],
      },
      {
        category: "LUXURY - MERCEDES S-CLASS",
        routes: [
          "35 JOD/hour (< 3hour)",
          "150 JOD (Half-Day)",
          "260 JOD (Full-Day)",
        ],
      },
      {
        category: "MPV - MERCEDES V-CLASS",
        routes: [
          "45 JOD/hour (< 3hour)",
          "170 JOD (Half-Day)",
          "300 JOD (Full-Day)",
        ],
      },
      {
        category: "SUV - CADILLAC ESCALADE",
        routes: [
          "30 JOD/hour (< 3hour)",
          "120 JOD (Half-Day)",
          "200 JOD (Full-Day)",
        ],
      },
    ],
    hasViewRatesButton: true,
    modalComponent: "HourlyModal",
  },
};
