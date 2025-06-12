import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useSearchParams } from "react-router";
import axios, { AxiosResponse } from "axios";

import { IWordIndex, IDocumentTokens } from "../WordInterfaces.ts";
import { SearchResultType } from "./HomePage.tsx";
import { apiUrl } from "../Constants.ts";
import SearchBar from "../components/SearchBar.tsx";
import Portrait from "../components/Portrait.tsx";
import AutoSuggestionsDropdown from "../components/AutoSuggestionsDropdown.tsx";
import useSearchSuggestions from "../hooks/useSearchSuggestions";
import useSearchKeyboardNavigation from "../hooks/useSearchKeyboardNavigation";
import useClickedOutside from "../hooks/useClickedOutside";

type SearchAreaProps = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setResults: Dispatch<SetStateAction<SearchResultType | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setDomain: Dispatch<SetStateAction<string>>;
};


const SearchArea = (
  {
    search
    , setSearch
    , setResults
    , setLoading
    , setError
    , setDomain
  }: SearchAreaProps
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const suggestions = useSearchSuggestions({ search, setShowSuggestions, });

  const handleKeyDown = useSearchKeyboardNavigation({ 
    items: suggestions, 
    onSelect: setSearch,
    onSearchSubmit: () => {
      performSearch(search).catch((err: AxiosResponse) => {
        console.error('Error occurred search', err);
        setError('An unexpected error occurred.');
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


  // TODO: handle erroneous search submit after a normal one
  const handleSearchChange =
    (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

  const fetchSearch
    = async (search: string): Promise<SearchResultType | null> => {
    try {
      let response: AxiosResponse<SearchResultType>;
      const searchArray: string[] = search.split(" ");

      if (searchArray.length === 1) {
        response = await axios.get<IWordIndex[]>(`${apiUrl}/matches?search=${search}`);
        setDomain("word");
      } else if (searchArray.length > 1) {
        const params = new URLSearchParams();
        searchArray.forEach((token: string) => {
            params.append("words", token);
        });
        const url = `${apiUrl}/phrase?${params.toString()}`;

        response = await axios.get<IDocumentTokens[]>(url);
        setDomain("phrase");
      } else {
        console.error("Please enter your search query.");
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching search', error);
      return null;
    }
  };

  const performSearch = async (searchTerm: string): Promise<void> => { 
    setLoading(true);
    setError(null);
    const response: SearchResultType | null = await fetchSearch(searchTerm);
    setLoading(false);

    if (response) setResults(response);
    else setError('Failed to fetch search results :(');

    setShowSuggestions(false);
    setSelectedIndex(-1);
    setSearchParams({ "search": searchTerm });
  };
  
  const handleButtonClick =
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.preventDefault();
      performSearch(search).catch((err: AxiosResponse) => {
        console.error('Error occurred search', err);
        setError('An unexpected error occurred.');
      });
    };

  useEffect(() => {
    const searchQuery = searchParams.get("search");

    if (searchQuery && searchQuery.trim()) {
      setSearch(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4" ref={searchRef}>
      <div className="flex items-center justify-center gap-3 mb-6">
        <Portrait className="
          w-42 h-48 rounded-full border-2 object-cover transition-all duration-300
        "/>
        <h1 className="
          text-7xl font-bold text-royal-wine font-imperial
          dark:text-crimson 
        ">Words Bard</h1>
      </div>
      <div className="relative w-full">
        <SearchBar
          search={search}
          onInputChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onButtonClick={handleButtonClick}
          inputSpacing="p-4 text-xl"
          buttonIcon="Search"
          buttonSpacing="absolute end-2.5 bottom-2.5 px-4 py-3"
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
