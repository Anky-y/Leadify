"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "@/lib/utils/auth";
import type { Session as SupabaseSession } from "@supabase/supabase-js";

interface UserSessionContextValue {
  session: SupabaseSession | null;
  setSession: (session: SupabaseSession | null) => void;
  loading: boolean;
}

const UserSessionContext = createContext<UserSessionContextValue | null>(null);

export const UserSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        console.log("Fetching session...");
        const session = await getSession();
        setSession(session);
      } catch (err) {
        console.error("Failed to fetch session", err);
      } finally {
        setLoading(false); // Finished loading
      }
    }
    fetchSession();
  }, []);

  return (
    <UserSessionContext.Provider value={{ session, setSession, loading }}>
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error("useUserSession must be used within a UserSessionProvider");
  }
  return context;
};
