import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FaRegSun, FaRegMoon } from "react-icons/fa6";
import { SlMagnifier } from "react-icons/sl";

import SearchBar from "./SearchBar";
import Portrait from "./Portrait";
import AutoSuggestionsDropdown from "./AutoSuggestionsDropdown";
import useSearchSuggestions from "../hooks/useSearchSuggestions";
import useSearchKeyboardNavigation from "../hooks/useSearchKeyboardNavigation";
import useClickedOutside from "../hooks/useClickedOutside";


const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const navigate = useNavigate();

  const suggestions = useSearchSuggestions({ search, setShowSuggestions, });

  const handleKeyDown = useSearchKeyboardNavigation({ 
    items: suggestions, 
    onSelect: setSearch,
    onSearchSubmit: () => navigate(`/?search=${encodeURIComponent(search)}`),
    showSuggestions: showSuggestions,
    setShowSuggestions: setShowSuggestions,
    selectedIndex: selectedIndex,
    setSelectedIndex: setSelectedIndex,
  });

  const searchRef = useClickedOutside(() => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
  });


  const handleButtonClick =
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      if (search) navigate(`/?search=${encodeURIComponent(search)}`);
    };

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);
  
// TODO: Style the portrait properly
  return (
    <header className="
      w-full shadow-lg 
      border-b border-quill bg-ink
      dark:bg-cafe-au-lait dark:border-warm-taupe
    ">
      <div className="
        flex flex-row items-center justify-center
        py-6 px-4 max-w-7xl mx-auto
      ">
        <Portrait
          className="w-12 h-16 mr-2 rounded-full border-2 object-cover transition-all duration-300"
        />
        <div className="flex items-center space-x-3">
          <Link
            to="/?search="
            className="flex items-center space-x-3 hover:opacity transition-opacity"
          >
            <span className="
              text-deep-wine font-semibold text-5xl font-imperial
              dark:text-crimson
            ">Words Bard</span>
          </Link>
        </div>

        <div className="relative flex max-w-md mx-8 w-full px-4" ref={searchRef}>
          <SearchBar
            search={search}
            onInputChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onButtonClick={handleButtonClick}
            inputSpacing="py-3 pl-4 pr-14 text-md"
            buttonIcon={<SlMagnifier />}
            buttonSpacing="absolute right-2.5 top-3 -translate-y-1/12 px-3 py-2"
          />
          <AutoSuggestionsDropdown
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            selectedIndex={selectedIndex}
            onSuggestionClick={(suggestion: string) => setSearch(suggestion)}
            onMouseEnter={(index: number) => setSelectedIndex(index)}
            contentSpacing="absolute top-full left-0 right-0 z-50 mt-2"
          />
        </div>

        <button
          onClick={() => {setIsDarkMode(!isDarkMode)}}
          className="
            p-2 rounded-lg transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-gold-leaf
            bg-aged-leather hover:bg-warm-taupe
            text-vellum hover:text-soft-gold
            dark:bg-parchment dark:hover:bg-ink
            dark:text-quill dark:hover:text-bright-gold
          "
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <FaRegSun size={20} /> : <FaRegMoon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
