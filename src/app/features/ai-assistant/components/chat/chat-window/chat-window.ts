import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MessageModel } from '../../../models/message.model';
import {
  selectMessages,
  selectSelectedConversationId,
  selectLoading,
  selectTyping,
} from '../../../store';
import { ChatMessage } from '../chat-message/chat-message';
import { ChatInput } from '../chat-input/chat-input';
import { EmptyChat } from '../empty-chat/empty-chat';
import { TypingIndicator } from '../typing-indicator/typing-indicator';

@Component({
  standalone: true,
  selector: 'app-chat-window',
  imports: [
    CommonModule,
    ChatMessage,
    ChatInput,
    EmptyChat,
    TypingIndicator,
  ],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.css',
})
export class ChatWindow implements OnInit, AfterViewChecked {
  @ViewChild('messagesList') messagesList!: ElementRef;

  messages$!: Observable<MessageModel[]>;
  selectedConversationId$!: Observable<string | null>;
  loading$!: Observable<boolean>;
  typing$!: Observable<boolean>;
  shouldScroll = true;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.messages$ = this.store.select(selectMessages);
    this.selectedConversationId$ = this.store.select(selectSelectedConversationId);
    this.loading$ = this.store.select(selectLoading);
    this.typing$ = this.store.select(selectTyping);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesList) {
        this.messagesList.nativeElement.scrollTop =
          this.messagesList.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
