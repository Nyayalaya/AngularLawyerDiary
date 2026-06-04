import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concat, delay, map, of, switchMap, tap } from 'rxjs';

import { MessageStatus } from '../enums/message-status.enum';
import { MessageType } from '../enums/message-type.enum';
import { SenderType } from '../enums/sender-type.enum';
import { AttachmentStatus } from '../enums/attachment-status.enum';
import { MessageModel } from '../models/message.model';
import * as AiAssistantActions from './ai-assistant.actions';
import { ConversationItem } from './ai-assistant.state';

interface AiAssistantStorage {
  conversations: ConversationItem[];
  messages: Record<string, MessageModel[]>;
}

const STORAGE_KEY = 'lawyer-diary.ai-assistant';

@Injectable()
export class AiAssistantEffects {
  private actions$ = inject(Actions);

  loadConversations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AiAssistantActions.loadConversations),
      switchMap(() => {
        const storage = ensureWorkspace(readStorage());
        const conversations = sortConversations(storage.conversations);

        return concat(
          of(AiAssistantActions.loadConversationsSuccess({ conversations })),
          conversations[0]
            ? of(AiAssistantActions.selectConversation({ conversationId: conversations[0].id }))
            : of(AiAssistantActions.clearError())
        );
      })
    )
  );

  createConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AiAssistantActions.createConversation),
      map(({ title }) => {
        const storage = readStorage();
        const now = new Date();
        const conversation: ConversationItem = {
          id: createId('conversation'),
          title: title || 'New legal assistant chat',
          createdAt: now,
          updatedAt: now,
          messageCount: 0,
          pinned: false,
          archived: false,
        };

        writeStorage({
          conversations: [conversation, ...storage.conversations],
          messages: {
            ...storage.messages,
            [conversation.id]: [],
          },
        });

        return AiAssistantActions.createConversationSuccess({ conversation });
      })
    )
  );

  selectConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AiAssistantActions.selectConversation),
      map(({ conversationId }) =>
        AiAssistantActions.loadMessages({ conversationId })
      )
    )
  );

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AiAssistantActions.loadMessages),
      map(({ conversationId }) => {
        const storage = readStorage();
        return AiAssistantActions.loadMessagesSuccess({
          conversationId,
          messages: storage.messages[conversationId] || [],
        });
      })
    )
  );

  deleteConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AiAssistantActions.deleteConversation),
      map(({ conversationId }) => {
        const storage = readStorage();
        const { [conversationId]: _deletedMessages, ...messages } = storage.messages;

        writeStorage({
          conversations: storage.conversations.filter((item) => item.id !== conversationId),
          messages,
        });

        return AiAssistantActions.deleteConversationSuccess({ conversationId });
      })
    )
  );

  pinConversation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AiAssistantActions.pinConversation),
        tap(({ conversationId, pinned }) => {
          const storage = readStorage();
          writeStorage({
            ...storage,
            conversations: storage.conversations.map((conversation) =>
              conversation.id === conversationId ? { ...conversation, pinned } : conversation
            ),
          });
        })
      ),
    { dispatch: false }
  );

  archiveConversation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AiAssistantActions.archiveConversation),
        tap(({ conversationId }) => {
          const storage = readStorage();
          writeStorage({
            ...storage,
            conversations: storage.conversations.map((conversation) =>
              conversation.id === conversationId ? { ...conversation, archived: true } : conversation
            ),
          });
        })
      ),
    { dispatch: false }
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AiAssistantActions.sendMessage),
      switchMap(({ conversationId, content, attachmentIds }) => {
        const startedAt = performance.now();
        const userMessage = createMessage(
          conversationId,
          SenderType.USER,
          content,
          MessageType.TEXT,
          MessageStatus.SENT,
          attachmentIds
        );
        appendMessage(conversationId, userMessage);

        const assistantMessage = createMessage(
          conversationId,
          SenderType.ASSISTANT,
          buildAssistantResponse(content, attachmentIds),
          MessageType.MARKDOWN,
          MessageStatus.RECEIVED
        );
        assistantMessage.metadata = {
          model: 'local-legal-assistant',
          processingTime: Math.round(performance.now() - startedAt + 650),
          confidence: 0.78,
        };
        appendMessage(conversationId, assistantMessage);

        return concat(
          of(
            AiAssistantActions.sendMessageSuccess({
              conversationId,
              message: userMessage,
            })
          ),
          of(
            AiAssistantActions.receiveMessage({
              conversationId,
              message: assistantMessage,
            })
          ).pipe(delay(650))
        );
      })
    )
  );
}

function readStorage(): AiAssistantStorage {
  const empty: AiAssistantStorage = { conversations: [], messages: {} };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return empty;
    }

    const parsed = JSON.parse(raw) as AiAssistantStorage;
    return {
      conversations: (parsed.conversations || []).map((conversation) => ({
        ...conversation,
        createdAt: new Date(conversation.createdAt),
        updatedAt: new Date(conversation.updatedAt),
      })),
      messages: Object.entries(parsed.messages || {}).reduce<Record<string, MessageModel[]>>(
        (acc, [conversationId, messages]) => {
          acc[conversationId] = messages.map((message) => ({
            ...message,
            timestamp: new Date(message.timestamp),
          }));
          return acc;
        },
        {}
      ),
    };
  } catch {
    return empty;
  }
}

function ensureWorkspace(storage: AiAssistantStorage): AiAssistantStorage {
  if (storage.conversations.length > 0) {
    return storage;
  }

  const now = new Date();
  const conversation: ConversationItem = {
    id: createId('conversation'),
    title: 'Legal assistant workspace',
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
    pinned: true,
    archived: false,
  };

  const seeded = {
    conversations: [conversation],
    messages: {
      [conversation.id]: [],
    },
  };
  writeStorage(seeded);
  return seeded;
}

function writeStorage(storage: AiAssistantStorage): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

function appendMessage(conversationId: string, message: MessageModel): void {
  const storage = readStorage();
  const messages = [...(storage.messages[conversationId] || []), message];
  const conversations = storage.conversations.map((conversation) =>
    conversation.id === conversationId
      ? {
          ...conversation,
          lastMessage: message.content,
          messageCount: messages.length,
          updatedAt: new Date(),
        }
      : conversation
  );

  writeStorage({
    conversations,
    messages: {
      ...storage.messages,
      [conversationId]: messages,
    },
  });
}

function createMessage(
  conversationId: string,
  sender: SenderType,
  content: string,
  type: MessageType,
  status: MessageStatus,
  attachmentIds?: string[]
): MessageModel {
  return {
    id: createId('message'),
    conversationId,
    sender,
    type,
    content,
    timestamp: new Date(),
    status,
    attachments: attachmentIds?.map((fileName) => ({
      id: createId('attachment'),
      fileName,
      size: 0,
      fileType: 'local',
      url: '',
      uploadedAt: new Date(),
      status: AttachmentStatus.UPLOADED,
    })),
  };
}

function buildAssistantResponse(content: string, attachmentIds?: string[]): string {
  const prompt = content.toLowerCase();
  const attachmentNote = attachmentIds?.length
    ? `\n\nI noted ${attachmentIds.length} attached file(s): ${attachmentIds.join(', ')}.`
    : '';

  if (prompt.includes('summar')) {
    return `### Summary\n\n- Identify the parties, forum, case number, and current stage.\n- Separate admitted facts from disputed facts.\n- List pending filings, limitation concerns, and next hearing preparation.\n\n### Next Steps\n\n1. Paste the document text or attach the file.\n2. Tell me whether you need a short client summary or a detailed court note.${attachmentNote}`;
  }

  if (prompt.includes('draft') || prompt.includes('petition') || prompt.includes('notice')) {
    return `### Drafting Checklist\n\n- Confirm jurisdiction, parties, relief sought, and material dates.\n- Build the facts chronologically with numbered paragraphs.\n- Add grounds, prayer, verification, and annexure index.\n\nShare the document type and case facts, and I will structure a working draft.${attachmentNote}`;
  }

  if (prompt.includes('research') || prompt.includes('case law') || prompt.includes('citation')) {
    return `### Research Plan\n\n- Define the legal issue in one sentence.\n- Capture governing statute sections and binding court level.\n- Compare favorable and adverse authorities.\n- End with a short applicability note for your facts.\n\nTell me the issue, jurisdiction, and any known citations to narrow the answer.${attachmentNote}`;
  }

  if (prompt.includes('date') || prompt.includes('timeline') || prompt.includes('hearing')) {
    return `### Timeline Framework\n\n| Item | Date | Legal Importance |\n| --- | --- | --- |\n| Filing / notice | Add date | Limitation and procedural trigger |\n| Previous hearing | Add date | Order compliance |\n| Next hearing | Add date | Preparation deadline |\n\nSend the case notes and I will convert them into a clean chronology.${attachmentNote}`;
  }

  return `I can help with legal research, document summaries, draft preparation, issue spotting, timelines, and hearing notes.\n\nFor best results, include:\n\n- court or jurisdiction\n- case stage\n- key dates\n- document text or attachment name\n- the exact output you want\n\nWhat would you like to work on first?${attachmentNote}`;
}

function sortConversations(conversations: ConversationItem[]): ConversationItem[] {
  return [...conversations].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
