import {Dispatch, SetStateAction} from "react";

import {IWordDimensions} from "../WordInterfaces.ts";
import FreqPerYearChart from "./graphs/LineChart.tsx";
import FreqPerDocChart from "./graphs/BarChart.tsx";

interface GraphsCardProps {
    wordDimensions: IWordDimensions;
    selectedWorks: string[] | null;
    setSelectedWorks: Dispatch<SetStateAction<string[] | null>>;
}

const GraphsCard = ({ wordDimensions, selectedWorks, setSelectedWorks }: GraphsCardProps) => {
    return (
        <div className="
            block w-3xl p-5 m-3
            border-1 rounded-lg shadow-lg
        ">
            <p className="text-3xl font-bold font-im-fell">Frequency Analysis</p>
            <div className="bg-[#F2EBD3] p-3 my-3 rounded-lg border-1 shadow-lg w-full h-[350px]">
                <p className="text-2xl ml-2 font-im-fell">Frequency by Year</p>
                {wordDimensions?.yearFrequencies && (
                    <FreqPerYearChart stats={wordDimensions.yearFrequencies}/>)}
            </div>
            <div className="bg-[#F2EBD3] p-3 my-3 rounded-lg border-1 shadow-lg w-full h-[350px]">
                <p className="text-2xl ml-2 font-im-fell">Frequency by Work</p>
                {wordDimensions?.documentFrequencies && (
                    <FreqPerDocChart 
                      stats={wordDimensions.documentFrequencies}
                      selectedWorks={selectedWorks}
                      setSelectedWorks={setSelectedWorks}
                    />
                )}
            </div>
        </div>
    );
};

export default GraphsCard;
