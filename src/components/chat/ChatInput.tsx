import React, { useState, useRef } from "react";
import { Send, Image as ImageIcon } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string, image?: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() && !imagePreview) return;

    onSendMessage(message.trim(), imagePreview || undefined);
    setMessage("");
    setImagePreview(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 bg-white dark:bg-[#1e1e1e]">
      {imagePreview && (
        <div className="mb-2 relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-xs rounded-lg border border-gray-300 dark:border-gray-700"
          />
          <button
            onClick={() => setImagePreview(null)}
            className="absolute top-1 right-1 text-xs text-white bg-red-500 hover:bg-red-600 px-1 rounded"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-end space-x-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300"
          title="Upload image"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          disabled={disabled}
          className="flex-1 resize-none border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSend}
          disabled={disabled}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
