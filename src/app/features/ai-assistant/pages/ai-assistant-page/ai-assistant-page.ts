import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWindow } from '../../components/chat/chat-window/chat-window';
import { QuickActions } from '../../components/ai-actions/quick-actions/quick-actions';
import { ConversationSidebar } from '../../components/conversation/conversation-sidebar/conversation-sidebar';


@Component({
  standalone: true,
  selector: 'app-ai-assistant-page',
  imports: [CommonModule, ChatWindow,QuickActions,ConversationSidebar],
  templateUrl: './ai-assistant-page.html',
  styleUrl: './ai-assistant-page.css',
})
export class AiAssistantPage {

}
