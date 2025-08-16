import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

import { API_URL } from "../../constants";
import { IWordIndex } from "../../types";

interface UseWordIndicesFetchReturn {
  loading: boolean;
  error: string | null;
  wordIndex: IWordIndex | null;
}


const useWordIndicesFetch = (word: string): UseWordIndicesFetchReturn => { 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordIndex, setWordIndex] = useState<IWordIndex | null>(null);

  const fetchWordIndices
    = async (word: string): Promise<IWordIndex | null> => {
    try {
      const response: AxiosResponse<IWordIndex> =
        await axios.get<IWordIndex>(`${API_URL}/words?search=${word}`)
      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  useEffect(() => {
    if (!word) return;

    setLoading(true);
    setError(null);

    fetchWordIndices(word)
      .then((response) => setWordIndex(response))
      .catch((e: string) => setError(e))
      .finally(() => setLoading(false))
  }, [word]);

  return {
    loading,
    error,
    wordIndex,
  }
};

export default useWordIndicesFetch;
