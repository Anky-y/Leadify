"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getUserSubscription } from "@/utils/subscription"; // Adjust path as needed

export interface Subscription {
  id: number;
  user_id: string;
  subscription_id: string;
  plan_id: string;
  status: string;
  renews_at: string | null;
  ends_at: string | null;
}

interface SubscriptionContextValue {
  subscription: Subscription | null;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null
);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSubscription = async () => {
    setLoading(true);
    const subData = await getUserSubscription();
    setSubscription(subData);
    setLoading(false);
  };

  useEffect(() => {
    refreshSubscription(); // Load on mount
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{ subscription, loading, refreshSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};
