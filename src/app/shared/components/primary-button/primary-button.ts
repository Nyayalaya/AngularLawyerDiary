import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primary-button',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './primary-button.html',
  styleUrl: './primary-button.css',
})
export class PrimaryButton {
 /** Label shown on the button */
  @Input() label: string = 'Add';

  /** Optional ARIA label override */
  @Input() ariaLabel?: string;

  /** Optional icon (can be an icon name or emoji). Rendered before label. */
  @Input() icon?: string;

  /** Disable the button (e.g., permission or loading) */
  @Input() disabled: boolean = false;

  /** Variant: 'primary' | 'secondary' | 'ghost' (colors / styles) */
  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';

  /** Emits when clicked (only when not disabled) */
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (this.disabled) return;
    this.clicked.emit();
  }
}
