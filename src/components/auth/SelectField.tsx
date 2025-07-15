import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  id: string;
  register: UseFormRegisterReturn;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const SelectField: React.FC<Props> = ({
  id,
  register,
  error,
  children,
  className = "",
}) => {
  return (
    <select
      id={id}
      {...register}
      className={`
        w-full px-4 py-2.5 rounded-lg text-sm border appearance-none transition-all duration-200 focus:outline-none focus:ring-2
        ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "bg-slate-50 text-gray-900 border-slate-300 focus:ring-blue-500 dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:focus:ring-blue-500"
        }
        ${className}
      `}
    >
      {children}
    </select>
  );
};
