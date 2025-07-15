import { X } from "lucide-react";
import { IconButton } from "../ButtonWithIcon";

interface PropsType {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<PropsType> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <IconButton
              icon={X}
              onClick={onClose}
              size="sm"
              ariaLabel="Close modal"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            />
          </div>
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
