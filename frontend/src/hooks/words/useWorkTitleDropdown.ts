import { RefObject, useState } from "react";

import useClickedOutside from "../common/useClickedOutside";

interface UseWorkTitleDropdownReturn {
  isDropdownOpen: boolean;
  dropdownRef: RefObject<HTMLDivElement | null>;
  toggleDropdown: () => void;
}


const useWorkTitleDropdown = (): UseWorkTitleDropdownReturn => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useClickedOutside(() => setIsDropdownOpen(false));

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return {
    isDropdownOpen,
    dropdownRef,
    toggleDropdown,
  };
};

export default useWorkTitleDropdown;
