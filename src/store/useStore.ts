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
  user: User | null;
  isAuthenticated: boolean;
  isDarkMode: boolean;
  chatrooms: Chatroom[];
  currentChatroomId: string | null;
  isTyping: boolean;
  searchQuery: string;

  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  toggleDarkMode: () => void;
  createChatroom: (title: string) => void;
  deleteChatroom: (id: string) => void;
  setCurrentChatroom: (id: string) => void;
  addMessage: (chatroomId: string, message: Omit<Message, "id">) => void;
  setTyping: (isTyping: boolean) => void;
  setSearchQuery: (query: string) => void;
}

// === Demo Data ===

const demoChatroom: Chatroom = {
  id: "1752564000000",
  title: "Chat with Assistant",
  createdAt: new Date("2025-07-15T07:25:00.000Z"),
  messages: [
    {
      id: "1752564001001",
      text: "Hey, can you help me plan my day?",
      isUser: true,
      timestamp: new Date("2025-07-15T07:25:01.001Z"),
    },
    {
      id: "1752564002100",
      text: "Of course! What's on your agenda today?",
      isUser: false,
      timestamp: new Date("2025-07-15T07:25:02.100Z"),
    },
    {
      id: "1752564003100",
      text: "I have a meeting at 10 AM and a dentist appointment at 3 PM.",
      isUser: true,
      timestamp: new Date("2025-07-15T07:25:03.100Z"),
    },
    {
      id: "1752564004100",
      text: "Got it! Would you like reminders for those?",
      isUser: false,
      timestamp: new Date("2025-07-15T07:25:04.100Z"),
    },
    {
      id: "1752564005100",
      text: "Yes, 15 minutes before each, please.",
      isUser: true,
      timestamp: new Date("2025-07-15T07:25:05.100Z"),
    },
    {
      id: "1752564006100",
      text: "Done! Anything else you need today?",
      isUser: false,
      timestamp: new Date("2025-07-15T07:25:06.100Z"),
    },
    {
      id: "1752564007100",
      text: "Can you also recommend a place for lunch near my office?",
      isUser: true,
      timestamp: new Date("2025-07-15T07:25:07.100Z"),
    },
    {
      id: "1752564008100",
      text: "Sure! What kind of food are you in the mood for?",
      isUser: false,
      timestamp: new Date("2025-07-15T07:25:08.100Z"),
    },
    {
      id: "1752564009100",
      text: "Something quick — maybe a sandwich or wrap.",
      isUser: true,
      timestamp: new Date("2025-07-15T07:25:09.100Z"),
    },
    {
      id: "1752564010100",
      text: "Try 'Green Leaf Deli' — 4.6 stars, great for wraps and salads!",
      isUser: false,
      timestamp: new Date("2025-07-15T07:25:10.100Z"),
    },
    {
      id: "1752564011100",
      text: "Perfect. Can you add that to my calendar for 12:30?",
      isUser: true,
      timestamp: new Date("2025-07-15T07:25:11.100Z"),
    },
    {
      id: "1752564012100",
      text: "Added! Lunch at Green Leaf Deli at 12:30 PM.",
      isUser: false,
      timestamp: new Date("2025-07-15T07:25:12.100Z"),
    },
    {
      id: "1752564013100",
      text: "You’re on a roll today! 😂",
      isUser: true,
      timestamp: new Date("2025-07-15T07:25:13.100Z"),
    },
    {
      id: "1752564014100",
      text: "Thanks! Want to hear a productivity tip?",
      isUser: false,
      timestamp: new Date("2025-07-15T07:25:14.100Z"),
    },
    {
      id: "1752564015100",
      text: "Sure, hit me.",
      isUser: true,
      timestamp: new Date("2025-07-15T07:25:15.100Z"),
    },
    {
      id: "1752564016100",
      text: "Try using the Pomodoro technique: 25 min focus, 5 min break. Rinse & repeat.",
      isUser: false,
      timestamp: new Date("2025-07-15T07:25:16.100Z"),
    },
    {
      id: "1752564017100",
      text: "Oh yeah, I’ve heard of that. Sounds doable.",
      isUser: true,
      timestamp: new Date("2025-07-15T07:25:17.100Z"),
    },
    {
      id: "1752564018100",
      text: "Need help setting a Pomodoro timer?",
      isUser: false,
      timestamp: new Date("2025-07-15T07:25:18.100Z"),
    },
    {
      id: "1752564019100",
      text: "Maybe later. For now, can you draft a quick to-do list?",
      isUser: true,
      timestamp: new Date("2025-07-15T07:25:19.100Z"),
    },
    {
      id: "1752564020100",
      text: "Here you go:\n1. Team meeting @10AM\n2. Lunch @12:30PM\n3. Dentist @3PM",
      isUser: false,
      timestamp: new Date("2025-07-15T07:25:20.100Z"),
    },
  ],
};

// === Zustand Store ===

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isDarkMode: false,
      chatrooms: [demoChatroom],
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

      deleteChatroom: (id) =>
        set((state) => ({
          chatrooms: state.chatrooms.filter((room) => room.id !== id),
          currentChatroomId:
            state.currentChatroomId === id ? null : state.currentChatroomId,
        })),

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
