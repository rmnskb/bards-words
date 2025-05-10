import React, {useState, Dispatch, SetStateAction} from "react";
import axios, {AxiosResponse} from "axios";

import {IWordIndex, IDocumentTokens} from "../WordInterfaces.ts";
import {SearchResultType} from "./HomePage.tsx";
import {apiUrl} from "../Constants.ts";

interface SearchBarProps {
    setResults: Dispatch<SetStateAction<SearchResultType | null>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<string | null>>;
    domain: string;
    setDomain: Dispatch<SetStateAction<string>>;
}


const SearchBar = (
    {
        setResults
        , setLoading
        , setError
        , domain
        , setDomain
    }: SearchBarProps
) => {
    const [search, setSearch] = useState<string>("");

    const resetSearch = () => {
        setSearch("");
    };

    const handleSearchChange =
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
        }

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
    }

        setLoading(true);
        setError(null);
        const response: SearchResultType | null = await fetchSearch(search);
        setLoading(false);

        if (response) {
            setResults(response);
        } else {
            setError('Failed to fetch search results :(');
        }
    }

    const handleKeyDown =
        (event: React.KeyboardEvent<HTMLInputElement>): void => {
            switch (event.key) {
                case "Enter": {
                    event.preventDefault();
                    handleSearchResult().catch((err: AxiosResponse) => {
                        console.error('Error occurred search', err);
                        setLoading(false);
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
        }

    return (
        <div>
            <form>
                <label htmlFor={"search"}> Search </label>
                <div>
                    <input
                        type="text"
                        value={search}
                        id="search"
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        placeholder={"Search for a word..."} required
                    />
                </div>
            </form>
        </div>
    )
};

export default SearchBar;
