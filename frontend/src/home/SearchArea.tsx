import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { useSearchParams } from "react-router";
import axios, { AxiosResponse } from "axios";

import { IWordIndex, IDocumentTokens, ISuggestionsItem } from "../WordInterfaces.ts";
import { SearchResultType } from "./HomePage.tsx";
import { apiUrl } from "../Constants.ts";
import SearchBar from "../components/SearchBar.tsx";
import Portrait from "../components/Portrait.tsx";
import AutoSuggestionsDropdown from "../components/AutoSuggestionsDropdown.tsx";

type suggestionsApiProps = {
  search: string;
  limit?: number;
};

type SearchBarProps = {
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
  }: SearchBarProps
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const suggestionsLimit = 10;


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

  const fetchSuggestions = async ({search, limit}: suggestionsApiProps) => {
    try {
      const response = await axios.get<ISuggestionsItem>(`${apiUrl}/suggestions?q=${search}&limit=${limit}`);
      return response.data;
    } catch (e) {
      console.error(e);
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
  };
  
  // FIXME: DRY this stuff
  const handleSearchResult = async (): Promise<void> => {
    setSearchParams({ "search": search });
    await performSearch(search);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    setSearchParams({ "search": suggestion });
    performSearch(suggestion);
  };

  const handleKeyDown 
    = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearchResult().catch((err: AxiosResponse) => {
          console.error('Error occurred during search', err);
          setError('An unexpected error occurred.');
        });

        return;
      }
    }

    // TODO: Fix the navigation with arrow keys for the light theme??
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) handleSuggestionClick(suggestions[selectedIndex]);
        else setShowSuggestions(false);
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      case "Tab":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleButtonClick =
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.preventDefault();
      handleSearchResult().catch((err: AxiosResponse) => {
        console.error('Error occurred search', err);
        setError('An unexpected error occurred.');
      });
    };

  const handleSuggestionMouseEnter = (index: number) => {
    setSelectedIndex(index);
  };

  // Handle click outside of the search area
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (search.trim().length > 2) {
      setLoading(true);

      const timeoutId = setTimeout(() => {
        fetchSuggestions({ search: search, limit: suggestionsLimit })
          .then(response => {
            if (response && response.suggestions) {
              setSuggestions(response?.suggestions);
              setShowSuggestions(response?.suggestions.length > 0);
            }
          })
          .catch((e: string) => {
            console.error(e);
          })
          .finally(() => {
            setLoading(false);
          })
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [search, suggestionsLimit]);

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
          onSuggestionClick={handleSuggestionClick}
          onMouseEnter={handleSuggestionMouseEnter}
          contentSpacing="absolute top-full left-0 right-0 z-50 mt-2"
        />
      </div>
    </div>
  );
};

export default SearchArea;
