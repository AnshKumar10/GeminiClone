import React from "react";
import { useStore } from "../../store/useStore";
import WelcomeScreen from "./WelcomeScreen";
import { Moon, Sun } from "lucide-react";
import ChatInterface from "../chat/ChatInterface";

const MainContent: React.FC = () => {
  const { currentChatroomId, isDarkMode, toggleDarkMode } = useStore();

  return (
    <main className="flex-1 flex flex-col bg-white dark:bg-gray-900 relative">
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {currentChatroomId ? <ChatInterface /> : <WelcomeScreen />}
    </main>
  );
};

export default MainContent;
