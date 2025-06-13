import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useSearchParams } from "react-router";

import useSearchFetch, { UseSearchFetchReturn } from "./useSearchFetch";

export interface UseParametrisedSearchFetchReturn extends UseSearchFetchReturn {
  showSuggestions: boolean;
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  searchParameter: string;
}


const useParametrisedSearchFetch = (): UseParametrisedSearchFetchReturn => { 
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const searchFetch = useSearchFetch();

  const performSearchWithParams = useCallback(async (searchTerm: string) => {
    await searchFetch.performSearch(searchTerm);

    setShowSuggestions(false);
    setSelectedIndex(-1);
    setSearchParams({ "search": searchTerm });
  }, [searchFetch.performSearch, setSearchParams]);

  return {
    ...searchFetch,
    performSearch: performSearchWithParams,
    showSuggestions: showSuggestions,
    setShowSuggestions: setShowSuggestions,
    selectedIndex: selectedIndex,
    setSelectedIndex: setSelectedIndex,
    searchParameter: searchParams.get("search") || "",
  };
};

export default useParametrisedSearchFetch;
