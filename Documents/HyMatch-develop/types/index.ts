export interface Job {
  id: string;
  title: string;
  jobType: JobType;
  salary: {
    min: number;
    max: number;
  };
  japaneseLevel: JapaneseLevel;
  commutingTime: number; // in minutes
  availableDays: DayOfWeek[];
  appealingPoints: string[];
  location: string;
  postedDate: Date;
  description: string;
}

export type JobType =
  | "cooking"
  | "customer_service"
  | "cleaning"
  | "factory"
  | "delivery"
  | "hotel"
  | "warehouse"
  | "office"
  | "retail";

export type JapaneseLevel = "N1" | "N2" | "N3" | "N4" | "N5";

export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface UserProfile {
  id: string;
  basicInfo: {
    firstName: string;
    lastName: string;
    age: number;
    profilePhoto?: string;
  };
  nationality: {
    country: string;
    gender: "male" | "female" | "other";
  };
  stationInfo: {
    homeStation: string;
    homeWalkTime: number; // in minutes
    schoolStation: string;
    schoolWalkTime: number; // in minutes
  };
  address: {
    postalCode: string;
    prefecture: string;
    city1: string;
    city2: string;
    streetAddress: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  visa: {
    currentType: string;
    currentImage?: string;
    plannedType?: string;
    plannedImage?: string;
  };
  other: {
    japaneseLevel: JapaneseLevel;
    preferredDays: DayOfWeek[];
    currentOccupation: string;
    desiredOccupation: string;
    workHistory: string;
  };
}

export interface JobMatch {
  jobId: string;
  userId: string;
  action: "like" | "dislike";
  timestamp: Date;
}

export interface FilterOptions {
  jobTypes: JobType[];
  japaneseLevel?: JapaneseLevel;
  salaryRange: {
    min: number;
    max: number;
  };
  commutingConvenience: string[];
  importantFactors: string[];
}

export interface SortOption {
  type: "salary" | "commutingTime" | "postingDate";
  direction: "asc" | "desc";
}

export type Language = "ja" | "en" | "uz";
