import { useState, useEffect } from "react";

const useDarkMode = () => {
  const [isDark, setIsDark] = useState<boolean>(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class")
          setIsDark(document.documentElement.classList.contains("dark"));
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
