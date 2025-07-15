# Gemini Chat - AI Conversational Interface

A fully functional, responsive React-based chat application that simulates the Google Gemini AI interface. Built with modern web technologies and best practices for accessibility, performance, and user experience.

## 🌟 Live Demo

[Visit Live Application](https://deployment-url.com)

## 📋 Project Overview

This project is a frontend-only implementation of a conversational AI chat interface, featuring:

- **OTP-based Authentication** with country code selection
- **Real-time Chat Interface** with AI response simulation
- **Chatroom Management** with create/delete functionality
- **Image Upload Support** with preview capabilities
- **Dark Mode Toggle** with persistent preferences
- **Mobile-First Responsive Design**
- **Accessibility** with keyboard navigation
- **Toast Notifications** for user feedback

## 🚀 Features

### ✅ Authentication

- OTP-based login/signup flow
- Country code selection with flag display
- Form validation using React Hook Form + Zod
- Simulated OTP verification (use `123456` for demo)
- LocalStorage persistence for auth state

### ✅ Chat Interface

- Real-time messaging simulation
- AI response with typing indicators
- Message timestamps and copy functionality
- Image upload with preview
- Auto-scroll to latest messages
- Throttled AI responses

### ✅ Chatroom Management

- Create/delete chatrooms
- Search functionality with debounced input
- Confirmation modals for destructive actions
- Toast notifications for all actions

### ✅ UI/UX Features

- Mobile-responsive design
- Dark/light mode toggle
- Keyboard accessibility (Tab, Enter, Escape)
- ARIA labels and semantic HTML
- Smooth animations and transitions

## 🛠️ Tech Stack

| Category             | Technology               |
| -------------------- | ------------------------ |
| **Framework**        | React 19 with TypeScript |
| **State Management** | Zustand                  |
| **Form Validation**  | React Hook Form + Zod    |
| **Styling**          | Tailwind CSS             |
| **Icons**            | Lucide React             |
| **Notifications**    | React Sonner             |
| **Build Tool**       | Vite                     |
| **Routing**          | React Router v7          |

## 📁 Project Structure

```
src/
├── components/
│ ├── Button.tsx # Reusable button component
│ ├── ButtonWithIcon.tsx # Button with icon support
│ ├── EmptyState.tsx # Component for empty state UI
│ ├── Layout.tsx # App layout wrapper
│ ├── auth/
│ │ ├── AuthForm.tsx # OTP login/signup form
│ │ ├── FormField.tsx # Generic form field wrapper
│ │ ├── InputField.tsx # Input field component
│ │ └── SelectField.tsx # Dropdown select field
│ ├── chat/
│ │ ├── ChatInput.tsx # Message input with image upload
│ │ ├── ChatInterface.tsx # Main chat container
│ │ ├── Message.tsx # Individual chat message
│ │ └── TypingIndicator.tsx # Typing animation for AI
│ ├── dashboard/
│ │ ├── MainContent.tsx # Main app dashboard content
│ │ └── WelcomeScreen.tsx # Initial welcome screen
│ └── sidebar/
│ ├── AppSidebar.tsx # Sidebar with navigation/chat list
│ ├── Modal.tsx # Reusable modal component
│ ├── SearchInput.tsx # Search bar for sidebar
│ └── UserProfile.tsx # User profile dropdown/info
├── hooks/
│ ├── use-mobile.tsx # Detect mobile screen sizes
│ ├── useCountry.ts # Fetch and handle country data
│ └── useDebounce.ts # Debounce hook for inputs
├── lib/
│ └── utils.ts # Utility/helper functions
├── pages/
│ ├── Index.tsx # Main app entry page
│ └── NotFound.tsx # 404 error/fallback page
├── store/
│ └── useStore.ts # Zustand global state store
├── styles/
│ └── global.css # Global styles and resets
└── main.tsx # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd gemini-chat
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Key Implementation Details

### Throttling AI Responses

AI responses are throttled to simulate realistic thinking time:

```typescript
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

    let aiResponse = "I understand your message. How can I assist you further?";

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
```

### Infinite Scroll & Pagination

Messages are paginated client-side with reverse infinite scroll:

```typescript
// In a real implementation, you would load older messages
const loadOlderMessages = useCallback(() => {
  // Simulate loading older messages from API
  const olderMessages = generateDummyMessages(20);
  setChatMessages((prev) => [...olderMessages, ...prev]);
}, []);
```

### Form Validation with Zod

Robust form validation for phone numbers and OTP:

```typescript
const phoneSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});
```

### State Management with Zustand

Centralized state management with persistence:

```typescript
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      isAuthenticated: false,

      // Chat state
      chatrooms: [],
      currentChatroomId: null,
      isTyping: false,

      // UI state
      isDarkMode: false,
      searchQuery: "",

      // Actions
      setUser: (user) => set({ user, isAuthenticated: true }),
      createChatroom: (title) => {
        const newChatroom = {
          id: Date.now().toString(),
          title,
          messages: [],
          createdAt: new Date(),
        };
        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
        }));
      },
      // ... other actions
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
```

## ♿ Accessibility Features

- **Keyboard Navigation**: Full tab order and keyboard shortcuts
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Semantic HTML**: Proper heading hierarchy and form structure
- **Focus Management**: Visible focus indicators and logical flow
- **Color Contrast**: WCAG AA compliant color combinations
- **Screen Reader Support**: Announcements for dynamic content

## 📱 Responsive Design

- **Mobile-First**: Optimized for touch interfaces
- **Breakpoint System**: Tailored layouts for different screen sizes
- **Touch Targets**: Minimum 44px tap targets
- **Gesture Support**: Swipe navigation where appropriate

## 🎨 Dark Mode Implementation

System-aware dark mode with manual toggle:

```typescript
const { isDarkMode, toggleDarkMode } = useStore();

useEffect(() => {
  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [isDarkMode]);
```
