import clsx from "clsx";

export const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  ariaLabel?: string;
}> = ({
  value,
  onChange,
  placeholder,
  className = "",
  ariaLabel = "Search chatrooms",
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={clsx(
          "w-full px-4 py-2.5 rounded-lg text-sm",
          "bg-white text-gray-900 placeholder-gray-400",
          "dark:bg-[#2a2a2a] dark:text-white dark:placeholder-gray-400",
          "border border-gray-300 dark:border-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          "transition-all duration-200",
          className
        )}
      />
    </div>
  );
};
