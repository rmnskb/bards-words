import {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";

import {IDocumentTokens} from "../WordInterfaces.ts";
import getShakespeareWorkCode from "../WorksEnum.ts";
import {apiUrl} from "../Constants.ts";
import {Link} from "react-router";

interface WordContextCardProps {
    document: string;
    indices: number[];
    word: string;
}

const WordContextCard
    = ({document, indices, word}: WordContextCardProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tokens, setTokens] = useState<string[][]>([]);

    useEffect(() => {
        const fetchTokens
            = async (document: string, index: number): Promise<IDocumentTokens | null> => {
            const work = getShakespeareWorkCode(document);
            const startIndex: number = index - 5;
            const endIndex: number = index + 5;

            try {
                const response: AxiosResponse<IDocumentTokens> =
                    await axios.get<IDocumentTokens>(
                        `${apiUrl}/tokens?document=${work}&start=${startIndex}&end=${endIndex}`
                    )
                return response.data;
            } catch (e) {
                console.error(e);
                return null;
            }
        };

        const getRandomIndices
            = (array: number[], maxSize: number) => {
            // randomly sample up to maxSize value from the given array (without substitution)
            if (array.length === 0) return [];
            if (array.length <= maxSize) return [...array];

            const sampleSize = Math.min(
                Math.floor(Math.random() * maxSize) + 1,
                array.length
            );

            const selectedIndices = new Set<number>();

            while (selectedIndices.size < sampleSize) {
                const randomIndex = Math.floor(Math.random() * array.length);
                selectedIndices.add(randomIndex);
            }

            return Array.from(selectedIndices).map(index => array[index]);
        };

        // FIXME: bug, sometimes the items are duplicated multiple times
        const randomIndices = getRandomIndices(indices, 3)

        const handleNewTokens = (newTokens: string[] | undefined) => {
            if (newTokens) {
                setTokens(prevTokens => [...prevTokens, newTokens]);
            }
        };

        const fetchAllTokens = async () => {
            setLoading(true);
            try {
                const promises
                    = randomIndices.map(index => fetchTokens(document, index));
                const responses = await Promise.all(promises);
                responses.forEach(response => handleNewTokens(response?.occurrences));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchAllTokens()
            .catch((e: string) => setError(e));
    }, [document, indices]);

    const formatText = (text: string[], highlight: string) => {
        return text ? text.map((token, index) => {
            if (token === "") {
                return <br key={index}/>;
            } else if (token.toLowerCase().replace(/[\W\s]*/g, "") === highlight) {
                return <span key={index} className="text-[#8B1E3F] font-bold"> {token} </span>;
            }

            return <span key={index}> {token} </span>;
        }) : null;
    };

    return (
        <div>
            {loading && (<p>Loading...</p>)}
            {error && (<p>{error}</p>)}
            {tokens && (
                <div className="
                    block p-5 w-full
                ">
                    <Link to={"/plays/" + getShakespeareWorkCode(document)}>
                        <p className="text-3xl font-im-fell">{document}</p>
                        <ul>
                            {tokens.map((token, index) => (
                                <li key={index} className="p-1 m-1 border-1 rounded-lg">
                                    <p>...{formatText(token, word)}...</p>
                                </li>
                            ))}
                        </ul>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default WordContextCard;
