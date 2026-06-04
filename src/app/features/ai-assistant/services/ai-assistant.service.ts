import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { AiRequestModel } from '../models/ai-request.model';
import { AiResponseModel } from '../models/ai-response.model';
import { MessageModel } from '../models/message.model';
import { MessageStatus } from '../enums/message-status.enum';
import { MessageType } from '../enums/message-type.enum';
import { SenderType } from '../enums/sender-type.enum';

@Injectable({
  providedIn: 'root',
})
export class AiAssistant {
  private apiUrl = '/api/ai-assistant';
  private messageStreamSubject = new BehaviorSubject<MessageModel | null>(null);
  public messageStream$ = this.messageStreamSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Send a message to the AI Assistant
   */
  sendMessage(request: AiRequestModel): Observable<AiResponseModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<AiResponseModel>(
      `${this.apiUrl}/chat`,
      request,
      { headers }
    ).pipe(
      tap((response) => {
        // Emit the response as a stream message
        const message: MessageModel = {
          id: response.messageId,
          conversationId: response.conversationId,
          sender: SenderType.ASSISTANT,
          type: response.type as MessageType,
          content: response.response,
          timestamp: new Date(),
          status: MessageStatus.RECEIVED,
          metadata: {
            processingTime: response.processingTime,
          },
        };
        this.messageStreamSubject.next(message);
      }),
      catchError((error) => {
        console.error('Error sending message:', error);
        throw error;
      })
    );
  }

  /**
   * Get conversation history
   */
  getConversationHistory(conversationId: string): Observable<MessageModel[]> {
    return this.http.get<MessageModel[]>(
      `${this.apiUrl}/conversations/${conversationId}/messages`
    ).pipe(
      catchError((error) => {
        console.error('Error fetching conversation history:', error);
        throw error;
      })
    );
  }

  /**
   * Generate document summary
   */
  generateSummary(
    content: string,
    conversationId?: string
  ): Observable<AiResponseModel> {
    const request: AiRequestModel = {
      conversationId,
      message: `Summarize the following document:\n\n${content}`,
    };
    return this.sendMessage(request);
  }

  /**
   * Generate legal document draft
   */
  generateDraft(
    template: string,
    context: string,
    conversationId?: string
  ): Observable<AiResponseModel> {
    const request: AiRequestModel = {
      conversationId,
      message: `Generate a legal document based on this template and context:\n\nTemplate:\n${template}\n\nContext:\n${context}`,
    };
    return this.sendMessage(request);
  }

  /**
   * Perform legal research
   */
  performLegalResearch(
    query: string,
    conversationId?: string
  ): Observable<AiResponseModel> {
    const request: AiRequestModel = {
      conversationId,
      message: `Perform legal research on: ${query}`,
    };
    return this.sendMessage(request);
  }

  /**
   * Extract important dates from document
   */
  extractDates(
    content: string,
    conversationId?: string
  ): Observable<AiResponseModel> {
    const request: AiRequestModel = {
      conversationId,
      message: `Extract all important dates from the following document:\n\n${content}`,
    };
    return this.sendMessage(request);
  }

  /**
   * Generate case timeline
   */
  generateTimeline(
    caseData: string,
    conversationId?: string
  ): Observable<AiResponseModel> {
    const request: AiRequestModel = {
      conversationId,
      message: `Create a detailed timeline based on this case information:\n\n${caseData}`,
    };
    return this.sendMessage(request);
  }

  /**
   * Get quick action suggestions
   */
  getQuickActions(
    conversationId?: string,
    context?: string
  ): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/quick-actions`,
      {
        params: {
          ...(conversationId && { conversationId }),
          ...(context && { context }),
        },
      }
    );
  }

  /**
   * Upload attachment
   */
  uploadAttachment(file: File): Observable<{ id: string; url: string; fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ id: string; url: string; fileName: string }>(
      `${this.apiUrl}/attachments/upload`,
      formData
    );
  }

  /**
   * Extract text from attachment
   */
  extractTextFromAttachment(attachmentId: string): Observable<{ text: string }> {
    return this.http.get<{ text: string }>(
      `${this.apiUrl}/attachments/${attachmentId}/extract-text`
    );
  }
}
