import { useEffect, useRef } from "react";


type AutoSuggestionsDropdownProps = {
  suggestions: string[];
  showSuggestions: boolean;
  selectedIndex: number;
  onSuggestionClick: (suggestion: string) => void;
  onMouseEnter: (index: number) => void;
  contentSpacing?: string;
};


const AutoSuggestionsDropdown = ({
  suggestions,
  showSuggestions,
  selectedIndex,
  onSuggestionClick,
  onMouseEnter,
  contentSpacing = ""
}: AutoSuggestionsDropdownProps) => {
  const suggestionsRef = useRef<HTMLUListElement>(null);

  // Handle scrolling the selected element into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({
        block: "nearest",
        inline: "start",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  return (
    <div>
      {showSuggestions && suggestions.length > 0 && (
        <div className={`
          border border-ink dark:border-moonlight
          rounded-xl shadow-lg max-h-80 overflow-y-auto
          bg-vellum dark:bg-cafe-au-lait
          ${contentSpacing}
        `}>
          <ul ref={suggestionsRef} className="py-2">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => onSuggestionClick(suggestion)}
                  onMouseEnter={() => onMouseEnter(index)}
                  className={`
                    w-full text-left px-4 py-3 
                    transition-colors duration-150
                    flex items-center space-x-3
                    bg-vellum hover:bg-cafe-au-lait
                    text-quill hover:text-candlelight
                    dark:bg-cafe-au-lait dark:hover:bg-vellum
                    dark:text-candlelight dark:hover:text-quill
                    ${index === selectedIndex
                      ? "bg-cafe-au-lait text-candlelight dark:bg-vellum dark:text-quill"
                      : ""
                    }
                  `}
                >
                  <span className="truncate">{suggestion}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutoSuggestionsDropdown;
