import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  phone: string;
  countryCode: string;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
}

export interface Chatroom {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;

  // UI
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Chatrooms
  chatrooms: Chatroom[];
  currentChatroomId: string | null;
  isTyping: boolean;

  // Actions
  createChatroom: (title: string) => void;
  deleteChatroom: (id: string) => void;
  setCurrentChatroom: (id: string) => void;
  addMessage: (chatroomId: string, message: Omit<Message, "id">) => void;
  setTyping: (isTyping: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isDarkMode: false,
      chatrooms: [],
      currentChatroomId: null,
      isTyping: false,
      searchQuery: "",

      // Auth actions
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () =>
        set({ user: null, isAuthenticated: false, currentChatroomId: null }),

      // UI actions
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Chatroom actions
      createChatroom: (title) => {
        const newChatroom: Chatroom = {
          id: Date.now().toString(),
          title,
          messages: [],
          createdAt: new Date(),
        };
        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
        }));
      },

      deleteChatroom: (id) => {
        set((state) => ({
          chatrooms: state.chatrooms.filter((room) => room.id !== id),
          currentChatroomId:
            state.currentChatroomId === id ? null : state.currentChatroomId,
        }));
      },

      setCurrentChatroom: (id) => set({ currentChatroomId: id }),

      addMessage: (chatroomId, message) => {
        const newMessage: Message = {
          ...message,
          id: Date.now().toString(),
        };

        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId
              ? { ...room, messages: [...room.messages, newMessage] }
              : room
          ),
        }));
      },

      setTyping: (isTyping) => set({ isTyping }),

      // Search actions
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "gemini-chat-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isDarkMode: state.isDarkMode,
        chatrooms: state.chatrooms,
      }),
    }
  )
);
