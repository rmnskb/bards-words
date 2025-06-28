import { useRef, useEffect } from "react";

interface ModalPopupProps {
  isOpen: boolean;
  hasCloseBtn?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}


const ModalPopup = ({
  isOpen,
  hasCloseBtn = false,
  onClose = () => {},
  children,
}: ModalPopupProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleCloseModal = () => onClose();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") handleCloseModal();
  };

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    if (isOpen) modalElement.showModal();
    else modalElement.close();
  }, [isOpen]);

  return (
    <dialog
      ref={modalRef}
      onKeyDown={handleKeyDown}
      className="
        rounded-lg border-0 shadow-xl
      "
    >
      {hasCloseBtn && (
        <button className="float-right" onClick={handleCloseModal}>
          x
        </button>
      )}
      {children}
    </dialog>
  );
};

export default ModalPopup;
