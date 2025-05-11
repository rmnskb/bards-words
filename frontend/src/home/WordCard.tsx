import {useEffect, useState} from "react";
import {Link} from "react-router";

import {IWordIndex} from "../WordInterfaces.ts";

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
                block w-full p-5 bg-[#F2EBD3]
                text-l text-[#8B1E3F]
                border-2 border-[#8B1E3F] rounded-lg  shadow-lg
                hover:border-[#D4AF37] hover:outline-[#D4AF37] hover:scale-110
                hover:text-[#D4AF37] hover:bg-[#F0E5C5]
            ">
                <h3
                    className="
                        first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold
                        first-line:tracking-widest first-line:uppercase
                        font-im-fell font-bold
                    "
                >
                    {convertToTitleCase(word.word)}
                </h3>
                <p className="text-[#0D1B2A]">
                    Appears <strong
                    className="text-[#8B1E3F]"
                >{calculateTotalFrequency(word)}</strong> times
                    in <strong
                    className="text-[#8B1E3F]"
                >{getTotalNumOfWorks(word)}</strong> works: {sampledDocuments}...
                </p>
            </div>
        </Link>

    );
};

export default WordCard;
