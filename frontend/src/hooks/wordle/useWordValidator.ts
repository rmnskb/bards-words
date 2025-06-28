import { useState, useEffect, useCallback } from "react";
import axios, { AxiosResponse } from "axios";

import { apiUrl } from "../../constants";
import { IEligibleWords } from "../../types";

type UseWordValidatorReturn = (word: string) => boolean;


const useWordValidator = (wordLength: number): UseWordValidatorReturn => {
  const [validWords, setValidWords] = useState<Set<string>>(() => {
    const cached = sessionStorage.getItem('valid-wordle-words');
    return cached ? new Set(JSON.parse(cached)) : new Set();
  });

  const [isLoaded, setIsLoaded] = useState<boolean>(() => {
    return sessionStorage.getItem('valid-wordle-words') !== null;
  });

  const fetchEligibleWords = useCallback(
    async (wordLength: number): Promise<IEligibleWords | null> => {
      const url = new URL(`${apiUrl}/eligibleWords`);
      url.searchParams.set("word_length", wordLength.toString());

      try {
        const response: AxiosResponse<IEligibleWords> = await axios.get(url.toString());
        return response.data;
      } catch (e) {
        console.error("Error fetching the eligible words", e);
        return null;
      }
    }, []);

  useEffect(() => {
    if (isLoaded) return;

    fetchEligibleWords(wordLength)
      .then(response => response?.words)
      .then(words => {
        const wordsSet = new Set(words);
        setValidWords(wordsSet);
        sessionStorage.setItem("valid-wordle-words", JSON.stringify(words));
        setIsLoaded(true);
      })
      .catch(e => console.error(e));
  }, [isLoaded]);

  return (word: string): boolean => validWords.has(word.toLowerCase());
};

export default useWordValidator;
