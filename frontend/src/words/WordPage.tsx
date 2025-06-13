import { useState } from "react";
import { useParams } from "react-router";

import WordStatsCard from "./WordStatsCard.tsx";
import WordFreqGraphsCard from "./WordFreqGraphsCard.tsx";
import WordRelationshipsCard from "./WordRelationshipsCard.tsx";
import WordWorksExamplesCard from "./WordWorksExamplesCard.tsx";
import useWordDimensionsFetch from "../hooks/useWordDimensionsFetch.ts";
import useDictionaryEntryFetch from "../hooks/useDictionaryEntryFetch.ts";
import { TShakespeareWorkTitle } from "../WorksEnum.ts";

/**
 * TODO: Add page navigation on the side
 * TODO: Decorate the WorksExamples
 */

const WordPage = () => {
  //TODO: Remove the null from the types 
  const [selectedWorks, setSelectedWorks] = useState<TShakespeareWorkTitle[] | null>(null);
  const params = useParams();
  const word = String(params.word);

  const wordDimensions = useWordDimensionsFetch(word);
  const dictionaryEntry = useDictionaryEntryFetch(word);

  return (
    <>
      {wordDimensions && (
        <div className="flex flex-col items-center justify-center">
          <WordStatsCard 
            wordDimensions={wordDimensions}
            dictionaryEntry={dictionaryEntry}
          />
          <WordFreqGraphsCard 
            wordDimensions={wordDimensions}
            selectedWorks={selectedWorks}
            setSelectedWorks={setSelectedWorks}
          />
          <WordRelationshipsCard word={word} />
          <WordWorksExamplesCard word={word} selectedWorks={selectedWorks} />
        </div>
      )}
    </>
  );
};

export default WordPage;
