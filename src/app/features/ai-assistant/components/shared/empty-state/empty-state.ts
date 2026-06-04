import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  imports: [CommonModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {

  @Input() title: string = 'No content available';
  @Input() description: string = 'Please check back later or try refreshing the page.';
}
