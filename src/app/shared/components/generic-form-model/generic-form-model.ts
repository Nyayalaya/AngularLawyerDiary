import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-generic-form-model',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './generic-form-model.html',
  styleUrl: './generic-form-model.css',
})
export class GenericFormModel {
  @Input() title = '';
  @Input() show = false;

  @Input({ required: true }) form!: FormGroup;
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();   // show red errors
      return;
    }
    this.save.emit();   // ✅ just notify parent
  }
}
