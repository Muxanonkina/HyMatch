import { changeLanguage } from "@/i18n";
import {
  FilterOptions,
  Job,
  JobMatch,
  Language,
  SortOption,
  UserProfile,
} from "@/types";
import React, { createContext, ReactNode, useContext, useReducer } from "react";

interface AppState {
  userProfile: UserProfile | null;
  jobs: Job[];
  likedJobs: Job[];
  dislikedJobs: Job[];
  jobMatches: JobMatch[];
  currentLanguage: Language;
  filterOptions: FilterOptions;
  sortOption: SortOption;
  isLoading: boolean;
}

type AppAction =
  | { type: "SET_USER_PROFILE"; payload: UserProfile }
  | { type: "UPDATE_USER_PROFILE"; payload: Partial<UserProfile> }
  | { type: "SET_JOBS"; payload: Job[] }
  | { type: "LIKE_JOB"; payload: Job }
  | { type: "DISLIKE_JOB"; payload: Job }
  | { type: "SET_LANGUAGE"; payload: Language }
  | { type: "SET_FILTER_OPTIONS"; payload: FilterOptions }
  | { type: "SET_SORT_OPTION"; payload: SortOption }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET_MATCHES" };

const initialState: AppState = {
  userProfile: null,
  jobs: [],
  likedJobs: [],
  dislikedJobs: [],
  jobMatches: [],
  currentLanguage: "ja",
  filterOptions: {
    jobTypes: [],
    salaryRange: { min: 0, max: 5000 },
    commutingConvenience: [],
    importantFactors: [],
  },
  sortOption: { type: "postingDate", direction: "desc" },
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER_PROFILE":
      return { ...state, userProfile: action.payload };

    case "UPDATE_USER_PROFILE":
      return {
        ...state,
        userProfile: state.userProfile
          ? { ...state.userProfile, ...action.payload }
          : null,
      };

    case "SET_JOBS":
      return { ...state, jobs: action.payload };

    case "LIKE_JOB":
      return {
        ...state,
        likedJobs: [...state.likedJobs, action.payload],
        jobMatches: [
          ...state.jobMatches,
          {
            jobId: action.payload.id,
            userId: state.userProfile?.id || "",
            action: "like",
            timestamp: new Date(),
          },
        ],
      };

    case "DISLIKE_JOB":
      return {
        ...state,
        dislikedJobs: [...state.dislikedJobs, action.payload],
        jobMatches: [
          ...state.jobMatches,
          {
            jobId: action.payload.id,
            userId: state.userProfile?.id || "",
            action: "dislike",
            timestamp: new Date(),
          },
        ],
      };

    case "SET_LANGUAGE":
      changeLanguage(action.payload);
      return { ...state, currentLanguage: action.payload };

    case "SET_FILTER_OPTIONS":
      return { ...state, filterOptions: action.payload };

    case "SET_SORT_OPTION":
      return { ...state, sortOption: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "RESET_MATCHES":
      return {
        ...state,
        likedJobs: [],
        dislikedJobs: [],
        jobMatches: [],
      };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  likeJob: (job: Job) => void;
  dislikeJob: (job: Job) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setLanguage: (language: Language) => void;
  setFilterOptions: (options: FilterOptions) => void;
  setSortOption: (option: SortOption) => void;
  resetMatches: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const likeJob = (job: Job) => {
    dispatch({ type: "LIKE_JOB", payload: job });
  };

  const dislikeJob = (job: Job) => {
    dispatch({ type: "DISLIKE_JOB", payload: job });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    dispatch({ type: "UPDATE_USER_PROFILE", payload: profile });
  };

  const setLanguage = (language: Language) => {
    dispatch({ type: "SET_LANGUAGE", payload: language });
  };

  const setFilterOptions = (options: FilterOptions) => {
    dispatch({ type: "SET_FILTER_OPTIONS", payload: options });
  };

  const setSortOption = (option: SortOption) => {
    dispatch({ type: "SET_SORT_OPTION", payload: option });
  };

  const resetMatches = () => {
    dispatch({ type: "RESET_MATCHES" });
  };

  const value: AppContextType = {
    state,
    dispatch,
    likeJob,
    dislikeJob,
    updateUserProfile,
    setLanguage,
    setFilterOptions,
    setSortOption,
    resetMatches,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
