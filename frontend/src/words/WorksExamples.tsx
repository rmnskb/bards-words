import {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";

import {IWordIndex, OccurrenceElement} from "../WordInterfaces.ts";
import WordContextCard from "./WordContextCard";
import {apiUrl} from "../Constants.ts";

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
                await axios.get<IWordIndex>(`${apiUrl}/find-one?word=${word}`)
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
        <div>
            <h2>Examples from works: </h2>
            {error && (<p>{error}</p>)}
            {loading && (<p>Loading...</p>)}
            {wordIndex?.occurrences.map((result: OccurrenceElement, index) => (
                    <div key={index}>
                        <WordContextCard
                            document={result.document}
                            indices={result.indices}
                        />
                    </div>
                )
            )}
        </div>
    );
};

export default WorksExamples;