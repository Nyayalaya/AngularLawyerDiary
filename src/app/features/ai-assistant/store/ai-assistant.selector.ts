import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AiAssistantState } from './ai-assistant.state';

export const selectAiAssistantState = createFeatureSelector<AiAssistantState>(
  'aiAssistant'
);

export const selectConversations = createSelector(
  selectAiAssistantState,
  (state) => state.conversations
);

export const selectPinnedConversations = createSelector(
  selectConversations,
  (conversations) => conversations.filter((c) => c.pinned)
);

export const selectArchivedConversations = createSelector(
  selectConversations,
  (conversations) => conversations.filter((c) => c.archived)
);

export const selectActiveConversations = createSelector(
  selectConversations,
  (conversations) => conversations.filter((c) => !c.archived)
);

export const selectSelectedConversationId = createSelector(
  selectAiAssistantState,
  (state) => state.selectedConversationId
);

export const selectSelectedConversation = createSelector(
  selectConversations,
  selectSelectedConversationId,
  (conversations, selectedId) =>
    selectedId ? conversations.find((c) => c.id === selectedId) : null
);

export const selectMessages = createSelector(
  selectAiAssistantState,
  selectSelectedConversationId,
  (state, selectedId) => (selectedId ? state.messages[selectedId] || [] : [])
);

export const selectLoading = createSelector(
  selectAiAssistantState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectAiAssistantState,
  (state) => state.error
);

export const selectTyping = createSelector(
  selectAiAssistantState,
  (state) => state.typing
);

export const selectSearchQuery = createSelector(
  selectAiAssistantState,
  (state) => state.searchQuery
);

export const selectShowContextPanel = createSelector(
  selectAiAssistantState,
  (state) => state.showContextPanel
);

export const selectContextCaseId = createSelector(
  selectAiAssistantState,
  (state) => state.contextCaseId
);

export const selectFilteredConversations = createSelector(
  selectActiveConversations,
  selectSearchQuery,
  (conversations, query) => {
    if (!query) return conversations;
    const lowerQuery = query.toLowerCase();
    return conversations.filter((c) =>
      c.title.toLowerCase().includes(lowerQuery)
    );
  }
);
