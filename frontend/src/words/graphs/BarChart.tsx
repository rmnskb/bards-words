import {Dispatch, SetStateAction} from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid
    , Tooltip, ResponsiveContainer, Cell
} from "recharts";

import CustomTooltip from "./CustomTooltip.tsx";
import {IDocumentFreqElement} from "../../WordInterfaces.ts";
import { CategoricalChartState } from "recharts/types/chart/types";

interface BarChartData {
    stats: IDocumentFreqElement[];
    selectedWorks: string[] | null;
    setSelectedWorks: Dispatch<SetStateAction<string[] | null>>;
}

const FreqPerDocChart 
    = ({ stats, selectedWorks, setSelectedWorks }: BarChartData) => {
    const sortedStats =
        [...stats].sort((a, b) => b.frequency - a.frequency);

    const handleClick = (payload: CategoricalChartState) => {
      if (!payload || !payload.activeLabel) return null;

      const activeLabel = payload.activeLabel;

      if (!selectedWorks) setSelectedWorks([activeLabel]);
      else if (selectedWorks.includes(activeLabel)) {
        const idx = selectedWorks.indexOf(activeLabel);

        // Remove the item from the selection
        setSelectedWorks([...selectedWorks.slice(0, idx), ...selectedWorks.slice(idx + 1)]);
      }
      else setSelectedWorks([...selectedWorks, activeLabel]); 
    };

    return (
        <ResponsiveContainer width={"100%"} height={"100%"}>
            <BarChart
                width={500}
                height={300}
                data={sortedStats}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                onClick={(payload) => {handleClick(payload)}}
            >
                <CartesianGrid strokeDasharray="3 3" fillOpacity={0.6} fill="#F0E5C5"/>
                <XAxis dataKey="document"/>
                <YAxis label={{value: 'Frequency', angle: -90, position: 'insideLeft'}}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="frequency">
                  {
                    sortedStats.map((entry: IDocumentFreqElement, index: number) => (
                      selectedWorks && selectedWorks.length > 0 ? (
                        <Cell 
                          key={index} 
                          fill={selectedWorks.includes(entry.document) ? "#8B1E3F" : "#696969"}
                        />
                      ) : (
                        <Cell key={index} fill="#8B1E3F"/>
                      ))
                    )
                  }
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default FreqPerDocChart;
