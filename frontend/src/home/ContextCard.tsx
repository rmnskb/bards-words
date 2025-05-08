import {Link} from "react-router";

import {IDocumentTokens} from "../WordInterfaces.ts";
import getShakespeareWorkCode from "../WorksEnum.ts";

interface ContextCardProps {
    context: IDocumentTokens;
}

const ContextCard = ({context}: ContextCardProps) => {
    return (
        <div>
            <Link to={"/plays/" + getShakespeareWorkCode(context.document)}>
                <h3>Shakespeare's work: {context.document}</h3>
            </Link>
            <p><strong>Context:</strong> {context.occurrences.join(' ')}</p>
        </div>
    );
};

export default ContextCard;
