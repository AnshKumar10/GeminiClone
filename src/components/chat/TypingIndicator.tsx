import React from "react";
import { Sparkles } from "lucide-react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-4 mb-8">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Gemini
          </span>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-200" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
