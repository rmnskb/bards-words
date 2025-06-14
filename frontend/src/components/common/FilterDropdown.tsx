import { FaChevronDown } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

import useWorkTitleDropdown from "../../hooks/words/useWorkTitleDropdown";
import { TShakespeareWorkTitle } from "../../constants";

interface FilterDropdownProps {
  availableOptions: TShakespeareWorkTitle[],
  selectedOptions: TShakespeareWorkTitle[],
  handleOptionClick: (title: TShakespeareWorkTitle) => void,
}


const FilterDropdown = ({
  availableOptions,
  selectedOptions,
  handleOptionClick,
}: FilterDropdownProps) => {
  const {
    isDropdownOpen,
    dropdownRef,
    toggleDropdown,
  } = useWorkTitleDropdown();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="
          focus:ring-1 focus:outline-none focus:ring-soft-gold
          font-medium rounded-lg text-sm px-4 py-3
          shadow-sm text-silk dark:text-quill
          bg-gold-leaf hover:bg-soft-gold
          dark:hover:bg-bright-gold dark:focus:ring-bright-gold
          flex items-center gap-2
        "
        onClick={toggleDropdown}
      >
        <span>
          {selectedOptions.length === 0
              ? 'Select plays'
              : `${selectedOptions.length} play(s) selected`}
        </span>
        <FaChevronDown
          size="16"
          className={`
            transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : "rotate-0"
            }
          `}
        />
      </button>
      {isDropdownOpen && (
        <div className="
          absolute right-0 z-10 w-xs mt-1 rounded-md shadow-lg border 
          bg-vellum border-quill
          dark:bg-warm-taupe dark:border-candlelight
        ">
          <ul className="py-1 overflow-auto text-base max-h-100">
            {availableOptions.sort().map((title, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(title)}
                className="
                  flex items-center px-3 py-2 cursor-pointer 
                  hover:bg-gold-leaf dark:hover:bg-soft-gold
                "
              >
                <div className="flex items-center">
                  <div className={`
                    w-4 h-4 border rounded flex items-center justify-center mr-2 
                    ${
                      selectedOptions.some(item => item === title)
                        ? 'bg-royal-wine border-royal-wine dark:bg-crimson dark:border-crimson'
                        : 'border-quill dark:border-candlelight'
                    }`
                  }>
                    {selectedOptions.some(item => item === title) 
                      ? <FaCheck />
                      : <></>
                    }
                  </div>
                  <span className="text-sm">{title}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
