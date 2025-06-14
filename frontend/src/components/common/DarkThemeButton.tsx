import { FaRegSun, FaRegMoon } from "react-icons/fa6";

import useDarkMode from "../../hooks/common/useDarkMode";


const DarkThemeButton = () => {
  const { isDark, toggleMode } = useDarkMode();

  return (
    <button
      onClick={toggleMode}
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
      {isDark ? <FaRegSun size={20} /> : <FaRegMoon size={20} />}
    </button>
  );
};

export default DarkThemeButton;
