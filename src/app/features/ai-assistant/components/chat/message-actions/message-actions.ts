import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModel } from '../../../models/message.model';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-message-actions',
  imports: [CommonModule],
  templateUrl: './message-actions.html',
  styleUrl: './message-actions.css',
})
export class MessageActions {
  @Input() message!: MessageModel;

  showActions = false;
  feedback: 'helpful' | 'not-helpful' | null = null;

  constructor(private messageService: MessageService) {}

  toggleActions(): void {
    this.showActions = !this.showActions;
  }

  copyToClipboard(): void {
    this.messageService.copyToClipboard(this.message.content).then(() => {
      alert('Copied to clipboard!');
    });
  }

  provideFeedback(type: 'helpful' | 'not-helpful'): void {
    this.feedback = type;
    this.messageService
      .updateMessageFeedback(this.message.id, type)
      .subscribe(() => {
        console.log('Feedback submitted');
      });
  }

  regenerate(): void {
    console.log('Regenerating message...');
    // Implement regeneration logic
  }

  shareMessage(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Legal AI Assistant',
        text: this.message.content,
      });
    }
  }
}
