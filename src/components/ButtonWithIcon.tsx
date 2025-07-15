import { Button } from "./Button";

interface PropsType {
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  ariaLabel: string;
  className?: string;
}

export const IconButton: React.FC<PropsType> = ({
  icon: Icon,
  onClick,
  variant = "ghost",
  size = "md",
  ariaLabel,
  className = "",
}) => {
  const iconSizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      className={className}
      aria-label={ariaLabel}
    >
      <Icon className={iconSizeClass} />
    </Button>
  );
};
