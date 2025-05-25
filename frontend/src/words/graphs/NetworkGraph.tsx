import ForceGraph2D from "react-force-graph-2d";
import * as d3 from "d3-force";

import { ICollocationsStats } from "../../WordInterfaces";

interface NetworkGraphProps {
  stats: ICollocationsStats;
}

interface INode {
  id: string;
  name: string;
  val: number;
}

interface ILink {
  source: string;
  target: string;
  value: number;
}

const NetworkGraph = ({stats}: NetworkGraphProps) => {
  const maxFreq = Math.max(...stats.collocationsStats.map(item => item.frequency));

  const mainNode: INode = { id: stats.word, name: stats.word, val: maxFreq * 1.5 };
  const collocationsNodes: INode[] = stats.collocationsStats.map(item => ({
    id: item.other
    , name: item.other
    , val: Math.sqrt(item.frequency)
  }));

  const nodes: INode[] = [mainNode, ...collocationsNodes];

  const links: ILink[] = stats.collocationsStats.map(item => ({
    source: stats.word
    , target: item.other
    , value: item.frequency
  }));

  const d3ForceConfig = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(link => {
      return 100 - link.value * 10;  // Closer for higher freq 
    }))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(250, 150));

  return (
    <div className="w-full h-full">
      <ForceGraph2D
        graphData={{ nodes, links }}
        width={700}
        height={350}
        nodeLabel="name"
        nodeVal="val"
        d3Force="linkDistance"
        d3ForceConfig={d3ForceConfig}
      />
    </div>
  );
};

export default NetworkGraph;
