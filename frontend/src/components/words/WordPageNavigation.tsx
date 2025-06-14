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
    <div className="
      sticky top-3 self-start z-50
      p-3 m-3 w-sm bg-vellum 
      border border-quill rounded-xl shadow-lg
      dark:bg-warm-taupe dark:border-silk
    ">
      <ul className="space-y-1">
        {navigationData?.map((item, index) => (
          <li key={index} className="w-full">
            <Link
              key={index}
              to={{
                pathname: `/words/${word}`,
                hash: `#${item.id}`,
              }}
              className="block w-full"
            >
              <button className="
                px-3 py-1 m-1 w-full 
                text-left text-md bg-silk
                border border-quill rounded-lg shadow-md
                transition-all duration-300 ease-in-out
                active:scale-[0.98] active:translate-x-0
                hover:bg-warm-taupe hover:text-candlelight
                hover:border-warm-taupe hover:shadow-lg
                hover:scale-[1.02] hover:-translate-x-1/2
                focus:outline-none focus:ring-warm-taupe
                focus:ring-2 focus:bg-warm-taupe focus:text-candlelight
                focus:border-warm-taupe
                dark:bg-cafe-au-lait dark:border-silk
                dark:hover:bg-moonlight dark:hover:text-quill
                dark:hover:border-moonlight dark:focus:ring-moonlight
                dark:focus:bg-moonlight dark:focus:text-quill
                dark:focus:border-moonlight
              ">{item.title}</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordPageNavigation;
