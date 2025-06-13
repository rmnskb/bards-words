import { IFlatOccurrenceElement } from "../WordInterfaces"; 
import WordContextCard from "./WordContextCard";
import LoadMoreButton from "../components/LoadMoreButton";

interface WorksExamplesProps {
  word: string;
  items: IFlatOccurrenceElement[];
  areAllOptionsDisplayed: boolean;
  handleLoadMore: () => void;
}

const WorksExamples = ({
  word,
  items,
  areAllOptionsDisplayed,
  handleLoadMore,
}: WorksExamplesProps) => {
  return (
    <div>
      <hr className="
        h-1 mx-auto mb-2 border-0 rounded-sm
        bg-quill dark:bg-moonlight
      "/>
      {items.map((flatOccurrence, idx) => (
        <WordContextCard
          key={idx}
          document={flatOccurrence.document}
          index={flatOccurrence.index}
          word={word}
        />
      ))}
      {!areAllOptionsDisplayed && (<LoadMoreButton onClick={handleLoadMore}/>)}
    </div>
  );
};

export default WorksExamples;
