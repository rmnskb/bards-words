import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useSearchParams } from "react-router";
import axios, {AxiosResponse} from "axios";

import {IWordIndex, IDocumentTokens} from "../WordInterfaces.ts";
import {SearchResultType} from "./HomePage.tsx";
import {apiUrl} from "../Constants.ts";
import portrait from "../images/portrait.png"

interface SearchBarProps {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    setResults: Dispatch<SetStateAction<SearchResultType | null>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<string | null>>;
    setDomain: Dispatch<SetStateAction<string>>;
}


const SearchBar = (
    {
        search
        , setSearch
        , setResults
        , setLoading
        , setError
        , setDomain
    }: SearchBarProps
) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const resetSearch = () => {
        setSearch("");
    };

    // TODO: handle erroneous search submit after a normal one
    const handleSearchChange =
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
        };

    const fetchSearch
        = async (search: string): Promise<SearchResultType | null> => {
        try {
            let response: AxiosResponse<SearchResultType>;
            const searchArray: string[] = search.split(" ");

            if (searchArray.length === 1) {
                response = await axios.get<IWordIndex[]>(`${apiUrl}/matches?search=${search}`);
                setDomain("word");
            } else if (searchArray.length > 1) {
                const params = new URLSearchParams();
                searchArray.forEach((token: string) => {
                    params.append("words", token);
                });
                const url = `${apiUrl}/phrase?${params.toString()}`;

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
    };
 
    const performSearch = async (searchTerm: string): Promise<void> => { 
        setLoading(true);
        setError(null);
        const response: SearchResultType | null = await fetchSearch(searchTerm);
        setLoading(false);

        if (response) {
            setResults(response);
        } else {
            setError('Failed to fetch search results :(');
        }
    };

    const handleSearchResult = async (): Promise<void> => {
        setSearchParams({ "search": search });
        await performSearch(search);
    };

    const handleKeyDown =
        (event: React.KeyboardEvent<HTMLInputElement>): void => {
            switch (event.key) {
                case "Enter": {
                    event.preventDefault();
                    handleSearchResult().catch((err: AxiosResponse) => {
                        console.error('Error occurred search', err);
                        setError('An unexpected error occurred.');
                    });
                    break;
                }
                case "Escape":
                    event.preventDefault()
                    resetSearch();
                    break;
                default:
                    break;
            }
        };

    const handleButtonClick =
        (event: React.MouseEvent<HTMLButtonElement>): void => {
            event.preventDefault();
            handleSearchResult().catch((err: AxiosResponse) => {
                console.error('Error occurred search', err);
                setError('An unexpected error occurred.');
            });
        };

    useEffect(() => {
        const searchQuery = searchParams.get("search");

        if (searchQuery && searchQuery.trim()) {
            setSearch(searchQuery);

            performSearch(searchQuery);
        }
    }, [searchParams]);

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-6 "> 
              <img 
                src={portrait} 
                className="
                 w-42 h-48 rounded-full border-2 object-cover brightness-0
                "
              />
              <h1 className="text-7xl font-bold text-[#8B1E3F] font-imperial">
               Bard Scope
              </h1>
            </div>
            <form className="w-full">
                <label
                    htmlFor={"search"}
                    className="mb-2 text-sm font-medium text-gray-900 sr-only"
                ></label>
                <div className="relative">
                    <input
                        type="search"
                        value={search}
                        id="search"
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        placeholder={"Search words, phrases..."} required
                        className="
                            block w-full p-4 text-xl shadow-lg
                            text-[#0D1B2A] font-im-fell
                            border-2 border-gray-50
                            rounded-lg bg-gray-50
                            focus:border-[#D4AF37] focus:outline-[#D4AF37]
                        "
                    />
                    <button
                        type="submit"
                        onClick={handleButtonClick}
                        className="
                            text-gray-50 absolute end-2.5 bottom-2.5
                            bg-[#D4AF37] hover:bg-[#B89423]
                            focus:ring-1 focus:outline-none focus:ring-[#B89423]
                            font-medium rounded-lg text-sm px-4 py-3
                            shadow-sm
                        "
                    >Search
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchBar;
