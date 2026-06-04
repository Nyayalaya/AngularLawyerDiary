import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConversationModel {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage?: string;
  pinned?: boolean;
  archived?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private apiUrl = '/api/ai-assistant/conversations';

  constructor(private http: HttpClient) {}

  /**
   * Get all conversations
   */
  getConversations(): Observable<ConversationModel[]> {
    return this.http.get<ConversationModel[]>(this.apiUrl);
  }

  /**
   * Get archived conversations
   */
  getArchivedConversations(): Observable<ConversationModel[]> {
    return this.http.get<ConversationModel[]>(`${this.apiUrl}?archived=true`);
  }

  /**
   * Create new conversation
   */
  createConversation(title?: string): Observable<ConversationModel> {
    return this.http.post<ConversationModel>(this.apiUrl, {
      title: title || `Conversation ${new Date().toLocaleDateString()}`,
    });
  }

  /**
   * Update conversation
   */
  updateConversation(
    id: string,
    data: Partial<ConversationModel>
  ): Observable<ConversationModel> {
    return this.http.put<ConversationModel>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Pin/Unpin conversation
   */
  togglePin(id: string, pinned: boolean): Observable<ConversationModel> {
    return this.http.patch<ConversationModel>(`${this.apiUrl}/${id}/pin`, {
      pinned,
    });
  }

  /**
   * Archive conversation
   */
  archiveConversation(id: string): Observable<ConversationModel> {
    return this.http.patch<ConversationModel>(`${this.apiUrl}/${id}/archive`, {});
  }

  /**
   * Delete conversation
   */
  deleteConversation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search conversations
   */
  searchConversations(query: string): Observable<ConversationModel[]> {
    return this.http.get<ConversationModel[]>(`${this.apiUrl}/search`, {
      params: { q: query },
    });
  }

  /**
   * Export conversation
   */
  exportConversation(id: string, format: 'pdf' | 'json' | 'txt' = 'pdf'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/export?format=${format}`, {
      responseType: 'blob',
    });
  }
}
