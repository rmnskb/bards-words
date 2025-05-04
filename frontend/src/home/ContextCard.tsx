// import {Link} from "react-router";

import {IDocumentTokens} from "../WordInterfaces.ts";

interface ContextCardProps {
    context: IDocumentTokens;
}

const ContextCard = ({context}: ContextCardProps) => {
    return (
        <div>
            <h3>Shakespeare's work: {context.document}</h3>
            <p><strong>Context:</strong> {context.occurrences.join(' ')}</p>
        </div>
    );
};

export default ContextCard;
