import {useState, useEffect} from "react";
import {useParams} from "react-router";
import axios, {AxiosResponse} from "axios";

import {IWordDimensions, YearFrequencyElement} from "../WordInterfaces.ts";
import FreqPerYearChart from "./LineChart.tsx";
import FreqPerDocChart from "./BarChart.tsx";
import WorksExamples from "./WorksExamples.tsx";
import {apiUrl} from "../Constants.ts";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

/**
 * TODO: Divide the element into their own separate cards
 * TODO: Add page navigation on the side
 * TODO: Hide the graphs in the dropdown
 * TODO: Decorate the WorksExamples
 * TODO: Show synonyms and antonyms
 * TODO: Display collocations
 * TODO: Appearance in the sentiments??
 * TODO: 3rd party integration, e.g. etymology, definition
 */

const WordPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [wordDimensions, setWordDimensions] = useState<IWordDimensions | null>(null);
    const params = useParams();
    const word = String(params.word);

    const fetchWordDimensions
        = async (word: string): Promise<IWordDimensions | null> => {
        try {
            const response: AxiosResponse<IWordDimensions> = await axios.get(`${apiUrl}/stats?word=${word}`);
            return response.data;
        } catch (errorMsg) {
            console.error('Error fetching search', errorMsg);
            return null;
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchWordDimensions(word)
            .then((response) => {
                setWordDimensions(response);
                setLoading(false);
            })
            .catch((e: string) => {
                setError(e);
                setLoading(false);
            })
    }, [word]);

    const findFirstAppearance
        = (stats: YearFrequencyElement[]): number | undefined => {
        if (stats.length === 0) {
            return undefined;
        }

        return Math.min(...stats.map(entry => entry.year));
    };

    const calculateTotalFrequency
        = (stats: YearFrequencyElement[]): number | undefined => {
        if (stats.length === 0) {
            return undefined;
        }

        return stats.map(entry => entry.frequency).reduce((x, y) => x + y, 0);
    };

    return (
        <>
            <div>
                {loading && (<LoadingSpinner/>)}
                {error && (<p>{error}</p>)}
                {wordDimensions && (
                    <div>
                        <div>
                            <p
                                className="
                                    p-5
                                    first-letter:float-left first-letter:mr-3
                                    first-letter:text-9xl first-letter:font-bold
                                    first-line:tracking-widest first-line:uppercase first-line:text-3xl
                                    font-im-fell font-bold
                                "
                            >{wordDimensions.word}</p>
                            <p>First Appearance: {findFirstAppearance(wordDimensions.yearFrequencies)}</p>
                            <p>Total Frequency: {calculateTotalFrequency(wordDimensions.yearFrequencies)}</p>
                        </div>
                        <div
                            className="
                                 flex flex-row w-full p-5
                            "
                        >
                            <div className="
                                bg-[#F2EBD3] p-3 rounded-lg shadow-lg w-1/2 h-[300px] mr-4
                            ">
                                {wordDimensions?.yearFrequencies && (
                                    <FreqPerYearChart stats={wordDimensions.yearFrequencies}/>)}
                            </div>
                            <div className="
                                bg-[#F2EBD3] p-3 rounded-lg shadow-lg w-1/2 h-[300px] mr-4
                            ">
                                {wordDimensions?.documentFrequencies && (
                                    <FreqPerDocChart stats={wordDimensions.documentFrequencies}/>)}
                            </div>
                        </div>
                        <div>
                            <WorksExamples word={word}/>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default WordPage;
