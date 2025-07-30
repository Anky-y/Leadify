import { createContext, useContext, useState } from "react";

const SearchStatusContext = createContext<{
  isSearching: boolean;
  setIsSearching: (v: boolean) => void;
}>({ isSearching: false, setIsSearching: () => {} });

export function SearchStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearching, setIsSearching] = useState(false);
  return (
    <SearchStatusContext.Provider value={{ isSearching, setIsSearching }}>
      {children}
    </SearchStatusContext.Provider>
  );
}

export function useSearchStatus() {
  return useContext(SearchStatusContext);
}
