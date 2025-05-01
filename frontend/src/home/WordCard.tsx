import {Link} from "react-router";

import IWordIndex from "../WordIndex.ts";

interface WordCardProps {
    word: IWordIndex;
}

const WordCard = ({word}: WordCardProps) => {
    return (
        <div>
            <Link to={"/words/" + word.word}>
                <h3>{word.word}</h3>
            </Link>
            <h4>Occurrences: </h4>

            <ul>
                {word.occurrences.map((occurrence, idx) => (
                    <li key={idx}>
                        <p><strong>Document:</strong> {occurrence.document}</p>
                        <p><strong>Frequency:</strong> {occurrence.frequency}</p>
                        {/*<p>Indices: {occurrence.indices.join(', ')}</p>*/}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WordCard;
