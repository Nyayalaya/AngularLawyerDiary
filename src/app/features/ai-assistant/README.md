# Legal AI Assistant Feature

## Overview
A comprehensive AI-powered assistant feature for legal professionals to help with document analysis, case management, legal research, and more.

## Feature Structure

### 🏗️ Architecture
```
ai-assistant/
├── components/          # UI Components
│   ├── chat/           # Chat interface components
│   ├── conversation/   # Conversation management
│   ├── ai-actions/     # Quick action buttons
│   └── attachments/    # File handling
├── services/           # Business logic
│   ├── ai-assistant.service.ts
│   ├── conversation.service.ts
│   ├── message.service.ts
│   └── conversion.service.ts
├── store/              # NgRx state management
├── models/             # Data models
├── enums/              # Enumerations
└── pages/              # Page components
```

## Key Components

### Chat Components
- **ChatWindow**: Main chat display area with auto-scroll
- **ChatInput**: Message input with file attachment support
- **ChatMessage**: Individual message display with status
- **EmptyChat**: Welcome screen with suggested actions
- **TypingIndicator**: Animated typing dots during AI response
- **MarkdownRenderer**: Renders markdown content with styling
- **MessageStatus**: Shows message delivery status
- **MessageActions**: Copy, feedback, regenerate, share options

### Conversation Management
- **ConversationSidebar**: List of conversations with search
- Create new conversations
- Pin/archive important conversations
- Search through past conversations

### Quick Actions
- **Summarize** documents
- **Generate drafts** from templates
- **Legal research** on case law
- **Extract dates** from documents
- **Create timelines** for cases
- **Set context** for relevant case details

## Services

### AiAssistantService
- Send messages to AI
- Stream responses
- Generate summaries, drafts, research
- Upload and process attachments

### ConversationService
- CRUD operations on conversations
- Search conversations
- Export conversations (PDF, JSON, TXT)
- Pin/archive management

### MessageService
- Message operations
- Provide feedback on responses
- Regenerate responses
- Export messages

### ConversionService
- Convert between document formats
- Extract text from various file types
- Convert to PDF

## State Management (NgRx)

### State Structure
```typescript
{
  conversations: ConversationItem[]
  messages: { [conversationId]: MessageModel[] }
  selectedConversationId: string | null
  loading: boolean
  error: string | null
  typing: boolean
  searchQuery: string
  showContextPanel: boolean
  contextCaseId?: string
}
```

### Available Actions
- Load/create/delete conversations
- Select conversation
- Send/receive messages
- Search conversations
- Toggle context panel
- Set case context

## Styling & UX

### Design Features
- **Gradient Theme**: Royal blue to purple gradient
- **Responsive Layout**: 
  - Desktop: 3-column (sidebar, chat, actions)
  - Tablet: 2-column (sidebar, chat)
  - Mobile: Full-width chat
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: WCAG compliant design

### Color Palette
- Primary: #667eea (Royal Blue)
- Secondary: #764ba2 (Purple)
- Accent: #f5576c (Red)
- Success: #06d6a0 (Green)

## Integration Points

### Sidebar Menu
- Added "AI Assistant" menu item
- Route: `/ai-assistant`
- Roles: LAWYER, CORPORATE, SuperAdmin, Admin

### Store Configuration
- Registered in `app.config.ts`
- State key: `aiAssistant`
- Reducer: `aiAssistantReducer`

## Usage Examples

### Sending a Message
```typescript
this.store.dispatch(
  AiAssistantActions.sendMessage({
    conversationId: this.currentConversationId,
    content: userMessage,
    attachmentIds: fileIds
  })
);
```

### Subscribing to Messages
```typescript
this.messages$ = this.store.select(selectMessages);
this.typing$ = this.store.select(selectTyping);
```

### Creating a Conversation
```typescript
this.store.dispatch(
  AiAssistantActions.createConversation({ title: 'Case Discussion' })
);
```

## API Endpoints (Expected Backend)

### Conversation Management
- `GET /api/ai-assistant/conversations` - Get all conversations
- `POST /api/ai-assistant/conversations` - Create new
- `PUT /api/ai-assistant/conversations/{id}` - Update
- `DELETE /api/ai-assistant/conversations/{id}` - Delete
- `PATCH /api/ai-assistant/conversations/{id}/pin` - Pin/unpin
- `PATCH /api/ai-assistant/conversations/{id}/archive` - Archive

### Messages
- `GET /api/ai-assistant/messages` - Get messages
- `POST /api/ai-assistant/chat` - Send message
- `DELETE /api/ai-assistant/messages/{id}` - Delete message
- `PATCH /api/ai-assistant/messages/{id}/feedback` - Submit feedback

### Files
- `POST /api/ai-assistant/attachments/upload` - Upload file
- `GET /api/ai-assistant/attachments/{id}/extract-text` - Extract text

## Future Enhancements

- [ ] Voice input/output support
- [ ] Advanced context management with case linking
- [ ] Integration with case management system
- [ ] Collaborative conversations
- [ ] Custom prompt templates
- [ ] AI model selection
- [ ] Cost tracking for API usage
- [ ] Audit trail and compliance logging
- [ ] Translation support
- [ ] Offline mode support

## Performance Considerations

- Message virtualization for long conversations
- Lazy loading of conversation history
- Debounced search
- Pagination for conversation lists
- Optimistic UI updates

## Accessibility Features

- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

## Security Features

- XSS protection via DomSanitizer
- CSRF token in interceptor
- Role-based access control
- Encrypted file uploads
- Secure API communication

---

**Last Updated**: May 23, 2026
**Status**: Production Ready ✅
