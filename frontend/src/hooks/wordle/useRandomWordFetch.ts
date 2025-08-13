import { useCallback, useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

import { IRandomWord } from "../../types";
import { apiUrl } from "../../constants";

export interface UseRandomWordFetchProps {
  wordLength?: number;
}

export interface UseRandomWordFetchReturn {
  word: string | null;
  getRandomWord: (wordLength: number) => Promise<void>;
  getWordOfTheDay: (wordLength: number) => Promise<void>;
}


const useRandomWordFetch = ({
  wordLength = 5,
}: UseRandomWordFetchProps): UseRandomWordFetchReturn => {
  const [word, setWord] = useState<string | null>(null);

  const fetchRandomWord = useCallback(
    async (isWordOfTheDay: boolean, length: number): Promise<IRandomWord | null> => {
      const url = new URL(`${apiUrl}/words/random`);
      url.searchParams.set("word_length", length.toString());

      if (isWordOfTheDay) {
        const today: Date = new Date();
        const todayDate: string = today.toISOString().slice(0, 10);
        url.searchParams.set("date", todayDate);
      }

      try {
        const response: AxiosResponse<IRandomWord> = await axios.get(url.toString());
        return response.data;
      } catch (e) {
        console.error("Error fetching the random word", e);
        return null;
      }
    }, []);

  const getRandomWord = useCallback(async (length: number): Promise<void> => {
    fetchRandomWord(false, length)
      .then((response) => setWord(response ? response.word : null))
      .catch((e: string) => console.error(e));
  }, [fetchRandomWord]);

  const getWordOfTheDay = useCallback(async (length: number): Promise<void> => {
    fetchRandomWord(true, length)
      .then((response) => setWord(response ? response.word : null))
      .catch((e: string) => console.error(e));
  }, [fetchRandomWord, wordLength]);

  useEffect(() => {
    getWordOfTheDay(wordLength);
  }, []);

  return { word, getRandomWord, getWordOfTheDay };
};

export default useRandomWordFetch;
