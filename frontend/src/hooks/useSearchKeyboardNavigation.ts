import { useCallback, Dispatch, SetStateAction } from "react";

interface UseSearchKeyboardNavigationProps {
  items: any[];
  onSelect: (item: any) => void;
  onSearchSubmit: () => void;
  showSuggestions: boolean;
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
}


const useSearchKeyboardNavigation = ({
  items,
  onSelect,
  onSearchSubmit,
  showSuggestions,
  setShowSuggestions,
  selectedIndex,
  setSelectedIndex,
}: UseSearchKeyboardNavigationProps) => {

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => { 
    if (!showSuggestions) {
      if (e.key === "Enter") {
        e.preventDefault();
        onSearchSubmit();
        return;
      }
    }

    // TODO: Fix the navigation with arrow keys for the light theme??
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;

      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) onSelect(items[selectedIndex]);
        else setShowSuggestions(false);
        break;

      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;

      case "Tab":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  },
    [
      items, selectedIndex, onSelect, onSearchSubmit, 
      showSuggestions, setShowSuggestions,
      selectedIndex, setSelectedIndex,
    ]);

  return handleKeyDown;
};

export default useSearchKeyboardNavigation;
