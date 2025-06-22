type SearchBarProps = {
  search: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  placeholder?: string;
  inputSpacing?: string;
  buttonIcon?: string | React.ReactNode;
  buttonSpacing?: string;
};


const SearchBar = ({
  search,
  onInputChange,
  onKeyDown,
  onButtonClick,
  placeholder = "Search...",
  inputSpacing = "p-4 text-xl",
  buttonIcon = "Search",
  buttonSpacing = "absolute end-2.5 bottom-2.5 px-4 py-3"
}: SearchBarProps) => {

  return (
    <form className="w-full">
      <label
        htmlFor={"search"}
        className="text-sm font-medium sr-only"
      ></label>
      <div className="relative">
        <input
          type="search"
          value={search}
          id="search"
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder} required
          autoComplete="off"
          className={`
            block w-full shadow-lg ${inputSpacing}
            text-quill font-im-fell
            border-2 border-vellum
            rounded-lg bg-silk
            focus:border-gold-leaf focus:outline-gold-leaf
            dark:bg-warm-taupe dark:text-moonlight
            dark:border-candlelight
            dark:focus:border-bright-gold dark:focus:outline-bright-gold
            placeholder-ash-gray
          `}
        />
      <button
        type="submit"
        onClick={onButtonClick}
        className={`
          ${buttonSpacing} btn-gold-leaf btn-md
        `}>{buttonIcon}</button>
      </div>
    </form>
  );
};

export default SearchBar;
