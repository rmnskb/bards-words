import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

import {YearFrequencyElement} from "../WordInterfaces.ts";

interface LineChartData {
    stats: YearFrequencyElement[];
}

const FreqPerYearChart = ({stats}: LineChartData) => {
    const sortedStats =
        [...stats].sort((a, b) => a.year - b.year)

    // TODO: Add zeroes to missing years
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
                <XAxis dataKey="year"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Line type="monotone" dataKey="frequency" stroke="#8884d8"/>
            </LineChart>
        </ResponsiveContainer>
    );
};

export default FreqPerYearChart;
