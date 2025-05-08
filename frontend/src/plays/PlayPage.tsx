import {useState, useEffect} from "react";
import {useParams} from "react-router";
import axios, {AxiosResponse} from "axios";

import {IDocumentTokens} from "../WordInterfaces.ts";
import {apiUrl} from "../Constants.ts";

const PlayPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tokens, setTokens] = useState<string[] | null>();
    const params = useParams();
    const document = String(params.document);
    // TODO: Add highlighting for given indices
    // const highlight = Number(params.highlight);

    const fetchTokens
        = async (document: string): Promise<IDocumentTokens | null> => {
        try {
            const response: AxiosResponse<IDocumentTokens>
                = await axios.get<IDocumentTokens>(`${apiUrl}/document?search=${document}`);
            return response.data;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchTokens(document)
            .then(response => {
                if (response) {
                    const tokens = response.occurrences;
                    setTokens(tokens);
                }
                setLoading(false);
            })
            .catch((e: string) => {
                setError(e);
                setLoading(false);
            })
    }, [document]);

    const formattedText = tokens ? tokens.map((token, index) => {
        if (token === "") {
            return <br key={index}/>;
        }
        return <span key={index}> {token} </span>;
    }) : null;

    return (
        <>
            {loading && (<p>Loading...</p>)}
            {error && (<p>{error}</p>)}
            {tokens && (
                <div>
                    {tokens.length > 0 && (formattedText)}
                </div>
            )}
        </>
    );
};

export default PlayPage;
