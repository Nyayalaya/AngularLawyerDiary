import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AiAssistantActions from '../../../store/ai-assistant.actions';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.html',
  styleUrl: './chat-input.css',
})
export class ChatInput {
  @Input() selectedConversationId: string | null = null;
  @Input() isDisabled = false;
  @ViewChild('fileInput') fileInput!: ElementRef;

  messageContent = '';
  attachedFiles: File[] = [];
  isSending = false;

  constructor(private store: Store) {}

  sendMessage(): void {
    if (!this.messageContent.trim() || !this.selectedConversationId || this.isSending) {
      return;
    }

    this.isSending = true;
    const attachmentIds = this.attachedFiles.map((f) => f.name);

    this.store.dispatch(
      AiAssistantActions.sendMessage({
        conversationId: this.selectedConversationId,
        content: this.messageContent,
        attachmentIds: attachmentIds.length > 0 ? attachmentIds : undefined,
      })
    );

    this.messageContent = '';
    this.attachedFiles = [];
    this.isSending = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.attachedFiles = Array.from(input.files);
    }
  }

  removeAttachment(index: number): void {
    this.attachedFiles.splice(index, 1);
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement?.click();
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
