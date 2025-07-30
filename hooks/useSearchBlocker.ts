"use client";
import { useEffect } from "react";

export function useSearchBlocker(isSearching: boolean) {
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isSearching) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSearching]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (isSearching && document.visibilityState === "hidden") {
        // Optionally, you could show a custom prompt here, but most browsers only allow beforeunload
        // So we rely on beforeunload for actual blocking
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSearching]);
}
