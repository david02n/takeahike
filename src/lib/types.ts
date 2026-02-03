export type PlanVariant = "A" | "B";

export type RouteSourceType =
  | "OS"
  | "ALLTRAILS"
  | "KOMOOT"
  | "NATIONAL_PARK"
  | "NATIONAL_TRAILS"
  | "NATIONAL_TRUST"
  | "FORESTRY_ENGLAND"
  | "JURASSIC_COAST"
  | "BLOG"
  | "COMMUNITY"
  | "OTHER";

export type RouteReference = {
  sourceType: RouteSourceType;
  title: string;
  url: string;
  note?: string;
  lastCheckedAt?: string;
};

export type HikeVariant = {
  title: string;
  durationHours: number;
  distanceKm: number;
  difficulty: "EASY" | "MODERATE_PLUS" | "CHALLENGING";
  characterTags: string[];
  routeReferences: RouteReference[];
};

export type WeekendOption = {
  id: string;
  area: { id: string; name: string };
  baseTown: { name: string; isBiggerTown: boolean };
  drive: { fromOriginMins: number | null; bandLabel: string };
  transportReturn: {
    type: "PT_RETURN_NO_TAXI";
    summary: string;
    steps: string[];
    confidence: "CURATED";
  };
  satHike: {
    planA: HikeVariant;
    planB: HikeVariant;
  };
  stayLinks: Array<{ townName: string; googleHotelUrl: string }>;
};

export type LodgingOption = {
  id: string;
  name: string;
  provider: "fixture" | "booking" | "expedia" | "airbnb" | "other";
  price: { currency: string; perNight: number; total: number; feesIncluded: boolean };
  rating: { score: number; count: number };
  policies: { refundable: boolean; freeCancelUntil: string | null; payLater: boolean };
  amenities: string[];
  accessibility: { stepFree: boolean; lift: boolean; notes?: string };
  distanceToTrailhead: { minutesByCar: number };
  url: string;
};

export type LodgingFixtureDb = {
  notes?: string;
  towns: Record<string, LodgingOption[]>;
};

export type LodgingSearchResponse = {
  townName: string;
  checkIn: string;
  nights: number;
  guests: number;
  options: LodgingOption[];
};

export type WeekendOptionsResponse = {
  originLabel: string;
  maxDriveMins: number;
  options: WeekendOption[];
  noResults: null | {
    reason: "NO_WITHIN_DRIVE_TIME" | "NO_PT_RETURN_OPTIONS";
    suggestions: Array<"INCREASE_DRIVE_TIME" | "ALLOW_TAXI_RETURN">;
  };
};
