import React, {useState} from "react";
import axios, {AxiosResponse} from "axios";

import {IWordIndex} from "../WordInterfaces.ts";
import WordCard from "./WordCard.tsx";


const SearchBar: React.FC = () => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<IWordIndex[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = "//localhost:8000/api/v1"

    const resetSearch = () => {
        setSearch("");
    };

    const handleSearchChange =
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
        }

    const fetchSearch = async (search: string): Promise<IWordIndex[] | null> => {
        try {
            const response: AxiosResponse<IWordIndex[]> = await axios.get(`${apiUrl}/find-matches?word=${search}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching search', error);
            return null;
        }
    }

    const handleSearchResult = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        const response: IWordIndex[] | null = await fetchSearch(search);
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
            <div>
                {loading && (<p>Loading...</p>)}
                {error && <p>{error}</p>}
                {
                    results && (
                        <div>
                            <ol>
                                {results.map((result: IWordIndex, index) => (
                                    <li key={index}>
                                        <WordCard word={result}></WordCard>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )
                }
            </div>
        </div>
    )
};

export default SearchBar;
