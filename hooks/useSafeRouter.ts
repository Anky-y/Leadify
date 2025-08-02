"use client";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { useUser } from "../app/context/UserContext";
export function useSafeRouter(isSearching: boolean) {
  const { user } = useUser();
  // const terminate = useRef(false);
  const router = useRouter();
  const isPrompting = useRef(false);

  const confirmNavigation = useCallback(async () => {
    if (isPrompting.current) return false;
    isPrompting.current = true;
    const confirmed = window.confirm(
      "A search is currently running. Navigating away will cancel it. Continue?"
    );
    if (confirmed){
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}Twitch_scraper/terminate`,
        {method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({user_id:user?.id}),
        }, 
       )
      // terminate.current = true;
    }
    isPrompting.current = false;
    return confirmed;
  }, []);

  const safePush = useCallback(
    async (href: string) => {
      if (isSearching) {
        if (await confirmNavigation()) {
          router.push(href);
        }
      } else {
        router.push(href);
      }
    },
    [isSearching, confirmNavigation, router]
  );

  const safeReplace = useCallback(
    async (href: string) => {
      if (isSearching) {
        if (await confirmNavigation()) {
          router.replace(href);
        }
      } else {
        router.replace(href);
      }
    },
    [isSearching, confirmNavigation, router]
  );

  return { safePush, safeReplace };
}
