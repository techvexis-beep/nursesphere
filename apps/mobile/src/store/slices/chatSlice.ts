import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  type: 'text' | 'image' | 'document';
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  participantIds: string[];
  participants: {
    id: string;
    displayName: string;
    photoURL: string;
  }[];
  lastMessage: Message | null;
  unreadCount: number;
  type: 'direct' | 'group';
  groupName?: string;
}

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  messages: {},
  isLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<Chat | null>) => {
      state.activeChat = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      state.messages[action.payload.chatId] = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
      
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        chat.lastMessage = message;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setChats, setActiveChat, setMessages, addMessage, setLoading } = chatSlice.actions;
export default chatSlice.reducer;
