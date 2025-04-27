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
    const [result, setResult] = useState<InvertedIndex | null>(null);
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

    const fetchSearch = async (search: string): Promise<InvertedIndex | null> => {
        try {
            const response: AxiosResponse<InvertedIndex> = await axios.get(`${apiUrl}/find-one?word=${search}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching search', error);
            return null;
        }
    }

    const handleSearchResult = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        const response: InvertedIndex | null = await fetchSearch(search);
        setLoading(false);

        if (response) {
            setResult(response);
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
                    result && (
                        <div>
                            <h2>Result:</h2>
                            <h3>Word: {result.word}</h3>
                            <h3>Occurrences:</h3>

                            <ul>
                                {result.occurrences.map((occurrence, idx) => (
                                    <li key={idx}>
                                        <div><strong>Document: </strong> {occurrence.document}</div>
                                        <div><strong>Frequency: </strong> {occurrence.frequency}</div>
                                        <div><strong>Indices: </strong> {occurrence.indices.join(', ')}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default SearchBar;
