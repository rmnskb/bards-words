import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

import { API_URL } from "../../constants";
import { IDocumentFrequencies, IWordDimensions, IYearFrequencies } from "../../types";


const useWordDimensionsFetch = (word: string): IWordDimensions | null => {
  const [wordDimensions, setWordDimensions] = useState<IWordDimensions | null>(null);
  const [yearFrequencies, setYearFrequencies] = useState<IYearFrequencies | null>(null);
  const [documentFrequencies, setDocumentFrequencies] = useState<IDocumentFrequencies | null>(null);

  const fetchYearFrequencies 
    = async (word: string): Promise<IYearFrequencies | null> => {
    try {
      const response: AxiosResponse<IYearFrequencies> = 
        await axios.get(`${API_URL}/stats/years?word=${word}`)
      return response.data;
    } catch(errorMsg) {
      console.error('Error fetching year frequencies', errorMsg);
      return null;
    }
  };

  const fetchDocumentFrequencies 
    = async (word: string): Promise<IDocumentFrequencies | null> => {
    try {
      const response: AxiosResponse<IDocumentFrequencies> =
        await axios.get(`${API_URL}/stats/documents?word=${word}`)
      return response.data;
    } catch(errorMsg) {
      console.error('Error fetching document frequencies', errorMsg);
      return null;
    }
  };

  useEffect(() => {
    fetchYearFrequencies(word)
      .then((response) => setYearFrequencies(response))
      .catch((e: string) => console.error(e));

    fetchDocumentFrequencies(word)
      .then((response) => setDocumentFrequencies(response))
      .catch((e: string) => console.error(e));
  }, [word]);

  useEffect(() => {
    if (!yearFrequencies || !documentFrequencies) return;
    if (yearFrequencies.word !== documentFrequencies.word) return;

    setWordDimensions({...yearFrequencies, ...documentFrequencies})
  }, [yearFrequencies, documentFrequencies])

  return wordDimensions;
};

export default useWordDimensionsFetch;
