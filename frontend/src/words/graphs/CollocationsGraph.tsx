import { useNavigate } from "react-router";
import { ResponsiveCirclePackingCanvas } from "@nivo/circle-packing";

import { ICollocationsStats } from "../../WordInterfaces";
import useDarkMode from "../../hooks/useDarkMode";

interface CollocationsGraphProps {
  stats: ICollocationsStats;
}

interface INode {
  name: string;
  value: number;
}

interface ICirclesPackingProps {
  name: string;
  children: INode[];
}

interface INodeEvent {
  id: string;
  value: number;
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

  const Tooltip = ({ id, value }: INodeEvent) => {
    return (
      <div className="
        flex flex-col p-1 rounded-lg 
        border shadow-lg 
        font-im-fell text-xl
        min-w-fit whitespace-nowrap
        bg-parchment border-royal-wine 
        dark:bg-warm-taupe dark:border-crimson
      ">
        <p>{id}</p>
        <p>{`Frequency: ${value}`}</p>
      </div>
    );
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
        tooltip={Tooltip}
        onClick={(node: INodeEvent) => {navigate(`/words/${node.id}`)}}
      />
    </div>
  );
};

export default CollocationsGraph;
