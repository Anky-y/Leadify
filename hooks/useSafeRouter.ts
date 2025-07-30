"use client";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

export function useSafeRouter(isSearching: boolean) {
  const router = useRouter();
  const isPrompting = useRef(false);

  const confirmNavigation = useCallback(async () => {
    if (isPrompting.current) return false;
    isPrompting.current = true;
    const confirmed = window.confirm(
      "A search is currently running. Navigating away will cancel it. Continue?"
    );
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
