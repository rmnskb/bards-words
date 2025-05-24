import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

import { ICollocationsStats } from "../WordInterfaces.ts";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import { apiUrl } from "../Constants.ts";

interface WordRelationshipsCardProps {
    word: string;
}

const WordRelationshipsCard = ({word}: WordRelationshipsCardProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [collocationsStats, setCollocationsStats] = useState<ICollocationsStats | null>(null);

  const fetchCollocationsStats = async (word: string): Promise<ICollocationsStats | null> => {
    try {
      const response: AxiosResponse<ICollocationsStats> = await axios.get(`${apiUrl}/collocations?search=${word}`);
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
    <div className="  
      block w-3xl p-5 m-3 border-1 rounded-lg shadow-lg
    ">
      <p className="text-3xl font-bold font-im-fell">Word Relationships</p>
      {loading && (<LoadingSpinner/>)}
      {error && (<p>{error}</p>)}
      {collocationsStats && (  
        <ul>
          {collocationsStats.collocationsStats
            .sort((a, b) => b.frequency - a.frequency)
            .map((item, index) => (
              <li key={index}>{item.other}, Frequency: {item.frequency}</li>
            ))
          }
        </ul>
      )}
    </div>
  );
};

export default WordRelationshipsCard;
