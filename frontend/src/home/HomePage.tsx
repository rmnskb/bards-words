import { useState } from "react";

import SearchArea from "./SearchArea.tsx";
import SearchResults from "./SearchResults.tsx";
import useParametrisedSearchFetch from "../hooks/useParametrisedSearchFetch.ts";


// TODO: handle multiple results clean up
const HomePage = () => {
  const [search, setSearch] = useState<string>("");

  const {
    loading,
    error,
    results,
    domain,
    performSearch,
    showSuggestions,
    setShowSuggestions,
    selectedIndex,
    setSelectedIndex,
    searchParameter,
  } = useParametrisedSearchFetch();

  return (
    <div className={`
      flex flex-col items-center 
      ${results ? 'justify-start pt-24' : 'justify-center'} min-h-screen
      font-baskerville
    `}>
      <SearchArea
        search={search}
        setSearch={setSearch}
        performSearch={performSearch}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        searchParameter={searchParameter}
      />
      {results && (
        <SearchResults
          search={search}
          domain={domain}
          results={results}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default HomePage;
