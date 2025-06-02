import {IWordDimensions, IDictionaryEntry, IYearFreqElement, IDocumentFreqElement} from "../WordInterfaces.ts";

interface WordStatsProps {
    wordDimensions: IWordDimensions;
    dictionaryEntry: IDictionaryEntry | null;  // Empty response from the 3rd party API should not be a showstopper
}

interface IWordListProps {      
  label: string;
  words: string[];
}

interface IDictionaryDisplayProps {
  dictionaryEntry: IDictionaryEntry | null | undefined;
}

const WordStatsCard = ({ wordDimensions, dictionaryEntry }: WordStatsProps) => {
    const wordTitle = wordDimensions.word.replace(
      wordDimensions.word, (word => word[0].toUpperCase() + word.substring(1).toLowerCase())
    );

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

    // A list of either synonyms or antonyms
    const WordList = ({ label, words }: IWordListProps) => (
      <div>
        <span className="font-bold">{label}: </span>
        <span>{words.join(", ")}</span>
      </div>
    ); 

    const DictionaryDisplay = ({ dictionaryEntry }: IDictionaryDisplayProps) => {
      const firstMeaning = dictionaryEntry?.meanings?.[0];
 
      if (!firstMeaning) return null;

      return (
        <div className="p-1 mt-3 text-lg">
          {firstMeaning.definitions?.[0] && (
            <p className="text-xl">{firstMeaning.definitions[0].definition}</p>
          )}
          {firstMeaning.synonyms && (
            <WordList label="Synonyms" words={firstMeaning.synonyms} />
          )}
          {firstMeaning.antonyms && (
            <WordList label="Antonyms" words={firstMeaning.antonyms} />
          )}
        </div>
      );
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
                  first-line:tracking-widest first-line:text-5xl
                  font-im-fell
                ">{wordTitle}</p>
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
                <DictionaryDisplay dictionaryEntry={dictionaryEntry}/>
            </div>
        </div>
    );
};

export default WordStatsCard;
