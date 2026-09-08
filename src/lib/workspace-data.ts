/**
 * validly workspace data - one canonical Germany story.
 * All numbers verified: €688 spend ÷ 8 orders = €86 probe CAC.
 */

export const HEELY = {
  name: "Heely",
  city: "Copenhagen",
  category: "Comfort heels",
  platform: "Shopify",
  product: "The All-Day Heel",
  price: "€189",
  home: "Denmark",
  homeCac: "€49",
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
  budgetCap: string;
  actualSpend: string;
  reelViews: number;
  engaged: number;
  pageVisits: number;
  addToCarts: number;
  orders: number;
  probeCac: string;
  homeCac: string;
  cacVsHome: string;
  verdict: VerdictKey;
  peers: {
    n: number;
    medianCac: string;
    scaledBand: string;
    ranking: string;
    preEntryYou: string;
    preEntryPeer: string;
    scaledCount: string;
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
  budgetCap: "€2,000",
  actualSpend: "€688",
  reelViews: 92400,
  engaged: 3180,
  pageVisits: 214,
  addToCarts: 31,
  orders: 8,
  probeCac: "€86",
  homeCac: "€49",
  cacVsHome: "1.76×",
  verdict: "NOT YET",
  peers: {
    n: 6,
    medianCac: "€68",
    scaledBand: "€59–€74",
    ranking: "Worse than 5 of 6 peers",
    preEntryYou: "0.22×",
    preEntryPeer: "0.38×",
    scaledCount: "4 of 6",
  },
  why: "Heely acquired German customers at €86. The peer median is €68, and brands that later scaled landed between €59 and €74. Heely is currently outside the viable range.",
  whatChanges: "Bring probe CAC into the €59 to €74 range for two consecutive rounds.",
  routes: [
    {
      title: "Localize checkout and returns",
      desc: "Remove German purchase friction before buying more traffic.",
      badge: "Recommended",
    },
    {
      title: "Test the offer",
      desc: "Keep the product and market fixed, then test price and messaging against orders.",
    },
    {
      title: "Retail partner first",
      desc: "Validate repeat demand locally before holding German inventory.",
    },
  ],
};

export const PROBE_DESIGN = [
  { label: "Traffic", value: "DE-01 · problem-led" },
  { label: "Storefront", value: "German product page" },
  { label: "Decision metric", value: "Orders and implied CAC" },
];

export const PEER_FILTERS = ["Footwear & apparel", "Germany", "Nordic DTC", "AOV €150–€220"];
