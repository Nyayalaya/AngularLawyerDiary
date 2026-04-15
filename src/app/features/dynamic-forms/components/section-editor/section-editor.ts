import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldEditor } from '../field-editor/field-editor';
import { FormSection } from '../../../../core/models/form-schema.model';

@Component({
  standalone: true,
  selector: 'app-section-editor',
  imports: [CommonModule, FormsModule, FieldEditor],
  templateUrl: './section-editor.html'
})
export class SectionEditor {

  section = input.required<FormSection>();
  deleteSection = output<void>();

removeField(i: number) {
  this.section().fields.splice(i, 1);
}

  addField() {
    this.section().fields.push({
      name: 'field_' + Date.now(),
      label: 'New Field',
      type: 'text'
    });
  }
}
