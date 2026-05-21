import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-menu.html',
  styleUrls: ['./action-menu.css'],
  host: { class: 'app-action-menu' }
})
export class ActionMenu {
  @Input() showView: boolean = true;
  @Input() showEdit: boolean = true;
  @Input() showDelete: boolean = true;
  @Input() viewLabel: string = 'View';
  @Input() editLabel: string = 'Edit';
  @Input() deleteLabel: string = 'Delete';

  @Output() view: EventEmitter<void> = new EventEmitter<void>();
  @Output() edit: EventEmitter<void> = new EventEmitter<void>();
  @Output() delete: EventEmitter<void> = new EventEmitter<void>();
}
