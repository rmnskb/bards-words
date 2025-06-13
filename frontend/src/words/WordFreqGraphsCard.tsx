import { Dispatch, SetStateAction } from "react";

import { IWordDimensions } from "../WordInterfaces.ts";
import GraphCard, { GraphCardProps } from "../components/GraphCard.tsx";
import { TShakespeareWorkTitle } from "../WorksEnum.ts";

interface GraphsCardProps {
  wordDimensions: IWordDimensions;
  selectedWorks: TShakespeareWorkTitle[] | null;
  setSelectedWorks: Dispatch<SetStateAction<TShakespeareWorkTitle[] | null>>;
}


const WordFreqGraphsCard = ({ 
  wordDimensions,
  selectedWorks,
  setSelectedWorks
}: GraphsCardProps) => {
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
    <div className="
      block w-3xl p-5 m-3
      border-1 rounded-lg shadow-lg
    ">
      <p className="text-3xl font-bold font-im-fell">Frequency Analysis</p>
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
