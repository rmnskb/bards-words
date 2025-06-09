import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import axios from "axios";

import { ISuggestionsItem } from "../WordInterfaces";
import { apiUrl } from "../Constants";
import LoadingSpinner from "./LoadingSpinner";

type suggestionsApiProps = {
  search: string;
  limit?: number;
};

type AutoSuggestionsDropdownProps = suggestionsApiProps & {
  className?: string;
  setSearch: Dispatch<SetStateAction<string>>;
};


const AutoSuggestionsDropdown = ({
  search,
  setSearch,
  limit = 10,
  className = "",
}: AutoSuggestionsDropdownProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const suggestionsRef = useRef<HTMLUListElement>(null);

  const fetchSuggestions = async ({search, limit}: suggestionsApiProps) => {
    try {
      const response = await axios.get<ISuggestionsItem>(`${apiUrl}/suggestions?q=${search}&limit=${limit}`);
      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown 
    = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (!showSuggestions) return;

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
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };
  
  // Handle click outside of the suggestions box 
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Handle scrolling the selected element into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({
        block: "nearest",
        inline: "start",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (search.trim().length > 2) {
      setLoading(true);

      const timeoutId = setTimeout(() => {
        fetchSuggestions({ search: search, limit: limit })
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
    } else setSuggestions([]);
  }, [search, limit]);

  return (
    <div>
      {loading && (<LoadingSpinner />)}
      {showSuggestions && suggestions.length > 0 && (
        <div className={className}>
          <ul
            ref={suggestionsRef} 
            className="py-2"
            onKeyDown={handleKeyDown}
          >
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`
                    w-full text-left px-4 py-3 
                    transition-colors duration-150
                    flex items-center space-x-3
                    bg-vellum hover:bg-cafe-au-lait
                    text-quill hover:text-candlelight
                    dark:bg-cafe-au-lait dark:hover:bg-vellum
                    dark:text-candlelight dark:hover:text-quill
                    ${index === selectedIndex 
                      ? "bg-cafe-au-lait text-candlelight dark:bg-vellum dark:text-quill"
                      : ""
                    }
                  `}
                >
                  <span className="truncate">{suggestion}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutoSuggestionsDropdown;
