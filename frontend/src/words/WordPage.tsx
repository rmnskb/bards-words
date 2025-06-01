import {useState, useEffect} from "react";
import {useParams} from "react-router";
import axios, {AxiosResponse} from "axios";

import {IWordDimensions, IDictionaryEntry} from "../WordInterfaces.ts";
import WorksExamples from "./WorksExamples.tsx";
import WordStatsCard from "./WordStatsCard.tsx";
import {apiUrl} from "../Constants.ts";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import GraphsCard from "./GraphsCard.tsx";
import WordRelationshipsCard from "./WordRelationshipsCard.tsx";

/**
 * TODO: Add page navigation on the side
 * TODO: Decorate the WorksExamples
 */

const WordPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [wordDimensions, setWordDimensions] = useState<IWordDimensions | null>(null);
    const [dictionaryEntry, setDictionaryEntry] = useState<IDictionaryEntry | null>(null);
    const [selectedWorks, setSelectedWorks] = useState<string[] | null>(null);
    const params = useParams();
    const word = String(params.word);
    const dictionaryApi = "https://api.dictionaryapi.dev/api/v2/entries/en";

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

    const fetchDictionaryEntry =
        async (word: string): Promise<IDictionaryEntry[] | null> => {
            try {
                const response: AxiosResponse<IDictionaryEntry[]> = await axios.get(`${dictionaryApi}/${word}`);
                return response.data;
            } catch (e) {
                console.error("Error fetching the dictionary entry", e);
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
            });

        fetchDictionaryEntry(word)
            .then((response) => {
                // Tale only the best match, disregard the rest
                setDictionaryEntry(response ? response[0] : null);
                setLoading(false);
            })
            .catch((e: string) => {
                setError(e);
                setLoading(false);
            });
    }, [word]);

    return (
        <>
            <div>
                {loading && (<LoadingSpinner/>)}
                {error && (<p>{error}</p>)}
                {wordDimensions && (
                    <div className="flex flex-col items-center justify-center">
                        <WordStatsCard wordDimensions={wordDimensions} dictionaryEntry={dictionaryEntry}/>
                        <GraphsCard wordDimensions={wordDimensions} selectedWorks={selectedWorks} setSelectedWorks={setSelectedWorks}/>
                        <WordRelationshipsCard word={word}/>
                        <WorksExamples word={word} selectedWorks={selectedWorks}/>
                    </div>
                )}
            </div>
        </>
    );
};

export default WordPage;
