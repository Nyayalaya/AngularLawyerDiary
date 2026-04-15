import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-menu.html'
})
export class ActionMenu {

  @Output() view = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
