import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  selectContextCaseId,
  selectSelectedConversationId,
  selectShowContextPanel,
} from '../../../store';
import * as AiAssistantActions from '../../../store/ai-assistant.actions';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  action: () => void;
  color: string;
}

@Component({
  standalone: true,
  selector: 'app-quick-actions',
  imports: [CommonModule],
  templateUrl: './quick-actions.html',
  styleUrl: './quick-actions.css',
})
export class QuickActions implements OnInit {
  showContextPanel$!: Observable<boolean>;
  contextCaseId$!: Observable<string | undefined>;
  selectedConversationId$!: Observable<string | null>;

  quickActions: QuickAction[] = [
    {
      id: 'summarize',
      label: 'Summarize',
      icon: 'summarize',
      description: 'Summarize documents or case notes',
      action: () => this.performAction('summarize'),
      color: '#667eea',
    },
    {
      id: 'draft',
      label: 'Generate Draft',
      icon: 'edit_document',
      description: 'Generate legal documents',
      action: () => this.performAction('draft'),
      color: '#764ba2',
    },
    {
      id: 'research',
      label: 'Legal Research',
      icon: 'manage_search',
      description: 'Research case law and acts',
      action: () => this.performAction('research'),
      color: '#ec4899',
    },
    {
      id: 'dates',
      label: 'Extract Dates',
      icon: 'event',
      description: 'Extract important dates',
      action: () => this.performAction('dates'),
      color: '#f5576c',
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: 'timeline',
      description: 'Create case timeline',
      action: () => this.performAction('timeline'),
      color: '#0f766e',
    },
    {
      id: 'context',
      label: 'Set Context',
      icon: 'attach_file',
      description: 'Attach case details',
      action: () => this.toggleContextPanel(),
      color: '#118ab2',
    },
  ];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.showContextPanel$ = this.store.select(selectShowContextPanel);
    this.contextCaseId$ = this.store.select(selectContextCaseId);
    this.selectedConversationId$ = this.store.select(selectSelectedConversationId);
  }

  performAction(actionId: string): void {
    const prompts: Record<string, string> = {
      summarize: 'Summarize this matter. I will provide the document text or facts next.',
      draft: 'Help me prepare a legal draft. Ask for the document type, jurisdiction, facts, and relief.',
      research: 'Create a legal research plan for my issue. Ask me for jurisdiction and key facts.',
      dates: 'Extract important dates and deadlines from my case notes. Ask me to paste the notes.',
      timeline: 'Create a case timeline from the facts. Ask me for pleadings, orders, and hearing dates.',
    };

    const content = prompts[actionId];
    if (!content) {
      return;
    }

    this.selectedConversationId$.pipe(take(1)).subscribe((conversationId) => {
      if (!conversationId) {
        this.store.dispatch(AiAssistantActions.createConversation({ title: 'AI action' }));
        return;
      }

      this.store.dispatch(
        AiAssistantActions.sendMessage({
          conversationId,
          content,
        })
      );
    });
  }

  toggleContextPanel(): void {
    this.store.dispatch(AiAssistantActions.toggleContextPanel());
  }
}
