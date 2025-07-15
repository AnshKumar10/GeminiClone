import type { UseFormRegisterReturn } from "react-hook-form";

interface PropsType {
  id: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export const InputField: React.FC<PropsType> = ({
  id,
  type = "text",
  placeholder,
  maxLength,
  className = "",
  register,
  error,
}) => (
  <input
    id={id}
    type={type}
    {...register}
    placeholder={placeholder}
    maxLength={maxLength}
    className={`w-full px-4 py-2.5 text-sm rounded-lg bg-[#2a2a2a] placeholder-gray-400 
      border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 
      ${error ? "border-red-500 focus:ring-red-500" : ""}
      ${className}`}
  />
);
