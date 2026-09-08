/** Validly workspace data for one canonical organic Germany probe. */

export const HEELY = {
  name: "Heely",
  city: "Copenhagen",
  category: "Comfort heels",
  platform: "Shopify",
  product: "The All-Day Heel",
  price: "€189",
  home: "Denmark",
  headline: "Heels you can wear all day.",
};

export type CountryCode = "DE" | "NL" | "FR" | "SE";

export type DemandRow = {
  code: CountryCode;
  country: string;
  flag: string;
  sessions: number;
  orders: number;
  index: string;
  status: "recommended" | "ambiguous" | "thin" | "weak";
  note: string;
  action: string;
  disabled?: boolean;
};

export const DEMAND: DemandRow[] = [
  {
    code: "NL",
    country: "Netherlands",
    flag: "🇳🇱",
    sessions: 9340,
    orders: 214,
    index: "0.61×",
    status: "recommended",
    note: "Recommended next",
    action: "Recommended next",
  },
  {
    code: "DE",
    country: "Germany",
    flag: "🇩🇪",
    sessions: 18900,
    orders: 96,
    index: "0.22×",
    status: "ambiguous",
    note: "Ambiguous · needs proof",
    action: "Test Germany",
  },
  {
    code: "SE",
    country: "Sweden",
    flag: "🇸🇪",
    sessions: 2310,
    orders: 41,
    index: "0.35×",
    status: "thin",
    note: "Too thin to test",
    action: "",
    disabled: true,
  },
  {
    code: "FR",
    country: "France",
    flag: "🇫🇷",
    sessions: 6120,
    orders: 18,
    index: "0.09×",
    status: "weak",
    note: "Weak signal",
    action: "",
    disabled: true,
  },
];

export type VerdictKey = "GO" | "NOT YET" | "NO-GO";

export type ProbeResult = {
  country: CountryCode;
  countryName: string;
  flag: string;
  product: string;
  price: string;
  duration: string;
  reelViews: number;
  engaged: number;
  pageVisits: number;
  addToCarts: number;
  orders: number;
  viewToVisit: string;
  addToCartRate: string;
  pageConversion: string;
  revenuePerVisit: string;
  verdict: VerdictKey;
  peers: {
    n: number;
    medianConversion: string;
    scaledBand: string;
    ranking: string;
    visitRateYou: string;
    visitRatePeer: string;
    addToCartRate: string;
    revenuePerVisit: string;
    scaledCount: string;
    routeMix: string;
  };
  why: string;
  whatChanges: string;
  routes: { title: string; desc: string; badge?: string }[];
};

export const PROBE: ProbeResult = {
  country: "DE",
  countryName: "Germany",
  flag: "🇩🇪",
  product: "The All-Day Heel",
  price: "€189",
  duration: "14 days",
  reelViews: 92400,
  engaged: 3180,
  pageVisits: 214,
  addToCarts: 31,
  orders: 8,
  viewToVisit: "0.23%",
  addToCartRate: "14.5%",
  pageConversion: "3.7%",
  revenuePerVisit: "€7.07",
  verdict: "NOT YET",
  peers: {
    n: 6,
    medianConversion: "5.2%",
    scaledBand: "4.8% to 6.4%",
    ranking: "Worse than 5 of 6 peers",
    visitRateYou: "0.23%",
    visitRatePeer: "0.35%",
    addToCartRate: "16.8%",
    revenuePerVisit: "€9.40",
    scaledCount: "4 of 6",
    routeMix: "3 localized DTC · 1 retail-first",
  },
  why: "Eight German customers bought, but only 3.7% of tracked product-page visitors converted. Comparable brands reached a 5.2% median, and later scalers landed between 4.8% and 6.4%.",
  whatChanges: "Bring product-page conversion into the 4.8% to 6.4% range for two consecutive probes.",
  routes: [
    {
      title: "Localize checkout and returns",
      desc: "Remove German purchase friction before driving more traffic.",
      badge: "Recommended",
    },
    {
      title: "Test the offer",
      desc: "Keep the product and market fixed, then test price and messaging against completed orders.",
    },
    {
      title: "Retail partner first",
      desc: "Validate repeat demand locally before holding German inventory.",
    },
  ],
};

export const PROBE_DESIGN = [
  { label: "Content", value: "DE-01 · organic reel" },
  { label: "Destination", value: "Tracked German product page" },
  { label: "Decision metric", value: "Orders and conversion" },
];

export const PEER_FILTERS = ["Footwear & apparel", "Germany", "Nordic DTC", "AOV €150–€220"];
