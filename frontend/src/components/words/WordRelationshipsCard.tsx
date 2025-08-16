import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

import { API_URL } from "../../constants";
import { ICollocationsStats, INavigationData } from "../../types";
import LoadingSpinner from "../common/LoadingSpinner.tsx";
import CollocationsGraph from "../graphs/CollocationsGraph.tsx";

interface WordRelationshipsCardProps extends INavigationData {
  word: string;
}

const WordRelationshipsCard = ({
  id = "relationships",
  title = "Word Relationships",
  word,
}: WordRelationshipsCardProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [collocationsStats, setCollocationsStats] = useState<ICollocationsStats | null>(null);

  const fetchCollocationsStats = async (word: string): Promise<ICollocationsStats | null> => {
    try {
      const response: AxiosResponse<ICollocationsStats> =
        await axios.get(`${API_URL}/stats/collocations?search=${word}`);
      return response.data;
    } catch (errorMsg) {
      console.error('Error fetching the collocations', errorMsg)
      return null;
    }
  };

  useEffect(() => {
    setLoading(true);

    fetchCollocationsStats(word)
      .then((response) => {
        setCollocationsStats(response);
        setLoading(false);
      })
      .catch((e: string) => {
        setError(e);
        setLoading(false);
      });
  }, [word]);

  return (
    <div
      id={id}
      className="block w-3xl p-5 m-3 border-1 rounded-lg shadow-lg"
    >
      <p className="text-3xl font-bold font-im-fell">{title}</p>
      {loading && (<LoadingSpinner />)}
      {error && (<p>{error}</p>)}
      {collocationsStats && (
        <div className="
          p-3 rounded-lg border-1 shadow-lg w-full h-[350px]
          bg-vellum dark:bg-aged-leather
        ">
          <CollocationsGraph stats={collocationsStats}/>
        </div>
      )}
    </div>
  );
};

export default WordRelationshipsCard;
