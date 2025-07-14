import { Sparkles, Lightbulb, Code, BookOpen, Palette } from "lucide-react";
import { useStore } from "../../store/useStore";
import ChatInput from "../chat/ChatInput";

const WelcomeScreen: React.FC = () => {
  const { user, createChatroom, setCurrentChatroom } = useStore();

  const handleStartChat = (prompt?: string) => {
    const chatTitle = prompt
      ? prompt.slice(0, 30) + (prompt.length > 30 ? "..." : "")
      : "New Chat";

    createChatroom(chatTitle);

    const { chatrooms } = useStore.getState();
    const latestChatroom = chatrooms[0];

    if (latestChatroom) setCurrentChatroom(latestChatroom.id);
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    handleStartChat(message);
  };

  const suggestions = [
    {
      icon: Lightbulb,
      title: "Get creative ideas",
      description: "Help me brainstorm new project concepts",
    },
    {
      icon: Code,
      title: "Code assistance",
      description: "Debug my JavaScript function",
    },
    {
      icon: BookOpen,
      title: "Learn something new",
      description: "Explain quantum physics in simple terms",
    },
    {
      icon: Palette,
      title: "Design inspiration",
      description: "Suggest color palettes for my website",
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-light mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Hello, {user?.phone?.split("@")[0] || "there"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          How can I help you today?
        </p>
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
            onClick={() => handleStartChat(suggestion.description)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center shrink-0">
                <suggestion.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm mb-1 text-gray-900 dark:text-gray-100">
                  {suggestion.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default WelcomeScreen;
