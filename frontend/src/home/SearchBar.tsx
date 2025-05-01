import React, {useState} from "react";
import axios, {AxiosResponse} from "axios";


interface OccurrenceElement {
    document: string;
    frequency: number;
    indices: number[];
}

interface InvertedIndex {
    word: string;
    occurrences: OccurrenceElement[];
}


const SearchBar: React.FC = () => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<InvertedIndex[] | null>(null);
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

    const fetchSearch = async (search: string): Promise<InvertedIndex[] | null> => {
        try {
            const response: AxiosResponse<InvertedIndex[]> = await axios.get(`${apiUrl}/find-matches?word=${search}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching search', error);
            return null;
        }
    }

    const handleSearchResult = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        const response: InvertedIndex[] | null = await fetchSearch(search);
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
                                {results.map((result: InvertedIndex, index) => (
                                    <li key={index}>
                                        <div>
                                            <h3>Result:</h3>
                                            <h4>Word: {result.word}</h4>
                                            <h4>Occurrences:</h4>

                                            <ul>
                                                {result.occurrences.map((occurrence: OccurrenceElement, idx) => (
                                                    <li key={idx}>
                                                        <div><strong>Document: </strong> {occurrence.document}</div>
                                                        <div><strong>Frequency: </strong> {occurrence.frequency}</div>
                                                        <div><strong>Indices: </strong> {occurrence.indices.join(', ')}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
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
