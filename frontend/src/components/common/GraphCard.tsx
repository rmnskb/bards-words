import { Dispatch, SetStateAction } from "react";

import { TShakespeareWorkTitle } from "../../constants";
import { IDocumentFreqElement, IYearFreqElement } from "../../types";
import FreqPerDocChart from "../graphs/BarChart";
import FreqPerYearChart from "../graphs/LineChart";

export type statsType = IDocumentFreqElement[] | IYearFreqElement[];

export interface GraphCardProps {
  title: string;
  stats: statsType;
  selectedWorks?: TShakespeareWorkTitle[] | null;
  setSelectedWorks?: Dispatch<SetStateAction<TShakespeareWorkTitle[] | null>>;
}


const GraphCard = ({
  title,
  stats,
  selectedWorks,
  setSelectedWorks,
}: GraphCardProps) => {
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

export default GraphCard;
