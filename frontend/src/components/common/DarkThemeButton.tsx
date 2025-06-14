import { useEffect, useState } from "react";
import { FaRegSun, FaRegMoon } from "react-icons/fa6";


interface DarkThemeButtonProps {
  className?: string;
}


const DarkThemeButton = ({
  className = "",
}: DarkThemeButtonProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", theme);

    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={className}
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? <FaRegSun size={20} /> : <FaRegMoon size={20} />}
    </button>
  );
};

export default DarkThemeButton;
