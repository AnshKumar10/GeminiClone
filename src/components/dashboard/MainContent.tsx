import React from "react";
import { useStore } from "../../store/useStore";
import { Moon, Sun } from "lucide-react";
import ChatInterface from "../chat/ChatInterface";
import WelcomeScreen from "./WelcomeScreen";

const MainContent: React.FC = () => {
  const { currentChatroomId, isDarkMode, toggleDarkMode } = useStore();

  return (
    <main className="flex flex-col h-screen w-full dark:bg-[#1e1e1e] text-white relative">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-10 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-white" />
        )}
      </button>

      {currentChatroomId ? <ChatInterface /> : <WelcomeScreen />}
    </main>
  );
};

export default MainContent;
