import React, { useRef, useEffect, useCallback, useState } from "react";
import { Sparkles } from "lucide-react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import { useStore } from "../../store/useStore";

const ChatInterface: React.FC = () => {
  const { chatrooms, currentChatroomId, addMessage, isTyping, setTyping } =
    useStore();

  const [lastResponseTime, setLastResponseTime] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChatroom = chatrooms.find(
    (room) => room.id === currentChatroomId
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();

    const messages = currentChatroom?.messages;
    if (!messages || messages.length === 0) return;

    if (messages.length === 1 && messages[0].isUser) {
      generateAIResponse(messages[0].text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatroom?.messages]);

  const generateAIResponse = useCallback(
    async (userMessage: string) => {
      if (!currentChatroomId) return;

      const now = Date.now();
      const timeSinceLastResponse = now - lastResponseTime;
      const minDelay = 2000;
      const responseDelay =
        1500 +
        Math.max(0, minDelay - timeSinceLastResponse) +
        Math.random() * 2000;

      setTyping(true);
      await new Promise((res) => setTimeout(res, responseDelay));

      let aiResponse =
        "I understand your message. How can I assist you further?";

      const lower = userMessage.toLowerCase();
      if (lower.includes("hello") || lower.includes("hi")) {
        aiResponse =
          "Hello! I'm Gemini, your AI assistant. How can I help you today?";
      } else if (lower.includes("weather")) {
        aiResponse =
          "I can tell you about the weather in general, but I don't have real-time data in this demo.";
      } else if (lower.includes("help")) {
        aiResponse =
          "I'm here to help! You can ask questions, chat casually, or share images.";
      } else if (lower.includes("image") || lower.includes("picture")) {
        aiResponse =
          "Thanks for the image! I can view it, but can't fully analyze it in this demo.";
      }

      addMessage(currentChatroomId, {
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      });

      setTyping(false);
      setLastResponseTime(Date.now());
    },
    [currentChatroomId, lastResponseTime, addMessage, setTyping]
  );

  const handleSendMessage = async (messageText: string, image?: string) => {
    if (!currentChatroomId) return;

    addMessage(currentChatroomId, {
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      image,
    });

    await generateAIResponse(messageText);
  };

  if (!currentChatroom) return null;

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#1e1e1e]">
      {/* ───────────── Chat Header ───────────── */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <h1 className="font-medium text-lg truncate text-gray-900 dark:text-gray-100">
          {currentChatroom.title}
        </h1>
      </div>

      {/* ───────────── Chat Messages ───────────── */}
      <div className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
        <div className="px-6 py-6 max-w-4xl mx-auto w-full">
          {currentChatroom.messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Ready to chat
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start the conversation with Gemini.
              </p>
            </div>
          ) : (
            <>
              {currentChatroom.messages.map((msg) => (
                <Message key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ───────────── Chat Input ───────────── */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default ChatInterface;
