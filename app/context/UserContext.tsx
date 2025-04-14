// context/UserContext.tsx
"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getSession, getUserData } from "@/lib/utils/auth";
import type { Session } from "@supabase/supabase-js";
import type  User  from "../types/user"; // Assuming your User type

interface ContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  setSession: (s: Session | null) => void;
  setUser: (u: User | null) => void;
}

const UserContext = createContext<ContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const session = await getSession();
        setSession(session);

        if (session) {
          const user = await getUserData();
          setUser(user);
        }
      } catch (e) {
        console.error("Failed loading session/user", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <UserContext.Provider
      value={{ session, user, loading, setSession, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be inside UserProvider");
  return ctx;
};
