import React, { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useStore } from "../../store/useStore";
import { useDebounce } from "../../hooks/useDebounce";

const AppSidebar: React.FC = () => {
  const {
    user,
    chatrooms,
    createChatroom,
    deleteChatroom,
    setCurrentChatroom,
    logout,
    searchQuery,
    setSearchQuery,
    currentChatroomId,
  } = useStore();
  const [newChatroomTitle, setNewChatroomTitle] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

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

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 lg:relative lg:transform-none ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Gemini Chat
          </h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create New Chat */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Create new chatroom"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
              aria-label="Search chatrooms"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredChatrooms.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? "No chats found" : "No chats yet"}
                </p>
              </div>
            ) : (
              filteredChatrooms.map((chatroom) => (
                <div key={chatroom.id} className="group relative">
                  <button
                    onClick={() => {
                      setCurrentChatroom(chatroom.id);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      currentChatroomId === chatroom.id
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
                    }`}
                    aria-label={`Open chat: ${chatroom.title}`}
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{chatroom.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {chatroom.messages.length} messages
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteChatroom(chatroom.id, chatroom.title)
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:opacity-100"
                    aria-label={`Delete chat: ${chatroom.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.phone?.slice(-2) || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.phone || "User"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Create Chatroom Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Create New Chat
            </h3>
            <input
              type="text"
              placeholder="Enter chat name..."
              value={newChatroomTitle}
              onChange={(e) => setNewChatroomTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateChatroom();
                } else if (e.key === "Escape") {
                  setShowCreateModal(false);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4"
              autoFocus
              aria-label="Chat name"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleCreateChatroom}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Delete Chat
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{deleteConfirm.title}"? This
              action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppSidebar;
