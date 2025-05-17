import {useState, useEffect} from "react";
import {useParams} from "react-router";
import axios, {AxiosResponse} from "axios";

import {IDocumentTokens} from "../WordInterfaces.ts";
import {apiUrl} from "../Constants.ts";

/**
 TODO: Create visual hierarchy with distinct styling for play titles, character names, dialogues, etc.
 TODO: Add spacing between acts, speeches, scenes
 TODO: Add interactive elements??
 TODO: Add navigation aids
 TODO: Add ornamental dividers between major sections??
 */
const PlayPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tokens, setTokens] = useState<string[] | null>();
    const params = useParams();
    const document = String(params.document);
    const indices = params.indices
        ? params.indices.split(',').map(num => parseInt(num, 10))
        : [];

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

    const groupTokensByLines = (tokens: string[]): string[][] => {
        const lines: string[][] = [];
        let currentLine: string[] = [];
        const lineBreaks = ["\n"];

        tokens.forEach((token: string) => {
            if (lineBreaks.includes(token)) {
                lines.push(currentLine);
                currentLine = [];
            } else {
                currentLine.push(token);
            }
        });

        if (currentLine.length > 0) {
            lines.push(currentLine);
        }

        return lines;
    };

    const formattedText = tokens ? (
        <div>
            {groupTokensByLines(tokens).map((line: string[], lineIndex: number) => (
                <div key={lineIndex} className="
                    text-center
                    first-letter:mr-3 first-letter:text-9xl
                    first-line:tracking-widest first-line:uppercase first-line:font-bold
                    first-line:text-3xl first-line:font-im-fell
                ">
                    {line.map((token: string, tokenIndex: number) => {
                        const globalIndex: number =
                            tokens.slice(0, lineIndex).length + tokenIndex;

                        if (indices.includes(globalIndex)) {
                            return <strong key={tokenIndex}> {token} </strong>;
                        } else if (token === "") {
                            return <br key={tokenIndex}></br>
                        }

                        return <span key={tokenIndex}> {token} </span>;
                    })}
                </div>
            ))}
        </div>
    ) : null;

    return (
        <>
            {loading && (<p>Loading...</p>)}
            {error && (<p>{error}</p>)}
            {tokens && (
                <div
                    className="flex flex-col items-center justify-center"
                >
                    {tokens.length > 0 && (formattedText)}
                </div>
            )}
        </>
    );
};

export default PlayPage;
