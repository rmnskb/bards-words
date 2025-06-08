import { useState, useEffect } from "react";
import { Link } from "react-router";
import { FaRegSun, FaRegMoon } from "react-icons/fa6";

import HeaderSearchBar from "./HeaderSearchBar";
import portrait from "../images/portrait.png"

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <header className="
      w-full bg-[#3E2723] shadow-lg 
      border-b border-[#2C1810]
    ">
      <div className="
        flex flex-row items-center justify-center
        py-6 px-4 max-w-7xl mx-auto
      ">
        <div className="flex items-center space-x-3">
          <Link 
            to="/?search="
            className="flex items-center space-x-3 hover:opacity transition-opacity"
          >
            <img
              src={portrait}
              alt="logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-[#F5F0E1] font-semibold text-xl font-im-fell">
              BardScope
            </span>
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <HeaderSearchBar/>
        </div>

        <button
          onClick={() => {setIsDarkMode(!isDarkMode)}}
          className="
            p-2 rounded-lg bg-[#2C1810] hover:bg-[#1A0F08]
            text-[#F5F0E1] hover:text-[#D4AF37]
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
          "
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <FaRegMoon size={20} /> : <FaRegSun size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
