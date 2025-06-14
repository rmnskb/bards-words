import { useState, useEffect } from "react";

interface UseDarkModeReturn {
  isDark: boolean;
  toggleMode: () => void;
}


const useDarkMode = (): UseDarkModeReturn => {
  const defaultState = localStorage.getItem("theme") || "light";
  const [isDark, setIsDark] = useState<boolean>(defaultState === "dark");

  const toggleMode = () => setIsDark(!isDark);

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return {
    isDark,
    toggleMode
  };
};

export default useDarkMode;
