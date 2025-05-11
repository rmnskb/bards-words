import {useState} from "react";

import SearchBar from "./SearchBar.tsx";
import {IDocumentTokens, IWordIndex} from "../WordInterfaces.ts";
import SearchResults from "./SearchResults.tsx";

export type SearchResultType = IWordIndex[] | IDocumentTokens[];

// TODO: handle multiple results clean up
const HomePage = () => {
    const [search, setSearch] = useState<string>("");
    const [results, setResults] = useState<SearchResultType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [domain, setDomain] = useState<string>("word");

    return (
        <>
            <div className={`
                flex flex-col items-center 
                ${results ? 'justify-start pt-24' : 'justify-center'} min-h-screen
                font-baskerville
            `}>
                <SearchBar
                    search={search}
                    setSearch={setSearch}
                    setResults={setResults}
                    setLoading={setLoading}
                    setError={setError}
                    setDomain={setDomain}
                />
                {results && (
                    <div className="">
                        <SearchResults
                            search={search}
                            domain={domain}
                            results={results}
                            loading={loading}
                            error={error}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default HomePage;
