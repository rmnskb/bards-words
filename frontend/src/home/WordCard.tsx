import { useEffect, useState } from "react";
import { Link } from "react-router";

import { IWordIndex } from "../WordInterfaces.ts";

interface WordCardProps {
  word: IWordIndex;
}

const WordCard = ({word}: WordCardProps) => {
  const [sampledDocuments, setSampledDocuments] = useState<string>('');

  const calculateTotalFrequency = (invertedIdx: IWordIndex): number => {
    // MapReduce in TS huh
    return invertedIdx.occurrences
      .map(entry => entry.frequency)
      .reduce((a, b) => a + b, 0);
  };

  const getTotalNumOfWorks = (invertedIdx: IWordIndex): number => {
    return invertedIdx.occurrences.length
  };

  const sampleDocuments = (invertedIdx: IWordIndex, n: number): string[] => {
    const documents: string[] = [...invertedIdx.occurrences.map(entry => entry.document)];
    const shuffled = Array.from(documents).sort(() => 0.5 - Math.random());

    return shuffled.slice(0, n);
  };

  const convertToTitleCase = (word: string): string => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  useEffect(() => {
    setSampledDocuments(sampleDocuments(word, 3).join("; "));
  }, [word])

  return (
    <Link to={"/words/" + word.word}>
      <div className="
        group block w-full p-5 bg-vellum
        text-l text-deep-wine
        border-2 border-royal-wine rounded-lg shadow-lg
        hover:border-gold-leaf hover:outline-gold-leaf hover:scale-110
        hover:text-gold-leaf hover:bg-vellum
        dark:text-crimson dark:border-crimson
        dark:hover:bg-cafe-au-lait
        dark:hover:border-bright-gold dark:outline-bright-gold 
        dark:hover:text-bright-gold dark:bg-warm-taupe
      ">
        <h3 className="
          first-letter:float-left first-letter:mr-3 
          first-letter:text-7xl first-letter:font-bold
          first-line:tracking-widest first-line:uppercase
          font-im-fell font-bold
        ">{convertToTitleCase(word.word)}</h3>
        <p className="text-quill dark:text-moonlight">
          Appears <strong className="text-crimson group-hover:text-bright-gold"
        >{calculateTotalFrequency(word)}</strong> times
          in <strong
          className="text-crimson group-hover:text-bright-gold"
        >{getTotalNumOfWorks(word)}</strong> works: {sampledDocuments}...
        </p>
      </div>
    </Link>
  );
};

export default WordCard;
