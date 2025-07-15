import React, { useState } from "react";
import { Plus, Trash2, Menu, X } from "lucide-react";
import { IconButton } from "../ButtonWithIcon";
import { useStore } from "../../store/useStore";
import { useDebounce } from "../../hooks/useDebounce";
import { toast } from "sonner";
import { Button } from "../Button";
import { SearchInput } from "./SearchInput";
import { EmptyState } from "../EmptyState";
import { UserProfile } from "./UserProfile";
import { Modal } from "./Modal";

interface ChatroomItemProps {
  chatroom: {
    id: string;
    title: string;
    messages: unknown[];
  };
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const ChatroomItem: React.FC<ChatroomItemProps> = ({
  chatroom,
  isActive,
  onSelect,
  onDelete,
}) => (
  <div className="relative group">
    <div
      onClick={onSelect}
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "bg-gray-200 dark:bg-[#2e2e2e] text-gray-900 dark:text-white"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500`}
      aria-label={`Open chat: ${chatroom.title}`}
    >
      <span className="truncate">{chatroom.title}</span>
      <span className="ml-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        <IconButton
          icon={Trash2}
          onClick={onDelete}
          variant="ghost"
          size="sm"
          ariaLabel={`Delete chat: ${chatroom.title}`}
          className="text-white hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-600 dark:text-white"
        />
      </span>
    </div>
  </div>
);

const NavigationSidebar: React.FC = () => {
  const {
    user,
    chatrooms,
    createChatroom,
    deleteChatroom,
    setCurrentChatroom,
    logout,
    currentChatroomId,
  } = useStore();

  const [newChatroomTitle, setNewChatroomTitle] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const debouncedSearch = useDebounce(localSearchQuery, 300);

  const filteredChatrooms = chatrooms.filter((chatroom) =>
    chatroom.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleCreateChatroom = () => {
    if (!newChatroomTitle.trim()) {
      toast.error("Please enter a chatroom name");
      return;
    }

    createChatroom(newChatroomTitle.trim());
    setNewChatroomTitle("");
    setShowCreateModal(false);
    toast.success("Chatroom created successfully");
  };

  const handleDeleteChatroom = (id: string, title: string) => {
    setDeleteConfirm({ id, title });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteChatroom(deleteConfirm.id);
      setDeleteConfirm(null);
      toast.success("Chatroom deleted successfully");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const closeMobileSidebar = () => setIsMobileOpen(false);

  return (
    <>
      {/* ────── Mobile Overlay ────── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* ────── Sidebar ────── */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-80 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* ────── Header ────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold tracking-tight">Gemini</h2>
          <IconButton
            icon={X}
            onClick={closeMobileSidebar}
            size="sm"
            ariaLabel="Close sidebar"
            className="lg:hidden text-gray-700 dark:text-white"
          />
        </div>

        {/* ────── Search ────── */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <SearchInput
            value={localSearchQuery}
            onChange={setLocalSearchQuery}
            placeholder="Search chats..."
            className="bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* ────── CTA: New Chat ────── */}
        <div className="p-2 border-b border-gray-200 dark:border-gray-800">
          <Button
            variant="ghost"
            onClick={() => setShowCreateModal(true)}
            className="w-full justify-start space-x-3 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </Button>
        </div>

        {/* ────── Chat List ────── */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {filteredChatrooms.length === 0 ? (
              <EmptyState searchQuery={localSearchQuery} />
            ) : (
              filteredChatrooms.map((chatroom) => (
                <ChatroomItem
                  key={chatroom.id}
                  chatroom={chatroom}
                  isActive={currentChatroomId === chatroom.id}
                  onSelect={() => {
                    setCurrentChatroom(chatroom.id);
                    closeMobileSidebar();
                  }}
                  onDelete={() =>
                    handleDeleteChatroom(chatroom.id, chatroom.title)
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* ────── User Profile ────── */}
        <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-800">
          <UserProfile user={user} onLogout={handleLogout} />
        </div>
      </div>

      {/* ────── Mobile Menu Button ────── */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-6 z-30 lg:hidden p-3 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5 text-gray-800 dark:text-white" />
      </button>

      {/* ────── Create Chat Modal ────── */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Chat"
      >
        <div className="space-y-4">
          <SearchInput
            value={newChatroomTitle}
            onChange={setNewChatroomTitle}
            placeholder="Enter chat name..."
          />
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={handleCreateChatroom}
              className="flex-1"
            >
              Create
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* ────── Delete Confirmation Modal ────── */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Chat"
      >
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              “{deleteConfirm?.title}”
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <Button variant="danger" onClick={confirmDelete} className="flex-1">
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NavigationSidebar;
