import {IWordDimensions, IDictionaryEntry, IYearFreqElement, IDocumentFreqElement} from "../WordInterfaces.ts";

interface WordStatsProps {
    wordDimensions: IWordDimensions;
    dictionaryEntry: IDictionaryEntry | null;  // Empty response from the 3rd party API should not be a showstopper
}

const WordStatsCard = ({wordDimensions, dictionaryEntry}: WordStatsProps) => {
    const getFirstAppearance
        = (stats: IYearFreqElement[]): number | undefined => {
        if (stats.length === 0) {
            return undefined;
        }

        return Math.min(...stats.map(entry => entry.year));
    };

    const calculateTotalFrequency
        = (stats: IYearFreqElement[]): number | undefined => {
        if (stats.length === 0) {
            return undefined;
        }

        return stats.map(entry => entry.frequency).reduce((x, y) => x + y, 0);
    };

    const getTotalWorksAppearances
        = (stats: IDocumentFreqElement[]): number => {
        return stats.length
    };

    return (
        <div>
            <div className="
                block w-3xl p-5 m-3
                border-1 rounded-lg shadow-lg
            ">
                <p className="
                                p-5
                                first-letter:float-left first-letter:mr-3
                                first-letter:text-7xl first-letter:font-bold
                                first-line:tracking-widest first-line:uppercase first-line:text-3xl
                                font-im-fell
                            "
                >{wordDimensions.word}</p>
                {dictionaryEntry && (
                    <span className="text-2xl">{dictionaryEntry.phonetic}</span>
                )}
                <div className="flex flex-row">
                    <div className="
                        flex flex-col justify-center items-center bg-[#F2EBD3]
                        w-3xs p-1 m-1 border-1 rounded-lg shadow-lg
                    ">
                        <span className="text-[#8B1E3F] font-bold">
                            {getFirstAppearance(wordDimensions.yearFrequencies)}
                        </span>
                        <span>First Appearance</span>
                    </div>
                    <div className="
                        flex flex-col justify-center items-center bg-[#F2EBD3]
                        w-3xs p-1 m-1 border-1 rounded-lg shadow-lg
                    ">
                        <span className="text-[#8B1E3F] font-bold">
                            {calculateTotalFrequency(wordDimensions.yearFrequencies)}
                        </span>
                        <span>Total Occurrences</span>
                    </div>
                    <div className="
                        flex flex-col justify-center items-center bg-[#F2EBD3]
                        w-3xs p-1 m-1 border-1 rounded-lg shadow-lg
                    ">
                        <span>Appeared in</span>
                        <span className="text-[#8B1E3F] font-bold">
                            {getTotalWorksAppearances(wordDimensions.documentFrequencies)}
                        </span>
                        <span>Plays</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordStatsCard;