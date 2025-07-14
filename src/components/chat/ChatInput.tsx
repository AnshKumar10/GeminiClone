import React, { useState, useRef } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (message: string, image?: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if ((!message.trim() && !selectedImage) || disabled) return;

    const messageText = message.trim() || "Image shared";
    onSendMessage(messageText, selectedImage || undefined);

    setMessage("");
    setSelectedImage(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please select an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t w-full border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {selectedImage && (
          <div className="mb-4 relative inline-block">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
            />
            <button
              className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => setSelectedImage(null)}
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Gemini"
                className="flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                onKeyDown={handleKeyDown}
                disabled={disabled}
                aria-label="Message input"
              />

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Upload image"
                >
                  <ImageIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                {(message.trim() || selectedImage) && (
                  <button
                    onClick={handleSendMessage}
                    disabled={disabled}
                    className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default ChatInput;
