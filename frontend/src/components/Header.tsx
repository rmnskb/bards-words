import { useState, useEffect } from "react";
import { Link } from "react-router";
import { FaRegSun, FaRegMoon } from "react-icons/fa6";

import HeaderSearchBar from "./HeaderSearchBar";
import Portrait from "./Portrait";

// TODO: Style the portrait properly
const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

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

        <div className="flex-1 max-w-md mx-8">
          <HeaderSearchBar />
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
