import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FieldSchema } from '../../../../core/models/form-schema.model';

@Component({
  standalone: true,
  selector: 'app-field-renderer',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './field-renderer.html'
})
export class FieldRenderer {

  field = input.required<FieldSchema>();
  group = input.required<FormGroup>();
}
