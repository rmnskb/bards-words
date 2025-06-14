import { useEffect, Dispatch, SetStateAction } from "react";
import { AxiosResponse } from "axios";

import SearchBar from "../common/SearchBar.tsx";
import Portrait from "../common/Portrait.tsx";
import AutoSuggestionsDropdown from "../common/SuggestionsDropdown.tsx";
import useSearchSuggestions from "../../hooks/home/useSearchSuggestions";
import useSearchKeyboardNavigation from "../../hooks/home/useSearchKeyboardNavigation";
import useClickedOutside from "../../hooks/common/useClickedOutside";
import { UseParametrisedSearchFetchReturn } from "../../hooks/home/useParametrisedSearchFetch.ts";

type SearchHookOmitted = "loading" | "domain" | "results" | "error";

interface SearchAreaProps extends Omit<UseParametrisedSearchFetchReturn, SearchHookOmitted> {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};


const SearchArea = ({
  search,
  setSearch,
  performSearch,
  showSuggestions,
  setShowSuggestions,
  selectedIndex,
  setSelectedIndex,
  searchParameter,
}: SearchAreaProps) => {
  const suggestions = useSearchSuggestions({ search, setShowSuggestions, });

  const handleKeyDown = useSearchKeyboardNavigation({ 
    items: suggestions, 
    onSelect: setSearch,
    onSearchSubmit: () => {
      performSearch(search).catch((err: AxiosResponse) => {
        console.error('Error occurred search', err);
      });
    },
    showSuggestions: showSuggestions,
    setShowSuggestions: setShowSuggestions,
    selectedIndex: selectedIndex,
    setSelectedIndex: setSelectedIndex,
  });

  const searchRef = useClickedOutside(() => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
  });

  const handleButtonClick =
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.preventDefault();
      performSearch(search).catch((err: AxiosResponse) => {
        console.error('Error occurred search', err);
      });
    };

  useEffect(() => {
    if (searchParameter && searchParameter.trim()) {
      setSearch(searchParameter);
      performSearch(searchParameter);
    }
  }, [searchParameter]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4" ref={searchRef}>
      <div className="flex items-center justify-center gap-3 mb-6">
        <Portrait className="
          w-42 h-48 rounded-full border-2 object-cover transition-all duration-300
        "/>
        <h1 className="
          text-7xl font-bold text-royal-wine font-imperial
          dark:text-crimson select-none
        ">Words Bard</h1>
      </div>
      <div className="relative w-full">
        <SearchBar
          search={search}
          onInputChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onButtonClick={handleButtonClick}
          inputSpacing="p-4 text-xl"
          buttonIcon="Search"
          buttonSpacing="absolute end-2.5 bottom-2.5 px-4 py-3"
          placeholder="Search words or phrases from Shakespeare's plays..."
        />
        <AutoSuggestionsDropdown
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          selectedIndex={selectedIndex}
          onSuggestionClick={(suggestion: string) => setSearch(suggestion)}
          onMouseEnter={(index: number) => setSelectedIndex(index)}
          contentSpacing="absolute top-full left-0 right-0 z-50 mt-2"
        />
      </div>
    </div>
  );
};

export default SearchArea;
