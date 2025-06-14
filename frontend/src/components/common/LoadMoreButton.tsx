interface LoadMoreButtonProps {
  onClick: () => void;
}

const LoadMoreButton = ({ 
  onClick
}: LoadMoreButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        focus:ring-1 focus:outline-none
        font-medium rounded-lg text-sm px-4 py-3
        shadow-sm text-silk dark:text-quill
        bg-gold-leaf hover:bg-soft-gold
        dark:hover:bg-bright-gold dark:focus:ring-bright-gold
      "
    >Load more...</button>
  );
};

export default LoadMoreButton;
