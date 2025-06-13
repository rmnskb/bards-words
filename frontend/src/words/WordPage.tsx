import { useState } from "react";
import { useParams } from "react-router";

import WorksExamples from "./WorksExamples.tsx";
import WordStatsCard from "./WordStatsCard.tsx";
import GraphsCard from "./GraphsCard.tsx";
import WordRelationshipsCard from "./WordRelationshipsCard.tsx";
import useWordDimensionsFetch from "../hooks/useWordDimensionsFetch.ts";
import useDictionaryEntryFetch from "../hooks/useDictionaryEntryFetch.ts";

/**
 * TODO: Add page navigation on the side
 * TODO: Decorate the WorksExamples
 */

const WordPage = () => {
  const [selectedWorks, setSelectedWorks] = useState<string[] | null>(null);
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
          <GraphsCard 
            wordDimensions={wordDimensions} 
            selectedWorks={selectedWorks} 
            setSelectedWorks={setSelectedWorks}
          />
          <WordRelationshipsCard word={word} />
          <WorksExamples word={word} selectedWorks={selectedWorks} />
        </div>
      )}
    </>
  );
};

export default WordPage;
