import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generic-form-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-form-container.html',
  styleUrl: './generic-form-container.css',
})
export class GenericFormContainer {
/** Form title e.g., 'Add Court Type' */
  @Input() title: string = 'Form';

  /** Show / hide the container */
  @Input() open: boolean = false;
   @Input() submitLabel: string = 'Submit';

  /** Emit event when closed */
  @Output() closed = new EventEmitter<void>();

  /** Emit event when form submitted */
  @Output() submitted = new EventEmitter<void>();

  /** Internal signal to control animation state */
  menuOpen = signal(false);

  close() {
    this.closed.emit();
  }

  submit() {
    this.submitted.emit();
  }
}
