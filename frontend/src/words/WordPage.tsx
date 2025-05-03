import {useState, useEffect} from "react";
import {useParams} from "react-router";
import axios, {AxiosResponse} from "axios";

import {IWordDimensions, YearFrequencyElement} from "../WordInterfaces.ts";
import FreqPerYearChart from "./LineChart.tsx";
import FreqPerDocChart from "./BarChart.tsx";

const WordPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [wordDimensions, setWordDimensions] = useState<IWordDimensions | null>(null);
    const params = useParams();
    const word = String(params.word);
    const apiUrl = "//localhost:8000/api/v1"

    const fetchWord = async (word: string): Promise<IWordDimensions | null> => {
        try {
            const response: AxiosResponse<IWordDimensions> = await axios.get(`${apiUrl}/get-stats?word=${word}`);
            return response.data;
        } catch (errorMsg) {
            console.error('Error fetching search', errorMsg);
            return null;
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchWord(word)
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
            {loading && (<p>Loading...</p>)}
            {error && (<p>{error}</p>)}
            {
                wordDimensions && (
                    <div>
                        <h1>{wordDimensions.word}</h1>
                        <p>First Appearance: {findFirstAppearance(wordDimensions.yearFrequencies)}</p>
                        <p>Total Frequency: {calculateTotalFrequency(wordDimensions.yearFrequencies)}</p>
                    </div>
                )
            }
            <div style={{width: '50%', height: '300px'}}>
                {wordDimensions?.yearFrequencies && (<FreqPerYearChart stats={wordDimensions.yearFrequencies}/>)}
            </div>
            <div style={{width: '50%', height: '300px'}}>
                {wordDimensions?.documentFrequencies && (<FreqPerDocChart stats={wordDimensions.documentFrequencies}/>)}
            </div>
        </>
    )
}

export default WordPage;
