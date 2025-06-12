import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import axios from "axios";

import { ISuggestionsItem } from "../WordInterfaces";
import { apiUrl } from "../Constants";

interface SuggestionsApiProps {
  search: string;
  limit?: number;
}

interface UseSearchSuggestionsProps extends SuggestionsApiProps {
  delay?: number;
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
}


const useSearchSuggestions = ({
  search,
  limit = 10,
  delay = 300,
  setShowSuggestions,
}: UseSearchSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const cache = useRef<Map<string, string[]>>(new Map());

  const fetchSuggestions = async ({search, limit}: SuggestionsApiProps) => {
    try {
      const response = await axios.get<ISuggestionsItem>(`${apiUrl}/suggestions?q=${search}&limit=${limit}`);
      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  useEffect(() => {
    if (search.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (cache.current.has(search)) {
      setSuggestions(cache.current.get(search)!);
      setShowSuggestions(true);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchSuggestions({ search: search, limit: limit })
        .then(response => {
          if (response && response.suggestions) {
            setSuggestions(response?.suggestions);
            setShowSuggestions(response?.suggestions.length > 0);
            cache.current.set(search, response.suggestions);
          }
        })
        .catch((e: string) => {
          console.error(e);
        })
    }, delay);

      return () => clearTimeout(timeoutId);
  }, [search, limit]);

  return suggestions;
};

export default useSearchSuggestions;

