import { useNavigate } from "react-router";
import { ResponsiveCirclePackingCanvas } from "@nivo/circle-packing";

import CustomTooltip from "./CustomTooltip";
import { ICollocationsStats, INodeEvent } from "../../types";
import useDarkMode from "../../hooks/common/useDarkMode";
import { adaptNivoTooltip } from "../../adapters/tooltipAdapters";

interface CollocationsGraphProps {
  stats: ICollocationsStats;
}

interface ICirclesPackingProps {
  name: string;
  children: {
    name: string;
    value: number;
  }[];
}


const CollocationsGraph = ({ stats }: CollocationsGraphProps) => {
  const navigate = useNavigate();
  const isDarkMode = useDarkMode();

  const data: ICirclesPackingProps = {
    name: stats.word,
    children: stats.collocationsStats.map(item => ({
      name: item.other,
      value: item.frequency
    })),
  };

  return (
    <div className="w-full h-full">
      <ResponsiveCirclePackingCanvas 
        data={data}
        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        id="name"
        valueFormat=" >-"
        colors={{ scheme: (isDarkMode ? "purples" : "yellow_orange_red") }}
        colorBy="id"
        padding={1}
        leavesOnly={true}
        enableLabels={true}
        theme={{
          labels: {
            text: {
              fontFamily: "IM Fell English",
              fontSize: 15,
              fontWeight: 400,
            }
          }
        }}
        label="id"
        labelsSkipRadius={10}
        labelTextColor="#2C1810"
        animate={true}
        tooltip={(props: INodeEvent) => (<CustomTooltip data={adaptNivoTooltip(props)} />)}
        onClick={(node: INodeEvent) => {navigate(`/words/${node.id}`)}}
      />
    </div>
  );
};

export default CollocationsGraph;
