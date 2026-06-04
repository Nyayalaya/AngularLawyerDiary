import { Component, Input, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-markdown-renderer',
  imports: [CommonModule],
  templateUrl: './markdown-renderer.html',
  styleUrl: './markdown-renderer.css',
})
export class MarkdownRenderer {
  @Input() content: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  getRenderedHtml() {
    if (!this.content) return '';
    // Basic markdown to HTML conversion
    let html = this.content
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Headers
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    return this.sanitizer.sanitize(SecurityContext.HTML, '<p>' + html + '</p>') || '';
  }
}
