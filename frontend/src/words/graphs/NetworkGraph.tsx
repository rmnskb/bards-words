import ForceGraph2D from "react-force-graph-2d";

import { ICollocationsStats } from "../../WordInterfaces";

interface NetworkGraphProps {
  stats: ICollocationsStats;
}

const NetworkGraph = ({stats}: NetworkGraphProps) => {
  const nodes = [{ id: stats.word, name: stats.word }];
  const links = stats.collocationsStats.map(item => ({
    source: stats.word
    , target: item.other
    , value: item.frequency
  }));


  return (
    <div className="w-full h-full">
      <ForceGraph2D
        graphData={{ nodes, links }}
        width={500}
        height={300}
        nodeLabel="name"
        backgroundColor="#8B1E3F"
        linkDirectionalArrowLength={3.5}
      />
    </div>
  );
};

export default NetworkGraph;
