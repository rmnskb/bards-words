import {IWordIndex, IDocumentTokens} from "../WordInterfaces.ts";
import WordCard from "./WordCard.tsx";
import ContextCard from "./ContextCard.tsx";
import {SearchResultType} from "./HomePage.tsx";

interface ResultProps {
    domain: string;
    results: SearchResultType | null;
    loading: boolean;
    error: string | null;
}


const SearchResults = (
    {
        domain
        , results
        , error
        , loading
    }: ResultProps
) => {
    return (
        <div>
            {loading && (<p>Loading...</p>)}
            {error && <p>{error}</p>}
            {results && (
                <div>
                    <ol>
                        {domain === "word" ? (
                            (results as IWordIndex[]).map((result: IWordIndex, index) => (
                                <li key={index}>
                                    <WordCard word={result}></WordCard>
                                </li>
                            ))
                        ) : (
                            (results as IDocumentTokens[])
                                .map((result: IDocumentTokens, index) => (
                                    <li key={index}>
                                        <ContextCard context={result}></ContextCard>
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
