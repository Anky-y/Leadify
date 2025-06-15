"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import type User from "@/app/types/user";
import { getUserData } from "@/utils/auth";

interface UserContextValue {
  user: User | null;
  loading: boolean;
  updateCredits: (delta: number) => void; // ✅ Optimistic update helper
  refreshUser: () => Promise<void>; // Add a function to refresh user data
}

const UserContext = createContext<UserContextValue | null>(null);
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    setLoading(true);
    const userData = await getUserData();
    setUser(userData);
    setLoading(false);
  };

  // ✅ Optimistic credit update
  const updateCredits = (delta: number) => {
    setUser((prev) =>
      prev ? { ...prev, credits: prev.credits + delta } : prev
    );
  };

  useEffect(() => {
    refreshUser(); // Fetch user data on mount
  }, []);
  return (
    <UserContext.Provider value={{ user, loading, refreshUser, updateCredits }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
