import {Link} from "react-router";

import {IWordIndex} from "../WordInterfaces.ts";

interface WordCardProps {
    word: IWordIndex;
}

const WordCard = ({word}: WordCardProps) => {
    const occurrences: string
        = [...word.occurrences.map(entry => entry.document)].join('; ');

    return (
        <div>
            <Link to={"/words/" + word.word}>
                <h3>{word.word}</h3>
            </Link>
            <h4>Occurrences:</h4>
            <p>{occurrences}</p>
        </div>
    );
};

export default WordCard;
