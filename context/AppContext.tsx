import { mockJobs } from "@/data/mockJobs";
import { changeLanguage } from "@/i18n";
import {
  FilterOptions,
  Job,
  JobMatch,
  Language,
  SortOption,
  UserProfile,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

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
  | { type: "SET_LIKED_JOBS"; payload: Job[] }
  | { type: "SET_DISLIKED_JOBS"; payload: Job[] }
  | { type: "SET_LANGUAGE"; payload: Language }
  | { type: "SET_FILTER_OPTIONS"; payload: FilterOptions }
  | { type: "SET_SORT_OPTION"; payload: SortOption }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET_MATCHES" }
  | { type: "LOAD_STORED_DATA"; payload: Partial<AppState> };

const initialState: AppState = {
  userProfile: null,
  jobs: mockJobs,
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

// Storage keys
const STORAGE_KEYS = {
  LIKED_JOBS: "hymatch_liked_jobs",
  DISLIKED_JOBS: "hymatch_disliked_jobs",
  JOB_MATCHES: "hymatch_job_matches",
  USER_PROFILE: "hymatch_user_profile",
  LANGUAGE: "hymatch_language",
  FILTER_OPTIONS: "hymatch_filter_options",
  SORT_OPTION: "hymatch_sort_option",
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

    case "SET_LIKED_JOBS":
      return { ...state, likedJobs: action.payload };

    case "SET_DISLIKED_JOBS":
      return { ...state, dislikedJobs: action.payload };

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

    case "LOAD_STORED_DATA":
      return { ...state, ...action.payload };

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
  saveToStorage: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Save data to AsyncStorage
  const saveToStorage = async () => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.LIKED_JOBS, JSON.stringify(state.likedJobs)],
        [STORAGE_KEYS.DISLIKED_JOBS, JSON.stringify(state.dislikedJobs)],
        [STORAGE_KEYS.JOB_MATCHES, JSON.stringify(state.jobMatches)],
        [STORAGE_KEYS.USER_PROFILE, JSON.stringify(state.userProfile)],
        [STORAGE_KEYS.LANGUAGE, JSON.stringify(state.currentLanguage)],
        [STORAGE_KEYS.FILTER_OPTIONS, JSON.stringify(state.filterOptions)],
        [STORAGE_KEYS.SORT_OPTION, JSON.stringify(state.sortOption)],
      ]);
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  };

  // Load data from AsyncStorage
  const loadFromStorage = async () => {
    try {
      const [
        likedJobsStr,
        dislikedJobsStr,
        jobMatchesStr,
        userProfileStr,
        languageStr,
        filterOptionsStr,
        sortOptionStr,
      ] = await AsyncStorage.multiGet([
        STORAGE_KEYS.LIKED_JOBS,
        STORAGE_KEYS.DISLIKED_JOBS,
        STORAGE_KEYS.JOB_MATCHES,
        STORAGE_KEYS.USER_PROFILE,
        STORAGE_KEYS.LANGUAGE,
        STORAGE_KEYS.FILTER_OPTIONS,
        STORAGE_KEYS.SORT_OPTION,
      ]);

      const storedData: Partial<AppState> = {};

      if (likedJobsStr[1]) {
        storedData.likedJobs = JSON.parse(likedJobsStr[1]);
      }
      if (dislikedJobsStr[1]) {
        storedData.dislikedJobs = JSON.parse(dislikedJobsStr[1]);
      }
      if (jobMatchesStr[1]) {
        storedData.jobMatches = JSON.parse(jobMatchesStr[1]);
      }
      if (userProfileStr[1]) {
        storedData.userProfile = JSON.parse(userProfileStr[1]);
      }
      if (languageStr[1]) {
        storedData.currentLanguage = JSON.parse(languageStr[1]);
      }
      if (filterOptionsStr[1]) {
        storedData.filterOptions = JSON.parse(filterOptionsStr[1]);
      }
      if (sortOptionStr[1]) {
        storedData.sortOption = JSON.parse(sortOptionStr[1]);
      }

      dispatch({ type: "LOAD_STORED_DATA", payload: storedData });
    } catch (error) {
      console.error("Error loading from storage:", error);
    }
  };

  // Load data on app start
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Save data whenever relevant state changes
  useEffect(() => {
    saveToStorage();
  }, [
    state.likedJobs,
    state.dislikedJobs,
    state.jobMatches,
    state.userProfile,
    state.currentLanguage,
    state.filterOptions,
    state.sortOption,
  ]);

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
    saveToStorage,
    loadFromStorage,
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
