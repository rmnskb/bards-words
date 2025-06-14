import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

import { IDictionaryEntry } from "../../types";


const useDictionaryEntryFetch = (word: string): IDictionaryEntry | null => {
  const [dictionaryEntry, setDictionaryEntry] = useState<IDictionaryEntry | null>(null);
  const dictionaryApi = "https://api.dictionaryapi.dev/api/v2/entries/en";

  const fetchDictionaryEntry =
    async (word: string): Promise<IDictionaryEntry[] | null> => {
      try {
        const response: AxiosResponse<IDictionaryEntry[]> = await axios.get(`${dictionaryApi}/${word}`);
        return response.data;
      } catch (e) {
        console.error("Error fetching the dictionary entry", e);
        return null;
      }
    };

  useEffect(() => {
    fetchDictionaryEntry(word)
      .then((response) => {
        // Take only the best match, disregard the rest
        setDictionaryEntry(response ? response[0] : null);
      })
      .catch((e: string) => {
        console.error(e);
      });
  }, [word]);

  return dictionaryEntry;
};

export default useDictionaryEntryFetch;
