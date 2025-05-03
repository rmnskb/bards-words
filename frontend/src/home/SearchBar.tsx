import React, {useState} from "react";
import axios, {AxiosResponse} from "axios";

import {IWordIndex, IDocumentTokens} from "../WordInterfaces.ts";
import WordCard from "./WordCard.tsx";


const SearchBar: React.FC = () => {
    type SearchResult = IWordIndex[] | IDocumentTokens[];
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [domain, setDomain] = useState<string>("word");
    const apiUrl = "//localhost:8000/api/v1"

    const resetSearch = () => {
        setSearch("");
    };

    const handleSearchChange =
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
        }

    const fetchSearch
        = async (search: string): Promise<SearchResult | null> => {
        try {
            let response: AxiosResponse<SearchResult>;

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
        const response: SearchResult | null = await fetchSearch(search);
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

    // TODO: Move the search results into separate component
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
            <div>
                {loading && (<p>Loading...</p>)}
                {error && <p>{error}</p>}
                {
                    results && (
                        <div>
                            <ol>
                                {domain === "word" ? (
                                    (results as IWordIndex[]).map((result: IWordIndex, index) => (
                                        <li key={index}>
                                            <WordCard word={result}></WordCard>
                                        </li>
                                    ))
                                ) : (
                                    // TODO: Create a separate component for the document context
                                    (results as IDocumentTokens[])
                                        .map((result: IDocumentTokens, index) => (
                                            <li key={index}>
                                                <h3>Shakespeare's work: {result.document}</h3>
                                                <p><strong>Context:</strong> {result.occurrences.join(' ')}</p>
                                            </li>
                                        ))
                                )}
                            </ol>
                        </div>
                    )
                }
            </div>
        </div>
    )
};

export default SearchBar;
