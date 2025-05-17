import {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";

import {IWordIndex, OccurrenceElement} from "../WordInterfaces.ts";
import WordContextCard from "./WordContextCard";
import {apiUrl} from "../Constants.ts";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

interface WordExamplesProps {
    word: string;
}

const WorksExamples = ({word}: WordExamplesProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>();
    const [wordIndex, setWordIndex] = useState<IWordIndex | null>(null);

    const fetchWordIndices
        = async (word: string): Promise<IWordIndex | null> => {
        try {
            const response: AxiosResponse<IWordIndex> =
                await axios.get<IWordIndex>(`${apiUrl}/word?search=${word}`)
            return response.data;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchWordIndices(word)
            .then((response) => {
                setWordIndex(response);
                setLoading(false);
            })
            .catch((e: string) => {
                setError(e);
                setLoading(false);
            });
    }, [word]);

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <p className="text-3xl m-3">Examples from works:</p>
            {error && (<p>{error}</p>)}
            {loading && (<LoadingSpinner/>)}
            {wordIndex?.occurrences.map((result: OccurrenceElement, index) => (
                    <div key={index} className="
                        border w-1/2 rounded-lg m-2 shadow-lg m-3
                        hover:border-[#D4AF37] hover:outline-[#D4AF37] hover:scale-110
                    ">
                        <WordContextCard
                            document={result.document}
                            indices={result.indices}
                            word={word}
                        />
                    </div>
                )
            )}
        </div>
    );
};

export default WorksExamples;