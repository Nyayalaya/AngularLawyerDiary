import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MessageMetadata {
  model?: string;
  tokens?: number;
  processingTime?: number;
  referencedCases?: string[];
  referencedActs?: string[];
  confidence?: number;
  feedback?: 'helpful' | 'not-helpful';
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  content: string;
  timestamp: Date;
  metadata: MessageMetadata;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = '/api/ai-assistant/messages';

  constructor(private http: HttpClient) {}

  /**
   * Get messages for a conversation
   */
  getMessages(conversationId: string): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(
      `${this.apiUrl}?conversationId=${conversationId}`
    );
  }

  /**
   * Delete a message
   */
  deleteMessage(messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${messageId}`);
  }

  /**
   * Update message feedback
   */
  updateMessageFeedback(
    messageId: string,
    feedback: 'helpful' | 'not-helpful'
  ): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(`${this.apiUrl}/${messageId}/feedback`, {
      feedback,
    });
  }

  /**
   * Regenerate message response
   */
  regenerateMessage(messageId: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.apiUrl}/${messageId}/regenerate`,
      {}
    );
  }

  /**
   * Copy message to clipboard
   */
  copyToClipboard(content: string): Promise<void> {
    return navigator.clipboard.writeText(content);
  }

  /**
   * Export messages
   */
  exportMessages(
    conversationId: string,
    format: 'pdf' | 'json' | 'txt' = 'pdf'
  ): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/export?conversationId=${conversationId}&format=${format}`,
      { responseType: 'blob' }
    );
  }
}
