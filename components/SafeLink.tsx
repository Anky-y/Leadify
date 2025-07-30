"use client";
import React from "react";
import { useSafeRouter } from "@/hooks/useSafeRouter";

interface SafeLinkProps {
  href: string;
  isSearching: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SafeLink({
  href,
  isSearching,
  children,
  className,
}: SafeLinkProps) {
  const { safePush } = useSafeRouter(isSearching);

  return (
    <a
      href={href}
      className={className}
      onClick={async (e) => {
        e.preventDefault();
        await safePush(href);
      }}
    >
      {children}
    </a>
  );
}
