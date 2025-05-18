import {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";

import {IDocumentTokens} from "../WordInterfaces.ts";
import getShakespeareWorkCode from "../WorksEnum.ts";
import {apiUrl} from "../Constants.ts";
import {Link} from "react-router";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

interface WordContextCardProps {
    document: string;
    index: number;
    word: string;
}

const WordContextCard
    = ({document, index, word}: WordContextCardProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tokens, setTokens] = useState<string[] | null>([]);

    const fetchTokens
        = async (document: string, index: number): Promise<IDocumentTokens | null> => {
        const work = getShakespeareWorkCode(document);
        const startIndex: number = index - 7;
        const endIndex: number = index + 8;

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

    useEffect(() => {
        fetchTokens(document, index)
            .then((response) => {
                if (response) {
                    setTokens(response.occurrences)
                }
                setLoading(false);
            })
            .catch((e: string) => {
                setError(e);
                setLoading(false);
            })
    }, [document, index]);

    return (
        <div>
            {loading && (<LoadingSpinner/>)}
            {error && (<p>{error}</p>)}
            {tokens && (
                <div className="
                    block p-5 w-full
                ">
                    <Link to={"/plays/" + getShakespeareWorkCode(document)}>
                        <p>...{formatText(tokens, word)}...</p>
                        <p className="text-xl font-im-fell">{document}</p>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default WordContextCard;
