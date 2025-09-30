export interface SimpleServiceContent {
  title: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  mainDescription: string;
  features: Array<{
    title: string;
    description: string;
  }>;
}

export const simpleServiceContent: Record<string, SimpleServiceContent> = {
  "business-transfer": {
    title: "Business Transfer",
    description:
      "An elevated, professional service for all of your business needs. Our smooth and reliable business class promises impeccably maintained vehicles, a smartly dressed chauffeur and a personalised journey. Arrive at or depart your next meeting, dinner or flight in optimal time — and comfort.",
    heroImage: "/images/business-transfer-img.webp",
    heroImageAlt: "Executive Mercedes-E-Class",
    mainDescription:
      "At Jo Limo, we know business doesn't stop between destinations. That's why our service offers more than transport — it's a space to focus, relax, or stay connected. Your chauffeur remains discreet and flexible, adapting to your schedule so your day runs smoothly and professionally.",
    features: [
      {
        title: "EFFORTLESS ARRIVAL",
        description:
          "Having the same trusted chauffeur throughout the day allows you to leave extra belongings with them between stops — from bags to umbrellas to coats. They can also fetch items from your home or office, ensuring you always have what you need — and only what you need — at every appointment.",
      },
      {
        title: "BUSINESS-CLASS SUPPORT",
        description:
          "More than just a ride, our chauffeurs provide reliable support throughout your itinerary. Need to drop off contracts, swing by multiple locations, or coordinate a discreet airport pickup for a VIP? Consider it done — all with the professionalism that reflects your brand and expectations.",
      },
      {
        title: "TAILORED TO YOUR SCHEDULE",
        description:
          "Meetings change, schedules shift — and Jo Limo adapts with you. Your chauffeur remains ready and available for any adjustments, offering the flexibility today's fast-paced business world demands. Leave instructions in advance, or communicate throughout the journey — your comfort and efficiency remain our top priority.",
      },
    ],
  },
  "event-chauffeur": {
    title: "Event Chauffeur",
    description:
      "A new essential: select patrons may now reserve their chauffeur for up to an entire day — bringing unparalleled freedom and convenience to a full schedule.",
    heroImage: "/images/event-chaffeur-img.webp",
    heroImageAlt: "Executive Mercedes-E-Class",
    mainDescription:
      "Whether it's a wedding, business function, private dinner, or a full day of back-to-back events, our Event Chauffeur service is designed to make your day effortless and stress-free.",
    features: [
      {
        title: "FREEDOM OF MOVEMENT",
        description:
          "With a dedicated Jo Limo chauffeur by your side throughout the day, you can move between events effortlessly — leaving coats, bags, or extra belongings securely in the vehicle between stops. Need something from home or the office? Your chauffeur can retrieve it, so you're never without what you need, and never burdened by what you don't.",
      },
      {
        title: "TRUSTED ASSISTANCE",
        description:
          "While you focus on your event — whether it's a wedding, corporate function, or family celebration — your chauffeur helps reclaim your time by taking care of the small but important details. From delivering urgent items to picking up a guest on your behalf, Jo Limo chauffeurs go beyond driving to support your entire schedule with grace and discretion.",
      },
      {
        title: "TOTAL FLEXIBILITY",
        description:
          "Every moment matters. With Jo Limo's Event Chauffeur service, you're in control of your day — no rigid pickups, no pressure. Simply plan your day your way, and let us handle the rest. Instructions can be arranged in advance to ensure your experience feels completely personal and stress-free.",
      },
    ],
  },
  excursion: {
    title: "Excursion",
    description:
      "Explore Jordan in comfort with Jo Limo's tailored excursion service. Whether visiting historic sites or scenic landscapes, our fleet ensures a seamless, comfortable journey with your chauffeur handling the details.",
    heroImage: "/images/excursion-img.webp",
    heroImageAlt: "Executive Mercedes-E-Class",
    mainDescription:
      "From Petra's ancient wonders to the Dead Sea's calm shores, every Jo Limo trip is tailored to your pace. Explore freely while your chauffeur handles the details — turning every journey into a smooth, memorable experience.",
    features: [
      {
        title: "CUSTOMIZED ITINERARIES",
        description:
          "Whether you want a full-day adventure or a relaxed half-day outing, we tailor every trip to your interests, timing, and pace — with no fixed schedules holding you back.",
      },
      {
        title: "SEAMLESS COMFORT",
        description:
          "Travel in a well-maintained, air-conditioned vehicle with a professional chauffeur who handles the driving, parking, and logistics — so you can focus on the experience.",
      },
      {
        title: "LOCAL INSIGHT & ASSISTANCE",
        description:
          "Our chauffeurs offer more than just transportation. With local knowledge and courteous service, they're ready to assist, recommend hidden gems, and adapt as your day unfolds.",
      },
    ],
  },
  "travel-partner-concierge-assistant": {
    title: "Travel Partner (Concierge Assistant)",
    description:
      "Our exclusive concierge service is always just a phone call or email away. Whether you need help with local information, discounts, lost items, or translation, our multilingual team is available around the clock to assist you.",
    heroImage: "/images/TPCA-img.webp",
    heroImageAlt: "Executive Mercedes-E-Class",
    mainDescription:
      "Save your time and energy for what truly matters. With Jo Limo, a trusted chauffeur can take care of your tasks with the utmost care and professionalism. This premium service is available both on-demand and for pre-scheduled bookings.",
    features: [
      {
        title: "PREMIUM PERSONAL SERVICE",
        description:
          "This service is crafted for tasks requiring trust, attention to detail, and care—whether it's delivering confidential documents, or personally presenting a thoughtful gift or invitation cards. Your chauffeur can even stand in line for exclusive events.",
      },
      {
        title: "SEAMLESS, PRIVATE COMMUNICATION",
        description:
          "Share detailed instructions, make personalized requests, and communicate directly with your chauffeur through the app. Your phone number remains secure, and the chat stays active until the task is completed to your satisfaction.",
      },
      {
        title: "ADAPTABLE AND PROFESSIONAL SUPPORT",
        description:
          "Should unexpected situations arise, such as store closures, unavailable items, or delivery challenges, your chauffeur will handle the matter with professionalism and resourcefulness, ensuring the task is completed smoothly and efficiently.",
      },
    ],
  },
};
