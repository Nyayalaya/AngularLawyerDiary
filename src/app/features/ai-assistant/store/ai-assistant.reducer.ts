import { createReducer, on } from '@ngrx/store';
import { AiAssistantState, ConversationItem, initialAiAssistantState } from './ai-assistant.state';
import { MessageModel } from '../models/message.model';
import { MessageStatus } from '../enums/message-status.enum';
import * as AiAssistantActions from './ai-assistant.actions';

export const aiAssistantReducer = createReducer(
  initialAiAssistantState,

  // Load Conversations
  on(AiAssistantActions.loadConversations, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AiAssistantActions.loadConversationsSuccess, (state, { conversations }) => ({
    ...state,
    conversations,
    selectedConversationId: state.selectedConversationId || conversations[0]?.id || null,
    loading: false,
  })),

  on(AiAssistantActions.loadConversationsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Create Conversation
  on(AiAssistantActions.createConversationSuccess, (state, { conversation }) => ({
    ...state,
    conversations: [conversation, ...state.conversations],
    selectedConversationId: conversation.id,
  })),

  // Select Conversation
  on(AiAssistantActions.selectConversation, (state, { conversationId }) => ({
    ...state,
    selectedConversationId: conversationId,
    error: null,
  })),

  // Delete Conversation
  on(AiAssistantActions.deleteConversationSuccess, (state, { conversationId }) => {
    const filteredConversations = state.conversations.filter(
      (c) => c.id !== conversationId
    );
    return {
      ...state,
      conversations: filteredConversations,
      selectedConversationId:
        state.selectedConversationId === conversationId
          ? null
          : state.selectedConversationId,
      messages: Object.keys(state.messages).reduce((acc, key) => {
        if (key !== conversationId) {
          acc[key] = state.messages[key];
        }
        return acc;
      }, {} as { [key: string]: MessageModel[] }),
    };
  }),

  // Pin Conversation
  on(AiAssistantActions.pinConversation, (state, { conversationId, pinned }) => ({
    ...state,
    conversations: state.conversations.map((c) =>
      c.id === conversationId ? { ...c, pinned } : c
    ),
  })),

  // Archive Conversation
  on(AiAssistantActions.archiveConversation, (state, { conversationId }) => ({
    ...state,
    conversations: state.conversations.map((c) =>
      c.id === conversationId ? { ...c, archived: true } : c
    ),
  })),

  // Load Messages
  on(AiAssistantActions.loadMessages, (state) => ({
    ...state,
    loading: true,
  })),

  on(AiAssistantActions.loadMessagesSuccess, (state, { conversationId, messages }) => ({
    ...state,
    messages: {
      ...state.messages,
      [conversationId]: messages,
    },
    loading: false,
  })),

  // Send Message
  on(AiAssistantActions.sendMessage, (state) => ({
    ...state,
    typing: true,
    error: null,
  })),

  on(AiAssistantActions.sendMessageSuccess, (state, { conversationId, message }) => {
    const currentMessages = state.messages[conversationId] || [];
    const conversations = updateConversationPreview(
      state.conversations,
      conversationId,
      message.content,
      currentMessages.length + 1
    );

    return {
      ...state,
      conversations,
      messages: {
        ...state.messages,
        [conversationId]: [...currentMessages, message],
      },
    };
  }),

  // Receive Message
  on(AiAssistantActions.receiveMessage, (state, { conversationId, message }) => {
    const currentMessages = state.messages[conversationId] || [];
    const conversations = updateConversationPreview(
      state.conversations,
      conversationId,
      message.content,
      currentMessages.length + 1
    );

    return {
      ...state,
      conversations,
      messages: {
        ...state.messages,
        [conversationId]: [...currentMessages, message],
      },
      typing: false,
    };
  }),

  // Update Message Status
  on(AiAssistantActions.updateMessageStatus, (state, { conversationId, messageId, status }) => {
    const messages = state.messages[conversationId] || [];
    return {
      ...state,
      messages: {
        ...state.messages,
        [conversationId]: messages.map((m) =>
          m.id === messageId ? { ...m, status: status as MessageStatus } : m
        ),
      },
    };
  }),

  // Typing Indicator
  on(AiAssistantActions.setTypingIndicator, (state, { typing }) => ({
    ...state,
    typing,
  })),

  // Search
  on(AiAssistantActions.setSearchQuery, (state, { query }) => ({
    ...state,
    searchQuery: query,
  })),

  // Context Panel
  on(AiAssistantActions.toggleContextPanel, (state) => ({
    ...state,
    showContextPanel: !state.showContextPanel,
  })),

  on(AiAssistantActions.setContextCase, (state, { caseId }) => ({
    ...state,
    contextCaseId: caseId,
    showContextPanel: true,
  })),

  // Error Handling
  on(AiAssistantActions.setError, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    typing: false,
  })),

  on(AiAssistantActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);

function updateConversationPreview(
  conversations: ConversationItem[],
  conversationId: string,
  content: string,
  messageCount: number
): ConversationItem[] {
  return conversations.map((conversation) =>
    conversation.id === conversationId
      ? {
          ...conversation,
          lastMessage: content,
          messageCount,
          updatedAt: new Date(),
        }
      : conversation
  );
}
