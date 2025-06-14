import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

import { IWordDimensions } from "../../types";
import { apiUrl } from "../../constants";


const useWordDimensionsFetch = (word: string): IWordDimensions | null => {
  const [wordDimensions, setWordDimensions] = useState<IWordDimensions | null>(null);

  const fetchWordDimensions
    = async (word: string): Promise<IWordDimensions | null> => {
    try {
      const response: AxiosResponse<IWordDimensions> = await axios.get(`${apiUrl}/stats?word=${word}`);
      return response.data;
    } catch (errorMsg) {
      console.error('Error fetching search', errorMsg);
      return null;
    }
  };

  useEffect(() => {
    fetchWordDimensions(word)
      .then((response) => {
        setWordDimensions(response);
      })
      .catch((e: string) => {
        console.error(e);
      });
  }, [word]);

  return wordDimensions;
};

export default useWordDimensionsFetch;
