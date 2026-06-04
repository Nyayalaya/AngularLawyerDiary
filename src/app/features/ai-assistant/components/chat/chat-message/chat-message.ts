import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModel } from '../../../models/message.model';
import { SenderType } from '../../../enums/sender-type.enum';
import { MessageStatus } from '../../../enums/message-status.enum';
import { MarkdownRenderer } from '../markdown-renderer/markdown-renderer';

@Component({
  selector: 'app-chat-message',
  imports: [CommonModule, MarkdownRenderer],
  templateUrl: './chat-message.html',
  styleUrl: './chat-message.css',
})
export class ChatMessage {
  @Input() message!: MessageModel;

  SenderType = SenderType;
  MessageStatus = MessageStatus;

  get isUserMessage(): boolean {
    return this.message?.sender === SenderType.USER;
  }

  get isAssistantMessage(): boolean {
    return this.message?.sender === SenderType.ASSISTANT;
  }

  get messageTime(): string {
    return new Date(this.message?.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
