import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

import CustomTooltip from "./CustomTooltip.tsx";
import {YearFrequencyElement} from "../WordInterfaces.ts";

interface LineChartData {
    stats: YearFrequencyElement[];
}

const FreqPerYearChart = ({stats}: LineChartData) => {
    const fillMissingYears
        = (data: YearFrequencyElement[]): YearFrequencyElement[] => {
        const startYear = 1592;
        const endYear = 1613;

        const yearMap = new Map<number, YearFrequencyElement>();
        data.forEach(item => {
            yearMap.set(item.year, item);
        });

        const filledData: YearFrequencyElement[] = [];
        for (let year = startYear; year <= endYear; year++) {
            if (yearMap.has(year)) {
                filledData.push(yearMap.get(year)!);
            } else {
                filledData.push({year, frequency: 0})
            }
        }

        return filledData;
    };

    const imputedStats = fillMissingYears(stats);

    const sortedStats =
        [...imputedStats].sort((a, b) => a.year - b.year)

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
                    label={{value: 'Year', position: 'insideBottomRight', offset: 0}}
                />
                <YAxis label={{value: 'Frequency', angle: -90, position: 'insideLeft'}}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Line type="monotone" dataKey="frequency" stroke="#8B1E3F"/>
            </LineChart>
        </ResponsiveContainer>
    );
};

export default FreqPerYearChart;
