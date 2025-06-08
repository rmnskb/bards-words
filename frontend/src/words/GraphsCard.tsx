import { Dispatch, SetStateAction } from "react";

import { IWordDimensions, IDocumentFreqElement, IYearFreqElement } from "../WordInterfaces.ts";
import FreqPerYearChart from "./graphs/LineChart.tsx";
import FreqPerDocChart from "./graphs/BarChart.tsx";

type statsType = IDocumentFreqElement[] | IYearFreqElement[];

interface IGraphsCardProps {
  wordDimensions: IWordDimensions;
  selectedWorks: string[] | null;
  setSelectedWorks: Dispatch<SetStateAction<string[] | null>>;
}

interface IGraphCardProps {
  title: string;
  stats: statsType;
  selectedWorks?: string[] | null;
  setSelectedWorks?: Dispatch<SetStateAction<string[] | null>>;
}


const GraphsCard = ({ 
  wordDimensions,
  selectedWorks,
  setSelectedWorks
}: IGraphsCardProps) => {

  const GraphCard = ({
    title,
    stats,
    selectedWorks,
    setSelectedWorks,
  }: IGraphCardProps) => {
    const isDocFreqElem = 
      (stats: statsType): stats is IDocumentFreqElement[] => {
        return stats.length > 0
          && "document" in stats[0] 
          && "frequency" in stats[0];
      };

    return (
      <div className="
        p-3 my-3 rounded-lg border-1 shadow-lg w-full h-[350px]
        bg-vellum border-quill dark:bg-aged-leather dark:border-candlelight
      ">
        <p className="text-2xl ml-2 font-im-fell">{title}</p>
        {isDocFreqElem(stats) ? (
          <FreqPerDocChart 
            stats={stats}
            selectedWorks={selectedWorks || []}
            setSelectedWorks={setSelectedWorks || (() => {})}
          />
        ) : (
          <FreqPerYearChart stats={stats} />
        )}
      </div>
    );
  };

  const graphsData: IGraphCardProps[] = [
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

export default GraphsCard;
