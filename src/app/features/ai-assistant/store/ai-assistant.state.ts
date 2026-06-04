import { MessageModel } from '../models/message.model';

export interface ConversationItem {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage?: string;
  pinned?: boolean;
  archived?: boolean;
}

export interface AiAssistantState {
  conversations: ConversationItem[];
  messages: { [conversationId: string]: MessageModel[] };
  selectedConversationId: string | null;
  loading: boolean;
  error: string | null;
  typing: boolean;
  searchQuery: string;
  showContextPanel: boolean;
  contextCaseId?: string;
}

export const initialAiAssistantState: AiAssistantState = {
  conversations: [],
  messages: {},
  selectedConversationId: null,
  loading: false,
  error: null,
  typing: false,
  searchQuery: '',
  showContextPanel: false,
  contextCaseId: undefined,
};
