import { createAction, props } from '@ngrx/store';
import { MessageModel } from '../models/message.model';
import { ConversationItem, AiAssistantState } from './ai-assistant.state';

// Conversation Actions
export const loadConversations = createAction(
  '[AI Assistant] Load Conversations'
);

export const loadConversationsSuccess = createAction(
  '[AI Assistant] Load Conversations Success',
  props<{ conversations: ConversationItem[] }>()
);

export const loadConversationsFailure = createAction(
  '[AI Assistant] Load Conversations Failure',
  props<{ error: string }>()
);

export const createConversation = createAction(
  '[AI Assistant] Create Conversation',
  props<{ title?: string }>()
);

export const createConversationSuccess = createAction(
  '[AI Assistant] Create Conversation Success',
  props<{ conversation: ConversationItem }>()
);

export const selectConversation = createAction(
  '[AI Assistant] Select Conversation',
  props<{ conversationId: string }>()
);

export const deleteConversation = createAction(
  '[AI Assistant] Delete Conversation',
  props<{ conversationId: string }>()
);

export const deleteConversationSuccess = createAction(
  '[AI Assistant] Delete Conversation Success',
  props<{ conversationId: string }>()
);

export const pinConversation = createAction(
  '[AI Assistant] Pin Conversation',
  props<{ conversationId: string; pinned: boolean }>()
);

export const archiveConversation = createAction(
  '[AI Assistant] Archive Conversation',
  props<{ conversationId: string }>()
);

// Message Actions
export const loadMessages = createAction(
  '[AI Assistant] Load Messages',
  props<{ conversationId: string }>()
);

export const loadMessagesSuccess = createAction(
  '[AI Assistant] Load Messages Success',
  props<{ conversationId: string; messages: MessageModel[] }>()
);

export const sendMessage = createAction(
  '[AI Assistant] Send Message',
  props<{ conversationId: string; content: string; attachmentIds?: string[] }>()
);

export const sendMessageSuccess = createAction(
  '[AI Assistant] Send Message Success',
  props<{ conversationId: string; message: MessageModel }>()
);

export const receiveMessage = createAction(
  '[AI Assistant] Receive Message',
  props<{ conversationId: string; message: MessageModel }>()
);

export const updateMessageStatus = createAction(
  '[AI Assistant] Update Message Status',
  props<{ conversationId: string; messageId: string; status: string }>()
);

export const setTypingIndicator = createAction(
  '[AI Assistant] Set Typing Indicator',
  props<{ typing: boolean }>()
);

// Search Actions
export const setSearchQuery = createAction(
  '[AI Assistant] Set Search Query',
  props<{ query: string }>()
);

// Context Panel Actions
export const toggleContextPanel = createAction(
  '[AI Assistant] Toggle Context Panel'
);

export const setContextCase = createAction(
  '[AI Assistant] Set Context Case',
  props<{ caseId: string }>()
);

// Error Handling
export const setError = createAction(
  '[AI Assistant] Set Error',
  props<{ error: string }>()
);

export const clearError = createAction(
  '[AI Assistant] Clear Error'
);
