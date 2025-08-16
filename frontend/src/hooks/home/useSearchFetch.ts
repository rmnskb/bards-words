import axios, { AxiosResponse } from "axios";
import { useCallback, useState } from "react";

import { API_URL } from "../../constants";
import { IDocumentTokens, IWordIndex } from "../../types";

type DomainType = "word" | "phrase";
type SearchResultType = IWordIndex[] | IDocumentTokens[];

export interface UseSearchFetchReturn {
  loading: boolean;
  error: string | null;
  results: SearchResultType | null;
  domain: DomainType;

  performSearch: (searchTerm: string) => Promise<void>;
}


const useSearchFetch = (): UseSearchFetchReturn => { 
  const [results, setResults] = useState<SearchResultType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<DomainType>("word");

  const fetchSearch = useCallback(
    async (search: string): Promise<SearchResultType | null> => {
    try {
      let response: AxiosResponse<SearchResultType>;
      const searchArray: string[] = search.split(" ");

      if (searchArray.length === 1) {
        response = await axios.get<IWordIndex[]>(`${API_URL}/words/matches?search=${search}`);
        setDomain("word");
      } else if (searchArray.length > 1) {
        const params = new URLSearchParams();
        searchArray.forEach((token: string) => {
            params.append("words", token);
        });
        const url = `${API_URL}/tokens/phrase?${params.toString()}`;

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
  }, []);

  const performSearch = useCallback(async (searchTerm: string): Promise<void> => {
    if (!searchTerm.trim()) {
      setError("Please enter your search");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetchSearch(searchTerm);
      if (response) setResults(response);
      else setError("Failed to fetch search results :(")
    } catch(err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  }, [fetchSearch]);

  return {
    loading,
    error,
    results,
    domain,
    performSearch,
  };
};

export default useSearchFetch;
