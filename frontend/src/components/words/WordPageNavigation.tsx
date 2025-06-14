import { Link } from "react-router";

import { INavigationData } from "../../types";

interface WordPageNavigationProps {
  word: string;
  navigationData: INavigationData[];
}


const WordPageNavigation = ({
  word,
  navigationData,
}: WordPageNavigationProps) => {

  return (
    <div>
      <ul>
        {navigationData && navigationData.map((item, index) => (
          <Link
            key={index}
            to={{
              pathname: `/words/${word}`,
              hash: `#${item.id}`,
            }}
          >
            <p>{item.title}</p>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default WordPageNavigation;
