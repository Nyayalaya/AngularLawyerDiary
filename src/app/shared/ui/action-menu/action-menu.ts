import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-menu.html',
  styleUrl: './action-menu.css',
})
export class ActionMenu {
 @Input() showView: boolean = true;
  @Input() showEdit: boolean = true;
  @Input() showDelete: boolean = true;

  @Output() view = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  menuOpen: boolean = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onView() { this.view.emit(); this.menuOpen = false; }
  onEdit() { this.edit.emit(); this.menuOpen = false; }
  onDelete() { this.delete.emit(); this.menuOpen = false; }
}
