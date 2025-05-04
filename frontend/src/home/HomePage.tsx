import {useState} from "react";

import SearchBar from "./SearchBar.tsx";
import {IDocumentTokens, IWordIndex} from "../WordInterfaces.ts";
import SearchResults from "./SearchResults.tsx";

export type SearchResultType = IWordIndex[] | IDocumentTokens[];


const HomePage = () => {
    const [results, setResults] = useState<SearchResultType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [domain, setDomain] = useState<string>("word");

    return (
        <>
            <SearchBar
                setResults={setResults}
                setLoading={setLoading}
                setError={setError}
                domain={domain}
                setDomain={setDomain}
            />
            <SearchResults
                domain={domain}
                results={results}
                loading={loading}
                error={error}
            />
        </>
    );
}

export default HomePage;
