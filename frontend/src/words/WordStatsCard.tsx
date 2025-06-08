import {
  IWordDimensions,
  IDictionaryEntry,
  IYearFreqElement,
  IDocumentFreqElement
} from "../WordInterfaces.ts";

interface WordStatsProps {
  wordDimensions: IWordDimensions;
  // Empty response from the 3rd party API should not be a showstopper
  dictionaryEntry: IDictionaryEntry | null;
}

interface IWordListProps {
  label: string;
  words: string[];
}

interface IDictionaryDisplayProps {
  dictionaryEntry: IDictionaryEntry | null | undefined;
}

interface IStatsDisplayProps {
  stats?: number;
  statsType?: "firstAppearance" | "totalOccurrences" | "appearedIn";
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
        {firstMeaning.synonyms?.[0] && (
          <WordList label="Synonyms" words={firstMeaning.synonyms} />
        )}
        {firstMeaning.antonyms?.[0] && (
          <WordList label="Antonyms" words={firstMeaning.antonyms} />
        )}
      </div>
    );
  };

  const StatsDisplay = ({
    stats,
    statsType,
  }: IStatsDisplayProps) => {
    let content = null;
    const boldStyle = "text-royal-wine font-bold dark:text-crimson"

    if (!stats || !statsType) return null;

    switch (statsType) {
      case "firstAppearance": {
        content = (
          <>
            <span className={boldStyle}>
                {stats}
            </span>
            <span>First Appearance</span>
          </>
        );
        break;
      }
      case "totalOccurrences": {
        content = (
          <>
            <span className={boldStyle}>
                {stats}
            </span>
            <span>Total Occurrences</span>
          </>
        );
        break;
      }
      case "appearedIn": {
        content = (
          <>
            <span>Appeared in</span>
            <span className={boldStyle}>
                {stats}
            </span>
            <span>Plays</span>
          </>
        );
        break;
      }
      default: {
        content = null;
        break;
      }
    }

    return (
      <div className="
        flex flex-col justify-center items-center 
        w-3xs p-1 m-1 border-1 rounded-lg shadow-lg
        bg-vellum border-quill
        dark:bg-aged-leather dark:border-candlelight
      ">{content}</div>
    );
  };

  const statsCardsContent: IStatsDisplayProps[] = [
    {
      statsType: "firstAppearance",
      stats: getFirstAppearance(wordDimensions.yearFrequencies),
    },
    {
      statsType: "totalOccurrences",
      stats: calculateTotalFrequency(wordDimensions.yearFrequencies)
    },
    {
      statsType: "appearedIn",
      stats: getTotalWorksAppearances(wordDimensions.documentFrequencies)
    },
  ]

  return (
    <div>
      <div className="
        block w-3xl p-5 m-3
        border-1 rounded-lg shadow-lg
      ">
        <p className="
          first-letter:float-left first-letter:mr-3
          first-letter:text-7xl first-letter:font-bold
          first-line:tracking-widest first-line:text-5xl
          font-im-fell p-5
        ">{wordTitle}</p>
        {dictionaryEntry && (
            <span className="text-2xl">{dictionaryEntry.phonetic}</span>
        )}
        <div className="flex flex-row">
          {statsCardsContent.map((statsProps, index) => (
            <StatsDisplay
              key={index}
              {...statsProps}
            />
          ))}
        </div>
        <DictionaryDisplay dictionaryEntry={dictionaryEntry}/>
      </div>
    </div>
  );
};

export default WordStatsCard;
