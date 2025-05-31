import { useNavigate } from "react-router";
import { ResponsiveCirclePackingCanvas } from "@nivo/circle-packing";

import { ICollocationsStats } from "../../WordInterfaces";

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
        theme={{  }}
        valueFormat=" >-"
        colors={{ scheme: "yellow_orange_red" }}
        colorBy="id"
        padding={1}
        leavesOnly={true}
        enableLabels={true}
        label="id"
        labelsSkipRadius={10}
        animate={true}
        tooltip={({
          id,
          value
        }) => 
          <div className="
            flex flex-col p-1 bg-[#F5F0E1] rounded-lg 
            border border-[#8B1E3F] shadow-lg 
            font-im-fell text-xl
            min-w-fit whitespace-nowrap
          ">
            <p>{id}</p>
            <p>{`Frequency: ${value}`}</p>
          </div> 
        }
        onClick={(node: INodeEvent) => {navigate(`/words/${node.id}`)}}
      />
    </div>
  );
};

export default CollocationsGraph;
