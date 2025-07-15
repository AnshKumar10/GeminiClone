import { useStore } from "../../store/useStore";
import ChatInput from "../chat/ChatInput";

const WelcomeScreen: React.FC = () => {
  const { user, createChatroom, addMessage, setCurrentChatroom } = useStore();

  const handleStartChat = (prompt?: string, imagePreview?: string) => {
    const chatTitle = prompt
      ? prompt.slice(0, 30) + (prompt.length > 30 ? "..." : "")
      : "New Chat";

    createChatroom(chatTitle);

    const { chatrooms } = useStore.getState();
    const latestChatroom = chatrooms[0];

    if (latestChatroom) setCurrentChatroom(latestChatroom.id);

    addMessage(latestChatroom.id, {
      text: chatTitle,
      isUser: true,
      timestamp: new Date(),
      image: imagePreview,
    });
  };

  const handleSendMessage = (message: string, imagePreview?: string) => {
    if (!message.trim()) return;
    handleStartChat(message, imagePreview);
  };

  return (
    <>
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-medium text-blue-500">
          Hello, {user?.phone?.split("@")[0] || "there"}
        </h1>
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </>
  );
};

export default WelcomeScreen;
