import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectFilteredConversations,
  selectSelectedConversationId,
  selectSearchQuery,
} from '../../../store';
import * as AiAssistantActions from '../../../store/ai-assistant.actions';
import { ConversationItem } from '../../../store/ai-assistant.state';

@Component({
  standalone: true,
  selector: 'app-conversation-sidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation-sidebar.html',
  styleUrl: './conversation-sidebar.css',
})
export class ConversationSidebar implements OnInit {
  conversations$!: Observable<ConversationItem[]>;
  selectedConversationId$!: Observable<string | null>;
  searchQuery$!: Observable<string>;
  searchInput = '';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.conversations$ = this.store.select(selectFilteredConversations);
    this.selectedConversationId$ = this.store.select(selectSelectedConversationId);
    this.searchQuery$ = this.store.select(selectSearchQuery);

    this.store.dispatch(AiAssistantActions.loadConversations());
  }

  createNewConversation(): void {
    this.store.dispatch(AiAssistantActions.createConversation({}));
  }

  selectConversation(conversationId: string): void {
    this.store.dispatch(AiAssistantActions.selectConversation({ conversationId }));
  }

  deleteConversation(conversationId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      this.store.dispatch(AiAssistantActions.deleteConversation({ conversationId }));
    }
  }

  pinConversation(conversationId: string, pinned: boolean, event: Event): void {
    event.stopPropagation();
    this.store.dispatch(
      AiAssistantActions.pinConversation({ conversationId, pinned: !pinned })
    );
  }

  onSearch(query: string): void {
    this.store.dispatch(AiAssistantActions.setSearchQuery({ query }));
  }
}
