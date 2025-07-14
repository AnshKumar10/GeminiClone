import React, { useRef, useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import { useStore } from "../../store/useStore";

const ChatInterface: React.FC = () => {
  const { chatrooms, currentChatroomId, addMessage, isTyping, setTyping } =
    useStore();

  const [lastResponseTime, setLastResponseTime] = React.useState(0);
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
  }, [currentChatroom?.messages, isTyping, scrollToBottom]);

  const generateAIResponse = useCallback(
    async (userMessage: string) => {
      if (!currentChatroomId) return;

      const now = Date.now();
      const timeSinceLastResponse = now - lastResponseTime;
      const minDelay = 2000;

      const additionalDelay = Math.max(0, minDelay - timeSinceLastResponse);
      const responseDelay = 1500 + additionalDelay + Math.random() * 2000;

      setTyping(true);

      await new Promise((resolve) => setTimeout(resolve, responseDelay));

      let aiResponse =
        "I understand your message. How can I assist you further?";

      const lowerMessage = userMessage.toLowerCase();
      if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
        aiResponse =
          "Hello! I'm Gemini, your AI assistant. How can I help you today?";
      } else if (lowerMessage.includes("weather")) {
        aiResponse =
          "I'd be happy to help with weather information, though I don't have access to real-time data in this demo. Is there anything else I can assist you with?";
      } else if (lowerMessage.includes("help")) {
        aiResponse =
          "I'm here to help! You can ask me questions, have conversations, or even share images. What would you like to know?";
      } else if (
        lowerMessage.includes("image") ||
        lowerMessage.includes("picture")
      ) {
        aiResponse =
          "I can see you've shared an image! While I can view images in this demo, I'd need more advanced capabilities to analyze them in detail.";
      }

      addMessage(currentChatroomId, {
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      });

      setTyping(false);
      setLastResponseTime(Date.now());
    },
    [currentChatroomId, addMessage, setTyping, lastResponseTime]
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
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
        <h1 className="font-medium text-lg truncate text-gray-900 dark:text-gray-100">
          {currentChatroom.title}
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
        <div className="px-6 py-6 max-w-4xl mx-auto w-full">
          {currentChatroom.messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
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

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default ChatInterface;
