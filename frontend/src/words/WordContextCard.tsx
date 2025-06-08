import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router";

import { IDocumentTokens } from "../WordInterfaces.ts";
import getShakespeareWorkCode from "../WorksEnum.ts";
import { apiUrl } from "../Constants.ts";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

interface WordContextCardProps {
  document: string;
  index: number;
  word: string;
}

const WordContextCard
  = ({ document, index, word }: WordContextCardProps) => {
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
        return <p key={index} className="h-1"></p>;
      } else if (token.toLowerCase().replace(/[\W\s]*/g, "") === highlight) {
        return <span key={index} className="text-royal-wine dark:text-crimson font-bold"> {token} </span>;
      }

      return <span key={index}> {token} </span>;
    }) : null;
  };

  useEffect(() => {
    fetchTokens(document, index)
      .then((response) => {
        if (response) setTokens(response.occurrences);
        setLoading(false);
      })
      .catch((e: string) => {
        setError(e);
        setLoading(false);
      })
  }, [document, index]);

  return (
    <div>
      {loading && (<LoadingSpinner />)}
      {error && (<p>{error}</p>)}
      {tokens && (
        <div className="
          block p-5 w-full
        ">
          <div className="mb-2">...{formatText(tokens, word)}...</div>
          <Link to={"/plays/" + getShakespeareWorkCode(document)}>
            <span className="
              text-xl font-im-fell
              p-1 rounded-md
              text-silk dark:text-quill
              bg-gold-leaf hover:bg-soft-gold
              dark:hover:bg-bright-gold dark:focus:ring-bright-gold
            ">{document}</span>
          </Link>
          <hr className="
            border-t-2 border-dashed mt-3
            border-quill dark:border-moonlight
          "/>
        </div>
      )}
    </div>
  );
};

export default WordContextCard;
