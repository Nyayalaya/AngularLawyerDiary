import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-status',
  imports: [CommonModule],
  templateUrl: './message-status.html',
  styleUrl: './message-status.css',
})
export class MessageStatus {
  @Input() status: string = 'sent';

  getStatusIcon(): string {
    const icons: { [key: string]: string } = {
      sending: '⏳',
      sent: '✓',
      received: '✓✓',
      read: '✓✓',
      failed: '✕',
    };
    return icons[this.status] || '✓';
  }

  getStatusText(): string {
    const texts: { [key: string]: string } = {
      sending: 'Sending...',
      sent: 'Sent',
      received: 'Delivered',
      read: 'Read',
      failed: 'Failed',
    };
    return texts[this.status] || this.status;
  }
}
