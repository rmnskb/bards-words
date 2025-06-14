import { useState, useEffect, useMemo } from "react";

import { IFlatOccurrenceElement, IOccurrenceElement, IWordIndex } from "../../types";
import { TShakespeareWorkTitle } from "../../constants";

interface UseWordOccurrencesFilteringReturn {
  selectedOptions: TShakespeareWorkTitle[];
  availableOptions: TShakespeareWorkTitle[];
  filteredOccurrences: IFlatOccurrenceElement[];
  areAllOptionsDisplayed: boolean;

  handleLoadMore: () => void;
  handleOptionClick: (option: TShakespeareWorkTitle) => void;
}


const useWordOccurrencesFiltering = (
  wordIndex: IWordIndex | null,
  selectedWorks: TShakespeareWorkTitle[] |null,
): UseWordOccurrencesFilteringReturn => {
  const [selectedOptions, setSelectedOptions] = useState<TShakespeareWorkTitle[]>([]);
  const [loadCount, setLoadCount] = useState<number>(5);
  const [areAllOptionsDisplayed, setAreAllOptionsDisplayed] = useState<boolean>(false);

  const flattenOccurrenceElements 
    = (input: IOccurrenceElement[]): IFlatOccurrenceElement[] => {
      return input.flatMap(originalElement => 
        originalElement.indices.map(index => ({
          document: originalElement.document,
          index: index
        }))
      );
    };

  const flatOccurrences = useMemo(() => {
    return wordIndex ? flattenOccurrenceElements(wordIndex.occurrences) : []
  }, [wordIndex]);

  const availableOptions: TShakespeareWorkTitle[] = useMemo((): TShakespeareWorkTitle[] => {
    return wordIndex 
      ? wordIndex.occurrences.map(item => item.document as TShakespeareWorkTitle) 
      : []
  }, [wordIndex]);

  const filteredOccurrences = useMemo(() => {
    if (selectedOptions.length === 0) return flatOccurrences.slice(0, loadCount);

    return flatOccurrences
      .filter(item => selectedOptions.includes(item.document))
      .slice(0, loadCount);
  }, [flatOccurrences, selectedOptions, loadCount]);

  const handleLoadMore = () => {
    const contentToShow = selectedOptions.length > 0
      ? flatOccurrences.filter(item => selectedOptions.includes(item.document))
      : flatOccurrences;

    if (loadCount + 5 < contentToShow.length) setLoadCount(prev => prev + 5);
    else {
      setLoadCount(contentToShow.length);
      setAreAllOptionsDisplayed(true);
    }
  };

  const handleOptionClick = (option: TShakespeareWorkTitle) => {
    setSelectedOptions(prev => {
      if (prev.some(item => item === option)) 
        return prev.filter(item => item !== option);
      else return [...prev, option];
    });
  };

  // Handle updates from other component
  useEffect(() => {
    if (selectedWorks) setSelectedOptions(selectedWorks);
  }, [selectedWorks]);

  useEffect(() => {
    const contentToShow = selectedOptions.length > 0
      ? flatOccurrences.filter(item => selectedOptions.includes(item.document))
      : flatOccurrences;

    setAreAllOptionsDisplayed(contentToShow.length <= loadCount);
  }, [flatOccurrences, selectedOptions, loadCount]);

  return {
    selectedOptions,
    availableOptions,
    filteredOccurrences,
    areAllOptionsDisplayed,

    handleLoadMore,
    handleOptionClick,
  };
};

export default useWordOccurrencesFiltering;
