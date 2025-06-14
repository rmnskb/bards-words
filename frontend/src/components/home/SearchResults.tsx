import WordCard from "./WordCard.tsx";
import ContextCard from "./ContextCard.tsx";
import LoadingSpinner from "../common/LoadingSpinner.tsx";
import { UseSearchFetchReturn } from "../../hooks/home/useSearchFetch.ts";
import { IWordIndex, IDocumentTokens } from "../../types";

interface SearchResultsProps extends Omit<UseSearchFetchReturn, "performSearch"> {
  search: string;
}


const SearchResults = (
  {
    search
    , domain
    , results
    , error
    , loading
  }: SearchResultsProps
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
