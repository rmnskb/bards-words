import { useState } from "react";
import { useParams } from "react-router";

import WordStatsCard from "../components/words/WordStatsCard.tsx";
import WordFreqGraphsCard from "../components/words/WordFreqGraphsCard.tsx";
import WordRelationshipsCard from "../components/words/WordRelationshipsCard.tsx";
import WordWorksExamplesCard from "../components/words/WordWorksExamplesCard.tsx";
import WordPageNavigation from "../components/words/WordPageNavigation.tsx";
import useWordDimensionsFetch from "../hooks/words/useWordDimensionsFetch.ts";
import useDictionaryEntryFetch from "../hooks/words/useDictionaryEntryFetch.ts";
import { TShakespeareWorkTitle } from "../constants/";
import { INavigationData } from "../types/";

/**
 * TODO: Decorate the WorksExamples
 */

const WordPage = () => {
  //TODO: Remove the null from the types 
  const [selectedWorks, setSelectedWorks] = useState<TShakespeareWorkTitle[] | null>(null);
  const params = useParams();
  const word = String(params.word);

  const wordDimensions = useWordDimensionsFetch(word);
  const dictionaryEntry = useDictionaryEntryFetch(word);

  const navigationData: INavigationData[] = [
    {
      id: "stats",
      title: "Statistics",
    },
    {
      id: "graphs",
      title: "Frequency Analysis",
    },
    {
      id: "relationships",
      title: "Word Relationships",
    },
    {
      id: "examples",
      title: "Examples from works"
    }
  ];

  return (
    <>
      {wordDimensions && (
        <div className="flex flex-row items-start justify-center">
          <WordPageNavigation
            word={word}
            navigationData={navigationData}
          />
          <div className="flex flex-col items-center justify-center">
            <WordStatsCard
              id={navigationData[0].id}
              title={navigationData[0].title}
              wordDimensions={wordDimensions}
              dictionaryEntry={dictionaryEntry}
            />
            <WordFreqGraphsCard 
              id={navigationData[1].id}
              title={navigationData[1].title}
              wordDimensions={wordDimensions}
              selectedWorks={selectedWorks}
              setSelectedWorks={setSelectedWorks}
            />
            <WordRelationshipsCard
              id={navigationData[2].id}
              title={navigationData[2].title}
              word={word}
            />
            <WordWorksExamplesCard
              id={navigationData[3].id}
              title={navigationData[3].title}
              word={word}
              selectedWorks={selectedWorks}
            />
          </div>
          <div className="invisible w-sm"></div>
        </div>
      )}
    </>
  );
};

export default WordPage;
