import {useState, useEffect, useRef} from "react";
import axios, {AxiosResponse} from "axios";

import {IWordIndex, IOccurrenceElement, IFlatOccurrenceElement} from "../WordInterfaces.ts";
import WordContextCard from "./WordContextCard";
import {apiUrl} from "../Constants.ts";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import {TShakespeareWorkTitle} from "../WorksEnum.ts";

interface WordExamplesProps {
    word: string;
}

const WorksExamples = ({word}: WordExamplesProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>();
    const [wordIndex, setWordIndex] = useState<IWordIndex | null>(null);
    const [flatOccurrences, setFlatOccurrences] = useState<IFlatOccurrenceElement[] | null>([]);
    const [filteredFlatOccurrences, setFilteredFlatOccurrences] = useState<IFlatOccurrenceElement[] | null>([]);
    const [loadCount, setLoadCount] = useState<number>(10);
    const [availableOptions, setAvailableOptions] = useState<TShakespeareWorkTitle[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [areAllOptionsDisplayed, setAreAllOptionsDisplayed] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const fetchWordIndices
        = async (word: string): Promise<IWordIndex | null> => {
        try {
            const response: AxiosResponse<IWordIndex> =
                await axios.get<IWordIndex>(`${apiUrl}/word?search=${word}`)
            return response.data;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const flattenOccurrenceElements
        = (input: IOccurrenceElement[]): IFlatOccurrenceElement[] => {
        const flatOccurrenceElements: IFlatOccurrenceElement[] = [];

        input.forEach(originalElement => {
            originalElement.indices.forEach(index => {
                flatOccurrenceElements.push({
                    document: originalElement.document
                    , index: index
                });
            });
        });

        return flatOccurrenceElements;
    };

    const handleLoadMore = () => {
        if (!flatOccurrences || !wordIndex) {
            return
        }
 
        if (filteredFlatOccurrences && selectedOptions) { 
          const filtered = flattenOccurrenceElements(
            wordIndex.occurrences.filter(
              item => selectedOptions.some(
                option => option === item.document
              )
            )
          );

          if (loadCount + 5 <= filtered.length) {
              setLoadCount(prevCount => prevCount + 5);
          } else if (loadCount + 5 > filtered.length) {
              setLoadCount(filtered.length);
              setAreAllOptionsDisplayed(true);
          }

          setFilteredFlatOccurrences(filtered.slice(0, loadCount));

          return
        }

        if (loadCount + 5 <= flatOccurrences.length) {
            setLoadCount(prevCount => prevCount + 5);
        } else if (loadCount + 5 > flatOccurrences.length) {
            setLoadCount(flatOccurrences.length);
            setAreAllOptionsDisplayed(true);
        }

        setFlatOccurrences(
            flattenOccurrenceElements(wordIndex.occurrences).slice(0, loadCount)
        );
    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleOptionClick = (option: string) => {
        setSelectedOptions(prev => {
            if (prev.some(item => item === option)) {
                return prev.filter(item => item !== option);
            } else {
                return [...prev, option]
            }
        });
    };
 
    // Handle the dropdown behaviour
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setIsDropdownOpen(false);
        }
      };

      if (isDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isDropdownOpen]);
 
    // Handle the filters
    useEffect(() => {
        if (selectedOptions.length === 0) {
            setFilteredFlatOccurrences(flatOccurrences);
        } else {
            if (wordIndex) {
                const filtered = flattenOccurrenceElements(
                    wordIndex.occurrences.filter(
                        item => selectedOptions.some(
                            option => option === item.document
                        )
                    )
                );
                setFilteredFlatOccurrences(filtered.slice(0, loadCount));

                // Load more button logic
                if (filtered.length <= loadCount) setAreAllOptionsDisplayed(true);
                else setAreAllOptionsDisplayed(false);
            }
        }
    }, [wordIndex, selectedOptions, flatOccurrences, loadCount]);
 
    // Handle the initial state of the page
    useEffect(() => {
        setLoading(true);
        fetchWordIndices(word)
            .then((response) => {
                setWordIndex(response);
                if (response) {
                    setFlatOccurrences(
                        flattenOccurrenceElements(response.occurrences).slice(0, loadCount)
                    );

                    // Dropdown filter options
                    setAvailableOptions(response.occurrences.map(item => item.document as TShakespeareWorkTitle));

                    // Load more button logic
                    if (response.occurrences.length <= loadCount) setAreAllOptionsDisplayed(true);
                    else setAreAllOptionsDisplayed(false);
                }
                setLoading(false);
            })
            .catch((e: string) => {
                setError(e);
                setLoading(false);
            });
    }, [word, loadCount]);
    
    return (
        <div className="
            block w-3xl p-5 m-3
            border-1 rounded-lg shadow-lg
        ">
            <div className="flex justify-between items-start w-full">
                <p className="text-3xl font-bold font-im-fell m-3">Examples from works:</p>
                <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      className="
                        text-gray-50
                        bg-[#D4AF37] hover:bg-[#B89423]
                        focus:ring-1 focus:outline-none focus:ring-[#B89423]
                        font-medium rounded-lg text-sm px-4 py-3
                        shadow-sm
                      "
                      onClick={toggleDropdown}
                    >
                        <span>
                          {selectedOptions.length === 0
                              ? 'Select plays'
                              : `${selectedOptions.length} play(s) selected`}
                        </span>
                    </button>
                    {isDropdownOpen && (
                        <div className={`
                            absolute right-0 z-10 w-xs mt-1 rounded-md shadow-lg border bg-[#F2EBD3] border-gray-300
                        `}>
                            <ul className="py-1 overflow-auto text-base max-h-100">
                                {availableOptions.map((title, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleOptionClick(title)}
                                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-[#D4AF37]"
                                    >
                                        <div className="flex items-center">
                                            <div className={`
                                            w-4 h-4 border rounded flex item-center justify-center mr-2 
                                            ${
                                                selectedOptions.some(item => item === title)
                                                    ? 'bg-[#8B1E3F] border-[#8B1E3F]'
                                                    : 'border=gray-300'
                                            }`}>
                                            </div>
                                            <span className="text-sm">{title}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            {error && (<p>{error}</p>)}
            {loading && (<LoadingSpinner/>)}
            {wordIndex && filteredFlatOccurrences && (
              <div>
                <hr className="h-1 mx-auto mb-2 bg-gray-700 border-0 rounded-sm "/>
                {filteredFlatOccurrences.map((flatOccurrence, idx) => (
                  <WordContextCard
                      key={idx}
                      document={flatOccurrence.document}
                      index={flatOccurrence.index}
                      word={word}
                  />
                ))}
                {!areAllOptionsDisplayed && (
                  <button
                      type="button"
                      onClick={handleLoadMore}
                      className="
                       text-gray-50
                       bg-[#D4AF37] hover:bg-[#B89423]
                       focus:ring-1 focus:outline-none focus:ring-[#B89423]
                       font-medium rounded-lg text-sm px-4 py-3
                       shadow-sm
                     "
                  >
                    Load more...
                  </button>
                )}
              </div>
              )}
        </div>
    );
};

export default WorksExamples;
