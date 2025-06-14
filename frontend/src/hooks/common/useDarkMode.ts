import { useState, useEffect } from "react";

type ThemeType = "dark" | "light";

const useDarkMode = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const defaultTheme = localStorage.getItem("theme") as ThemeType;

    return defaultTheme === "dark" || document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const localTheme = localStorage.getItem("theme") as ThemeType;

          setIsDark(localTheme === "dark" || document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
};

export default useDarkMode;
