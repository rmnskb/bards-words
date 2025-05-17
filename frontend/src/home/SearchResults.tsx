import {IWordIndex, IDocumentTokens} from "../WordInterfaces.ts";
import WordCard from "./WordCard.tsx";
import ContextCard from "./ContextCard.tsx";
import {SearchResultType} from "./HomePage.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

interface ResultProps {
    search: string;
    domain: string;
    results: SearchResultType | null;
    loading: boolean;
    error: string | null;
}


const SearchResults = (
    {
        search
        , domain
        , results
        , error
        , loading
    }: ResultProps
) => {
    return (
        <div className="w-full max-w-2xl mx-auto px-4 mt-4">
            {loading && (<LoadingSpinner/>)}
            {error && <p>{error}</p>}
            {results && (
                <div className="">
                    <ol className="">
                        {domain === "word" ? (
                            (results as IWordIndex[]).map((result: IWordIndex, index) => (
                                <li className="py-1" key={index}>
                                    <WordCard word={result}></WordCard>
                                </li>
                            ))
                        ) : (
                            (results as IDocumentTokens[])
                                .map((result: IDocumentTokens, index) => (
                                    <li className="py-1 w-full" key={index}>
                                        <ContextCard highlight={search} context={result}></ContextCard>
                                    </li>
                                ))
                        )}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
