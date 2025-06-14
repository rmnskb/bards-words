import {
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import CustomTooltip from "./CustomTooltip.tsx";
import { IYearFreqElement } from "../../types";
import useDarkMode from "../../hooks/common/useDarkMode.ts";
import { adaptRechartsTooltip } from "../../adapters/tooltipAdapters.ts";

interface LineChartData {
  stats: IYearFreqElement[];
}


const FreqPerYearChart = ({stats}: LineChartData) => {
  const isDarkMode = useDarkMode();

  const fillMissingYears
    = (data: IYearFreqElement[]): IYearFreqElement[] => {
      const startYear = 1592;
      const endYear = 1613;

      const yearMap = new Map<number, IYearFreqElement>();
      data.forEach(item => {
        yearMap.set(item.year, item);
      });

      const filledData: IYearFreqElement[] = [];
      for (let year = startYear; year <= endYear; year++) {
        if (yearMap.has(year)) filledData.push(yearMap.get(year)!);
        else filledData.push({ year, frequency: 0 });
      }

      return filledData;
    };

  const imputedStats = fillMissingYears(stats);

  const sortedStats =
    [...imputedStats].sort((a, b) => a.year - b.year)

  // TODO: Handle the elements overlap
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <LineChart
        width={500}
        height={300}
        data={sortedStats}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis
          dataKey="year"
          label={{ value: 'Year', position: 'insideBottomRight', offset: 0 }}
        />
        <YAxis label={{value: 'Frequency', angle: -90, position: 'insideLeft'}} />
        <Tooltip content={(props) => (<CustomTooltip data={adaptRechartsTooltip(props)} />)} />
        <Line type="monotone" dataKey="frequency" stroke={isDarkMode ? "#6B4C9A" : "#8B1E3F"} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FreqPerYearChart;
