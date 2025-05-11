import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid
    , Tooltip, ResponsiveContainer
} from "recharts";

import CustomTooltip from "./CustomTooltip.tsx";
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
                <CartesianGrid strokeDasharray="3 3" fillOpacity={0.6} fill="#F0E5C5"/>
                <XAxis dataKey="document"/>
                <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="frequency" fill="#8B1E3F"/>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default FreqPerDocChart;
