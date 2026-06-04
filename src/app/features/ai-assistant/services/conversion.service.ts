import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConversionModel {
  id: string;
  sourceFormat: string;
  targetFormat: string;
  sourceContent: string;
  convertedContent: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConversionService {
  private apiUrl = '/api/ai-assistant/conversions';

  constructor(private http: HttpClient) {}

  /**
   * Convert document format
   */
  convertDocument(
    sourceFormat: string,
    targetFormat: string,
    content: string
  ): Observable<ConversionModel> {
    return this.http.post<ConversionModel>(`${this.apiUrl}`, {
      sourceFormat,
      targetFormat,
      sourceContent: content,
    });
  }

  /**
   * Get conversion status
   */
  getConversionStatus(conversionId: string): Observable<ConversionModel> {
    return this.http.get<ConversionModel>(`${this.apiUrl}/${conversionId}`);
  }

  /**
   * Convert markdown to HTML
   */
  markdownToHtml(markdown: string): Observable<{ html: string }> {
    return this.http.post<{ html: string }>(
      `${this.apiUrl}/markdown-to-html`,
      { markdown }
    );
  }

  /**
   * Convert text to PDF
   */
  textToPdf(text: string, fileName: string = 'document'): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/text-to-pdf`,
      { text, fileName },
      { responseType: 'blob' }
    );
  }

  /**
   * Convert HTML to PDF
   */
  htmlToPdf(html: string, fileName: string = 'document'): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/html-to-pdf`,
      { html, fileName },
      { responseType: 'blob' }
    );
  }

  /**
   * Extract text from various formats
   */
  extractText(file: File): Observable<{ text: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ text: string }>(
      `${this.apiUrl}/extract-text`,
      formData
    );
  }
}
