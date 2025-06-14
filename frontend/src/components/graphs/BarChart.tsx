import { Dispatch, SetStateAction } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { CategoricalChartState } from "recharts/types/chart/types";

import CustomTooltip from "./CustomTooltip.tsx";
import { IDocumentFreqElement } from "../../types";
import useDarkMode from "../../hooks/common/useDarkMode.ts";
import { TShakespeareWorkTitle } from "../../constants";
import { adaptRechartsTooltip } from "../../adapters/tooltipAdapters.ts";

interface BarChartData {
  stats: IDocumentFreqElement[];
  selectedWorks: TShakespeareWorkTitle[] | null;
  setSelectedWorks: Dispatch<SetStateAction<TShakespeareWorkTitle[] | null>>;
}


const FreqPerDocChart = (
  { stats, selectedWorks, setSelectedWorks }: BarChartData
) => {
  const { isDark, } = useDarkMode();

  const sortedStats =
    [...stats].sort((a, b) => b.frequency - a.frequency);

  const handleClick = (payload: CategoricalChartState) => {
    if (!payload || !payload.activeLabel) return null;

    const activeLabel = payload.activeLabel as TShakespeareWorkTitle;

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
        <CartesianGrid strokeDasharray="3 3" fillOpacity={0.6} />
        <XAxis dataKey="document"/>
        <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}/>
        <Tooltip content={(props) => (<CustomTooltip data={adaptRechartsTooltip(props)} />)} />
        <Bar dataKey="frequency">
          {
            sortedStats.map((entry: IDocumentFreqElement, index: number) => (
              selectedWorks && selectedWorks.length > 0 ? (
                <Cell
                  key={index}
                  fill={
                    selectedWorks.includes(entry.document) ?
                      (isDark ? "#6B4C9A" : "#8B1E3F")
                      : "#696969"
                  }
                />
              ) : (
                <Cell key={index} fill={isDark ? "#6B4C9A" : "#8B1E3F"} />
              ))
            )
          }
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FreqPerDocChart;
