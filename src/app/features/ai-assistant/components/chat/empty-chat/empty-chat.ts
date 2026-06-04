import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { selectSelectedConversationId } from '../../../store';
import * as AiAssistantActions from '../../../store/ai-assistant.actions';

@Component({
  selector: 'app-empty-chat',
  imports: [CommonModule],
  templateUrl: './empty-chat.html',
  styleUrl: './empty-chat.css',
})
export class EmptyChat {
  suggestedPrompts = [
    {
      title: 'Summarize Document',
      description: 'Turn pleadings, orders, or notes into a clean brief.',
      icon: 'description',
      prompt: 'Summarize this legal document. Ask me for the document text and format the result as issues, facts, risks, and next steps.',
    },
    {
      title: 'Prepare Draft',
      description: 'Start a notice, petition, reply, or application.',
      icon: 'edit_document',
      prompt: 'Help me prepare a legal draft. Ask for the document type, court, parties, facts, relief, and key dates.',
    },
    {
      title: 'Research Issue',
      description: 'Frame a research plan for statutes and case law.',
      icon: 'manage_search',
      prompt: 'Create a legal research plan for my issue. Ask for jurisdiction, facts, applicable law, and desired court level.',
    },
    {
      title: 'Extract Dates',
      description: 'Find hearing dates, limitation dates, and deadlines.',
      icon: 'event',
      prompt: 'Extract important dates and deadlines from my case notes. Ask me to paste the notes or upload the document.',
    },
    {
      title: 'Build Timeline',
      description: 'Convert scattered facts into a case chronology.',
      icon: 'timeline',
      prompt: 'Create a case timeline. Ask me for pleadings, orders, hearings, notices, and important events.',
    },
    {
      title: 'Hearing Notes',
      description: 'Prepare arguments, questions, and pending compliances.',
      icon: 'gavel',
      prompt: 'Help me prepare for the next hearing. Ask for case stage, last order, pending compliance, and arguments.',
    },
  ];

  readinessItems = [
    'Case stage',
    'Court or forum',
    'Key dates',
    'Relief sought',
  ];

  constructor(private store: Store) {}

  sendPrompt(prompt: string): void {
    this.store
      .select(selectSelectedConversationId)
      .pipe(take(1))
      .subscribe((conversationId) => {
        if (!conversationId) {
          this.store.dispatch(AiAssistantActions.createConversation({ title: prompt }));
          return;
        }

        this.store.dispatch(
          AiAssistantActions.sendMessage({
            conversationId,
            content: prompt,
          })
        );
      });
  }
}
