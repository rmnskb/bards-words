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

            if (domain === "word") {
                response = await axios.get<IWordIndex[]>(`${apiUrl}/find-matches?word=${search}`);
            } else if (domain === "phrase") {
                const params = new URLSearchParams();
                const tokens = search.split(" ");
                tokens.forEach((token: string) => {
                    params.append("words", token);
                });
                const url = `${apiUrl}/find-phrase?${params.toString()}`;

                response = await axios.get<IDocumentTokens[]>(url);
            } else {
                console.error("Invalid parameter, select either word or phrase");
                return null;
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching search', error);
            return null;
        }
    }

    const handleSearchResult = async (): Promise<void> => {
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
            <label>
                Search for:
                <select
                    name="selectedDomain"
                    onChange={event => setDomain(event.target.value)}
                >
                    <option value="word">Word</option>
                    <option value="phrase">Phrase</option>
                </select>
            </label>
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
