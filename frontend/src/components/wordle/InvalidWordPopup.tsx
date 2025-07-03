import { useEffect } from "react";
import useWordle from "../../hooks/wordle/useWordle";


const InvalidWordPopup = () => {
  const { showInvalidWordMessage, setShowInvalidWordMessage } = useWordle();
  const onClose = () => setShowInvalidWordMessage(false);

  useEffect(() => {
    if (showInvalidWordMessage) {
      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [showInvalidWordMessage, onClose]);

  if (!showInvalidWordMessage) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="
        bg-white border-2 border-gray-800 px-4 py-2
        rounded-lg shadow-lg animate-bounce pointer-events-auto
      ">
        <p className="text-gray-800 font-medium text-sm">
          This word has never appeared in Shakespeare's works
        </p>
      </div>
    </div>
  );
};

export default InvalidWordPopup;
