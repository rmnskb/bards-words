import { useState } from "react";
import { useNavigate } from "react-router";
import { SlMagnifier } from "react-icons/sl";


const HeaderSearchBar = () => {
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();

  const handleKeyDown =
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      switch (event.key) {
        case "Enter": {
          event.preventDefault();
          if (search) navigate(`/?search=${encodeURIComponent(search)}`);
          break;
        }
        case "Escape": {
          event.preventDefault()
          setSearch("");
          break;
        }
        default:
          break;
      }
    };

  const handleButtonClick =
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      if (search) navigate(`/?search=${encodeURIComponent(search)}`);
    };

  return (
    <div className="w-full max-w-md px-4">
      <form className="w-full">
       <label
         htmlFor={"search"}
         className="text-sm font-medium text-gray-900 sr-only"
       ></label>
       <div className="relative">
         <input
           type="search"
           value={search}
           id="search"
           onChange={(e) => setSearch(e.target.value)}
           onKeyDown={handleKeyDown}
           placeholder={"Search words, phrases..."} required
           className="
            block w-full py-3 pl-4 pr-14 text-md shadow-lg
            text-quill font-im-fell
            border-2 border-vellum
            rounded-lg bg-silk
            focus:border-gold-leaf focus:outline-gold-leaf
            dark:bg-warm-taupe dark:text-moonlight
            dark:border-candlelight
            dark:focus:border-bright-gold dark:focus:outline-bright-gold
           "
          />
        <button
          type="submit"
          onClick={handleButtonClick}
          className="
            absolute right-2.5 top-3 -translate-y-1/12
            bg-gold-leaf hover:bg-soft-gold
            focus:ring-1 focus:outline-none focus:ring-soft-gold
            font-medium rounded-lg text-md px-3 py-2 shadow-sm
            text-silk dark:text-quill
            dark:hover:bg-bright-gold dark:focus:ring-bright-gold
          "><SlMagnifier /></button>
       </div>
     </form>
    </div>
  );
};

export default HeaderSearchBar;
