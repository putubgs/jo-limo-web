// Pricing data and types for Intercity & Airport transfers
// Source: UI screenshots provided by client

export type ServiceClass = "executive" | "luxury" | "mpv" | "suv";

export interface RoutePrice {
  /** Description shown to the user */
  route: string;
  /** Prices for each service class (JOD) */
  prices: Record<ServiceClass, number>;
}

export interface Category {
  /** Collapsible category heading (e.g. "Southern Intercity Transfer") */
  name: string;
  routes: RoutePrice[];
}

export interface TransferGroup {
  /** Unique id used in code */
  id: "intercity" | "airport";
  /** Display title */
  title: string;
  categories: Category[];
}

// Southern & Northern inter-city routes (values taken from screenshots)
const intercityCategories: Category[] = [
  {
    name: "Southern Intercity Transfer",
    routes: [
      {
        route: "AMM to Dead Sea",
        prices: { executive: 45, luxury: 90, mpv: 95, suv: 110 },
      },
      {
        route: "AMM to Petra",
        prices: { executive: 177, luxury: 295, mpv: 305, suv: 284 },
      },
      {
        route: "AMM to Wadi Rum",
        prices: { executive: 195, luxury: 340, mpv: 358, suv: 298 },
      },
      {
        route: "AMM to Aqaba",
        prices: { executive: 202, luxury: 353, mpv: 372, suv: 319 },
      },
      {
        route: "AMM to Baptism site",
        prices: { executive: 61, luxury: 191, mpv: 202, suv: 151 },
      },
      {
        route: "AMM to Wadi Mujib",
        prices: { executive: 78, luxury: 198, mpv: 202, suv: 227 },
      },
      {
        route: "AMM to Madaba",
        prices: { executive: 34, luxury: 106, mpv: 92, suv: 106 },
      },
      {
        route: "AMM to Desert Castle",
        prices: { executive: 93, luxury: 198, mpv: 202, suv: 287 },
      },
      {
        route: "AMM to Dana Nature Reserve",
        prices: { executive: 166, luxury: 276, mpv: 287, suv: 202 },
      },
      {
        route: "AMM to Ma'in Hot Springs",
        prices: { executive: 85, luxury: 184, mpv: 177, suv: 163 },
      },
    ],
  },
  {
    name: "Northern Intercity Transfer",
    routes: [
      {
        route: "AMM to Jerash",
        prices: { executive: 119, luxury: 221, mpv: 187, suv: 164 },
      },
      {
        route: "AMM to Ajloun",
        prices: { executive: 131, luxury: 237, mpv: 198, suv: 191 },
      },
      {
        route: "AMM to Al Ramtha",
        prices: { executive: 131, luxury: 237, mpv: 198, suv: 191 },
      },
      {
        route: "AMM to Um Qais",
        prices: { executive: 149, luxury: 266, mpv: 227, suv: 269 },
      },
      {
        route: "AMM to Anjara",
        prices: { executive: 134, luxury: 241, mpv: 202, suv: 195 },
      },
    ],
  },
];

// Airport transfers (only MPV & SUV prices visible, exec/lux placeholders)*
const airportCategories: Category[] = [
  {
    name: "Queen Alia International Airport (AMM)",
    routes: [
      {
        route: "AMM - Amman City",
        prices: { executive: 60, luxury: 70, mpv: 90, suv: 75 },
      },
      {
        route: "Amman City - AMM",
        prices: { executive: 50, luxury: 60, mpv: 80, suv: 65 },
      },
    ],
  },
  {
    name: "Aqaba International Airport (AQJ)",
    routes: [
      {
        route: "AQJ - Aqaba City",
        prices: { executive: 30, luxury: 40, mpv: 45, suv: 35 },
      },
      {
        route: "AQJ - Tala Bay",
        prices: { executive: 60, luxury: 70, mpv: 85, suv: 70 },
      },
    ],
  },
];

export const transferPricing: TransferGroup[] = [
  {
    id: "intercity",
    title: "INTERCITY TRANSFER",
    categories: intercityCategories,
  },
  { id: "airport", title: "AIRPORT TRANSFER", categories: airportCategories },
];
