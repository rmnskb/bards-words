import { Dispatch, SetStateAction } from "react";

import { IWordDimensions, INavigationData } from "../../types";
import { TShakespeareWorkTitle } from "../../constants";
import GraphCard, { GraphCardProps } from "../common/GraphCard.tsx";

interface WordFreqGraphsCardProps extends INavigationData {
  wordDimensions: IWordDimensions;
  selectedWorks: TShakespeareWorkTitle[] | null;
  setSelectedWorks: Dispatch<SetStateAction<TShakespeareWorkTitle[] | null>>;
}


const WordFreqGraphsCard = ({ 
  id = "graphs",
  title = "Frequency Analysis",
  wordDimensions,
  selectedWorks,
  setSelectedWorks
}: WordFreqGraphsCardProps) => {
  const graphsData: GraphCardProps[] = [
    {
      title: "Frequency by Year",
      stats: wordDimensions.yearFrequencies,
    },
    {
      title: "Frequency by Work",
      stats: wordDimensions.documentFrequencies,
      selectedWorks: selectedWorks,
      setSelectedWorks: setSelectedWorks,
    }
  ]

  return (
    <div 
      id={id}
      className="
        block w-3xl p-5 m-3
        border-1 rounded-lg shadow-lg
      "
    >
      <p className="text-3xl font-bold font-im-fell">{title}</p>
      {graphsData.map((data, index) => (
        <GraphCard
          key={index}
          title={data.title}
          stats={data.stats}
          selectedWorks={data?.selectedWorks}
          setSelectedWorks={data?.setSelectedWorks}
        />
      ))}
    </div>
  );
};

export default WordFreqGraphsCard;
