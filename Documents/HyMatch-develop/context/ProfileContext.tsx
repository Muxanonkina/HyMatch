import React, { createContext, ReactNode, useContext, useState } from "react";

interface Profile {
  name: string;
  age: number;
  japaneseLevel: string;
  jobTypes: string[];
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (newProfile: Partial<Profile>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    age: 0,
    japaneseLevel: "",
    jobTypes: [],
  });

  const updateProfile = (newProfile: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("useProfile must be used within ProfileProvider");
  return context;
};
