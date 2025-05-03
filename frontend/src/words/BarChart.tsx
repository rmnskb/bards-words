import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid
    , Tooltip, Legend, ResponsiveContainer
} from "recharts";

import {DocumentFrequencyElement} from "../WordInterfaces.ts";

interface BarChartData {
    stats: DocumentFrequencyElement[];
}

const FreqPerDocChart = ({stats}: BarChartData) => {
    const sortedStats =
        [...stats].sort((a, b) => b.frequency - a.frequency);

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
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="document"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="frequency" fill="#8884d8"/>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default FreqPerDocChart;
