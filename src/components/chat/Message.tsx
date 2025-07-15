import React, { useState } from "react";
import { Copy, Check, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

interface MessageProps {
  message: {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    image?: string;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Message copied to clipboard");
    } catch {
      toast.error("Failed to copy message");
    }
  };

  return (
    <div className="flex items-start space-x-4 mb-8 group max-w-none">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center">
        {message.isUser ? (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {message.isUser ? "You" : "Gemini"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="relative">
          {message.image && (
            <img
              src={message.image}
              alt="User upload"
              className="max-w-sm h-auto rounded-lg mb-3 border border-gray-200 dark:border-gray-700"
            />
          )}

          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100">
              {message.text}
            </p>
          </div>

          {!message.isUser && (
            <button
              className="absolute -right-2 top-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleCopy}
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
