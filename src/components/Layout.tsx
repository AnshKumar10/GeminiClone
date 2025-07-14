import React, { useEffect } from "react";
import { Toaster } from "sonner";
import { useStore } from "../store/useStore";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {children}
      <Toaster
        position="top-right"
        theme={isDarkMode ? "dark" : "light"}
        richColors
      />
    </div>
  );
};

export default Layout;
