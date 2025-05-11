import {Link} from "react-router";

import {IDocumentTokens} from "../WordInterfaces.ts";
import getShakespeareWorkCode from "../WorksEnum.ts";

interface ContextCardProps {
    highlight: string;
    context: IDocumentTokens;
}

const ContextCard = ({highlight, context}: ContextCardProps) => {
    const searchArray: string[] = highlight.toLowerCase().split(" ");

    const formattedText =
        context.occurrences ? context.occurrences.map((token, index) => {
            if (token === "") {
                return <br key={index}/>;
            } else if (searchArray.includes(token.toLowerCase().replace(/[\W\s]*/g, ""))) {
                return <span key={index} className="text-[#8B1E3F] font-bold"> {token} </span>;
            }

            return <span key={index}> {token} </span>;
        }) : null;

    return (
        <Link to={"/plays/" + getShakespeareWorkCode(context.document)}>
            <div className="
                block p-5 bg-[#F2EBD3]
                text-[#8B1E3F] font-im-fell text-xl
                border-2 border-[#8B1E3F] rounded-lg  shadow-lg
                hover:border-[#D4AF37] hover:outline-[#D4AF37] hover:scale-110
                hover:text-[#D4AF37] hover:bg-[#F0E5C5]
            ">
                <h3
                    className="text-5xl"
                >{context.document}</h3>
                <p className="text-[#0D1B2A]">...{formattedText}...</p>
            </div>
        </Link>
    );
};

export default ContextCard;
